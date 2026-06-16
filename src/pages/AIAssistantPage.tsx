import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Bot as BotIcon, Sparkles, MessageCircle } from 'lucide-react';
import { useAuth, useToast } from '../contexts';
import { useLocalStorage, generateId, formatDate } from '../hooks';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  messages: ChatMessage[];
  startedAt: string;
}

const faqs = [
  'What is the CJP movement about?',
  'How can I share my story?',
  'How do petitions work?',
  'What is the Youth Manifesto?',
  'How do I join a community?',
  'How do I earn badges?',
  'How do I report an issue?',
  'What rewards can I earn?',
];

const responses: Record<string, string> = {
  'what is the cjp movement about': "CJP (Cockroach Justice Party) is a youth-led movement fighting for employment opportunities, exam transparency, and against systemic corruption. We embrace the 'cockroach' label as a badge of resilience and refuse to be silenced. Our goal is to amplify youth voices and create systemic change through collective action.",
  'how can i share my story': "To share your story:\n\n1. Go to the Story Wall page\n2. Click 'Share Your Story'\n3. Add a title and your story content\n4. Choose a category\n5. Toggle 'Post anonymously' if you prefer\n6. Click 'Publish Story'\n\nYour voice matters! Every story helps bring attention to important issues.",
  'how do petitions work': "Petitions allow the community to rally behind specific demands:\n\n1. Anyone can create a petition with a title, description, and signature goal\n2. Users can sign petitions they support\n3. When a petition reaches its goal, we amplify it to authorities\n4. You can track progress with the signature counter and progress bar\n\nSign petitions that matter to you and help drive change!",
  'what is the youth manifesto': "The Youth Manifesto 2026 is a crowd-sourced document outlining the key demands of India's youth. You can vote on priority categories including:\n\n- Education Reforms\n- Employment & Jobs\n- Exam Transparency\n- Women's Rights\n- Technology & Innovation\n- Environment\n\nYour votes shape the movement's priorities!",
  'how do i join a community': "Joining communities is easy:\n\n1. Go to Communities page\n2. Browse or search for communities that interest you\n3. Click 'Join' on any community\n4. Once joined, you can post, comment, and interact with members\n\nYou can also create your own community if you want to bring people together around a specific cause!",
  'how do i earn badges': "You can earn badges through various activities:\n\n- 🪳 Certified Cockroach: Join the platform\n- 📝 First Story: Share your first story\n- ✊ Petition Starter: Create your first petition\n- 😂 Meme Lord: Create 10 memes\n- 🏗️ Community Builder: Create a community\n- ⭐ Rising Star: Earn 1000 reputation points\n\nStay active to unlock more badges and gain reputation!",
  'how do i report an issue': "To report an issue:\n\n1. Go to the Issue Map page\n2. Click 'Report an Issue'\n3. Select the state and district\n4. Choose a category and urgency level\n5. Describe the issue in detail\n6. Submit the report\n\nYour reports help us track issues across India and push for solutions.",
  'what rewards can i earn': "As you participate, you earn:\n\n- Reputation Points: For stories, petitions, votes, and comments\n- Badges: Special achievements for milestones\n- Community Recognition: Top contributors on the leaderboard\n\nReputation unlocks certain features and gives you more influence in the community. The more you contribute, the more impact you have!",
  default: "I'm here to help you navigate the CJP movement! I can answer questions about petitions, communities, the Youth Manifesto, badges, how to share stories, report issues, and more.\n\nWhat would you like to know?",
};

export default function AIAssistantPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('cjp_ai_conversations', []);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  const startNewConversation = () => {
    const newConv: Conversation = {
      id: generateId(),
      messages: [],
      startedAt: new Date().toISOString(),
    };
    setCurrentConversation(newConv);
    if (user) {
      setConversations(prev => [newConv, ...prev]);
    }
  };

  const getResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase().trim();
    for (const [key, value] of Object.entries(responses)) {
      if (key !== 'default' && lowerMessage.includes(key)) {
        return value;
      }
    }
    if (lowerMessage.includes('petition') || lowerMessage.includes('sign')) {
      return responses['how do petitions work'];
    }
    if (lowerMessage.includes('story') || lowerMessage.includes('share')) {
      return responses['how can i share my story'];
    }
    if (lowerMessage.includes('badge') || lowerMessage.includes('earn')) {
      return responses['how do i earn badges'];
    }
    if (lowerMessage.includes('community') || lowerMessage.includes('join')) {
      return responses['how do i join a community'];
    }
    return responses.default;
  };

  const sendMessage = (message?: string) => {
    const messageText = message || input.trim();
    if (!messageText) return;

    if (!currentConversation) {
      startNewConversation();
    }

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setCurrentConversation(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        messages: [...prev.messages, userMessage],
      };
      if (user) {
        setConversations(convs => convs.map(c => c.id === updated.id ? updated : c));
      }
      return updated;
    });
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: getResponse(messageText),
        timestamp: new Date().toISOString(),
      };
      setIsTyping(false);
      setCurrentConversation(prev => {
        if (!prev) return null;
        const updated = {
          ...prev,
          messages: [...prev.messages, aiResponse],
        };
        if (user) {
          setConversations(convs => convs.map(c => c.id === updated.id ? updated : c));
        }
        return updated;
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <BotIcon className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">AI Cockroach Assistant</h1>
        <p className="text-text-secondary">Your guide to the CJP movement</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {user && conversations.length > 0 && (
          <div className="lg:col-span-1 card h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-text-primary font-semibold">Conversations</h2>
              <button onClick={startNewConversation} className="text-primary text-sm hover:underline">
                + New
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {conversations.slice(0, 10).map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setCurrentConversation(conv)}
                  className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                    currentConversation?.id === conv.id
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-dark-hover text-text-muted'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  {conv.messages[0]?.content.slice(0, 20) || 'New conversation'}...
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={`${user && conversations.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          <div className="card min-h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {(!currentConversation || currentConversation.messages.length === 0) && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-text-muted mb-6">Hello! How can I help you today?</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {faqs.map((faq, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(faq)}
                        className="px-3 py-2 bg-dark-hover rounded-lg text-text-secondary text-sm hover:bg-dark-border hover:text-text-primary transition-colors"
                      >
                        {faq}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {currentConversation?.messages.map((msg, i) => (
                <div
                  key={msg.id || i}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-primary/20' : 'bg-secondary/20'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="w-5 h-5 text-primary" />
                    ) : (
                      <Bot className="w-5 h-5 text-secondary" />
                    )}
                  </div>
                  <div className={`p-4 rounded-2xl max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-primary text-dark-bg rounded-tr-none'
                      : 'bg-dark-hover text-text-primary rounded-tl-none'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="bg-dark-hover p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
              />
              <button type="submit" className="btn-primary px-5 rounded-xl">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
