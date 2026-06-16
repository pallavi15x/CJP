import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Bell, Send } from 'lucide-react';
import { useAuth } from '../contexts';

const popularQuestions = [
  'How do I sign a petition?',
  'What is the Youth Manifesto?',
  'How can I share my story?',
  'What is CJP movement?',
];

const aiResponses: Record<string, string> = {
  'How do I sign a petition?': 'To sign a petition, simply navigate to the Petitions page, find a petition you support, and click the "Sign Now" button. Your signature will be recorded instantly!',
  'What is the Youth Manifesto?': 'The Youth Manifesto 2026 is a crowd-sourced document outlining the key demands of India\'s youth. You can vote on categories like Education, Employment, and Exam Transparency!',
  'How can I share my story?': 'Head to the Story Wall and click "Share Your Story". You can choose to post anonymously or with your username. Your voice matters!',
  'What is CJP movement?': 'CJP (Cockroach Justice Party) is a youth movement fighting for employment, transparent exams, and against systemic corruption. We turn the "cockroach" label into a badge of resilience!',
  default: 'Thanks for your question! Our movement is about empowering youth across India. Feel free to explore petitions, share your story, or vote on the Youth Manifesto!',
};

export default function RightSidebar() {
  const { user } = useAuth();
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const response = aiResponses[aiInput] || aiResponses.default;
    setAiResponse(response);
  };

  const handleQuickQuestion = (question: string) => {
    setAiInput(question);
    setAiResponse(aiResponses[question] || aiResponses.default);
  };

  return (
    <aside className="hidden xl:block fixed right-0 top-16 bottom-0 w-80 bg-dark-bg border-l border-dark-border overflow-y-auto">
      <div className="p-4 space-y-4">
        {user && (
          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h3 className="text-text-primary font-semibold">{user.username}</h3>
                <p className="text-text-muted text-sm">{user.location || 'India'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                {user.badge || 'New Member'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-text-primary">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-semibold">{user.reputation?.toLocaleString() || 0}</span>
              <span className="text-text-muted text-sm">Reputation Points</span>
            </div>
          </div>
        )}

        {user && user.badges && user.badges.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-text-primary font-semibold">My Badges</h3>
              <Link to="/profile" className="text-primary text-sm hover:underline">View All</Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.badges.slice(0, 5).map((badge, i) => (
                <div key={i} className="w-10 h-10 bg-dark-hover rounded-lg flex items-center justify-center text-lg" title={badge.name}>
                  {badge.icon}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h3 className="text-text-primary font-semibold">AI Cockroach</h3>
              <p className="text-text-muted text-xs">Your assistant</p>
            </div>
          </div>
          <p className="text-text-secondary text-sm mb-4">
            {aiResponse || "Hi! I'm your AI assistant. How can I help you today?"}
          </p>
          <form onSubmit={handleAiSubmit} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                placeholder="Ask Anything"
                className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-primary"
              />
              <button type="submit" className="p-2 bg-primary rounded-lg hover:bg-primary-hover transition-colors">
                <Send className="w-5 h-5 text-dark-bg" />
              </button>
            </div>
          </form>
          <div className="space-y-2">
            <p className="text-text-muted text-xs font-medium">Popular Questions:</p>
            {popularQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(q)}
                className="block w-full text-left px-3 py-2 bg-dark-hover rounded-lg text-text-secondary text-sm hover:text-text-primary hover:bg-dark-border/50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-text-primary font-semibold">Stay Updated</h3>
          </div>
          <p className="text-text-muted text-sm mb-3">Get notified about new petitions and stories</p>
          <button className="btn-primary w-full text-sm">Enable Notifications</button>
        </div>
      </div>
    </aside>
  );
}
