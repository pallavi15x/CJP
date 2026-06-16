import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useLocalStorage, generateId, formatDate } from '../hooks';
import { useAuth } from './AuthContext';

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  upvotes: number;
  replies: Comment[];
  replyTo?: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  isAnonymous: boolean;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  savedBy: string[];
  reportedBy: string[];
  views: number;
}

export interface Petition {
  id: string;
  title: string;
  description: string;
  category: string;
  goal: number;
  signatures: string[];
  createdBy: string;
  creatorName: string;
  createdAt: string;
  image: string;
  urgent: boolean;
  status: 'active' | 'achieved' | 'closed';
}

export interface Meme {
  id: string;
  caption: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  category: string;
  createdAt: string;
  likes: string[];
  comments: Comment[];
  shares: number;
  isMemeOfWeek: boolean;
  savedBy: string[];
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
  votedBy: string[];
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  createdAt: string;
  endsAt: string;
  votedBy: string[];
  category: string;
}

export interface IssueReport {
  id: string;
  state: string;
  district: string;
  category: string;
  description: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  upvotes: number;
  upvotedBy: string[];
  status: 'reported' | 'investigating' | 'resolved';
  urgency: 'low' | 'medium' | 'high';
}

export interface CommunityMember {
  userId: string;
  joinedAt: string;
  role: 'member' | 'moderator' | 'admin';
}

export interface CommunityPost {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  likes: string[];
  comments: Comment[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  createdBy: string;
  createdAt: string;
  members: CommunityMember[];
  posts: CommunityPost[];
}

export interface Notification {
  id: string;
  type: 'comment' | 'milestone' | 'badge' | 'community' | 'petition' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  data?: Record<string, unknown>;
}

interface DataContextType {
  // Stories
  stories: Story[];
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'comments' | 'savedBy' | 'reportedBy' | 'views'>) => Story;
  updateStory: (id: string, updates: Partial<Story>) => void;
  deleteStory: (id: string) => void;
  upvoteStory: (id: string) => void;
  downvoteStory: (id: string) => void;
  commentOnStory: (storyId: string, content: string, replyTo?: string) => void;
  saveStory: (id: string) => void;
  reportStory: (id: string) => void;

  // Petitions
  petitions: Petition[];
  addPetition: (petition: Omit<Petition, 'id' | 'signatures' | 'createdAt' | 'status'>) => Petition;
  updatePetition: (id: string, updates: Partial<Petition>) => void;
  deletePetition: (id: string) => void;
  signPetition: (id: string) => boolean;

  // Memes
  memes: Meme[];
  addMeme: (meme: Omit<Meme, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'isMemeOfWeek' | 'savedBy'>) => Meme;
  likeMeme: (id: string) => void;
  commentOnMeme: (memeId: string, content: string) => void;
  shareMeme: (id: string) => void;
  saveMeme: (id: string) => void;

  // Polls
  polls: Poll[];
  manifestoPoll: Poll;
  votePoll: (pollId: string, optionId: string) => boolean;
  changeVote: (pollId: string, newOptionId: string) => boolean;

  // Issues
  issues: IssueReport[];
  addIssue: (issue: Omit<IssueReport, 'id' | 'createdAt' | 'upvotes' | 'upvotedBy' | 'status'>) => IssueReport;
  upvoteIssue: (id: string) => void;

  // Communities
  communities: Community[];
  createCommunity: (community: Omit<Community, 'id' | 'createdAt' | 'members' | 'posts'>) => Community;
  joinCommunity: (id: string) => void;
  leaveCommunity: (id: string) => void;
  postInCommunity: (communityId: string, content: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: number;

  // Search
  searchAll: (query: string) => {
    stories: Story[];
    petitions: Petition[];
    communities: Community[];
    memes: Meme[];
  };
}

const initialPolls: Poll[] = [
  {
    id: 'manifesto-poll',
    question: 'Youth Manifesto 2026 - Priority Vote',
    options: [
      { id: 'edu', label: 'Education Reforms', votes: 45678, votedBy: [] },
      { id: 'emp', label: 'Employment & Jobs', votes: 61234, votedBy: [] },
      { id: 'exam', label: 'Exam Transparency', votes: 40234, votedBy: [] },
      { id: 'women', label: "Women's Rights", votes: 32678, votedBy: [] },
      { id: 'tech', label: 'Technology & Innovation', votes: 18567, votedBy: [] },
      { id: 'env', label: 'Environment & Sustainability', votes: 14712, votedBy: [] },
    ],
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00.000Z',
    endsAt: '2026-12-31T23:59:59.000Z',
    votedBy: [],
    category: 'manifesto',
  },
];

const initialCommunities: Community[] = [
  {
    id: 'comm-1',
    name: 'Exam Survivors',
    description: 'Support group for those navigating flawed exam systems',
    category: 'Support',
    icon: '📝',
    createdBy: 'user-1',
    createdAt: '2024-01-15T00:00:00.000Z',
    members: [{ userId: 'user-1', joinedAt: '2024-01-15T00:00:00.000Z', role: 'admin' }],
    posts: [],
  },
  {
    id: 'comm-2',
    name: 'Job Seekers United',
    description: 'Share opportunities, tips, and support for employment',
    category: 'Career',
    icon: '💼',
    createdBy: 'user-2',
    createdAt: '2024-02-01T00:00:00.000Z',
    members: [{ userId: 'user-2', joinedAt: '2024-02-01T00:00:00.000Z', role: 'admin' }],
    posts: [],
  },
];

const initialStories: Story[] = [
  {
    id: 'story-1',
    title: 'How I Survived 3 Years of Unemployment',
    content: 'My journey through the struggle of unemployment taught me resilience. When I lost my job during the pandemic, I never imagined it would take 3 years to find another. But here I am, sharing my story of persistence, networking, and self-improvement that finally led me to a new beginning.',
    category: 'Career',
    authorId: 'user-1',
    authorName: 'Lazy_Rebel',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    isAnonymous: false,
    createdAt: '2024-06-01T10:00:00.000Z',
    upvotes: 1234,
    downvotes: 23,
    comments: [],
    savedBy: [],
    reportedBy: [],
    views: 5678,
  },
];

const initialPetitions: Petition[] = [
  {
    id: 'pet-1',
    title: 'Scrap NTA and Rebuild Exam System',
    description: 'We demand a complete overhaul of the National Testing Agency to ensure fair, transparent examinations for all students. The repeated paper leaks, technical glitches, and irregular results have destroyed careers of millions.',
    category: 'Education',
    goal: 200000,
    signatures: [],
    createdBy: 'user-1',
    creatorName: 'Lazy_Rebel',
    createdAt: '2024-03-15T00:00:00.000Z',
    image: 'https://images.unsplash.com/photo-1434030216411-57b8a0ed9f6b?w=600&h=300&fit=crop',
    urgent: true,
    status: 'active',
  },
];

const initialMemes: Meme[] = [
  {
    id: 'meme-1',
    caption: 'WHEN THEY CALL US COCKROACHES BUT WE OUTNUMBER THEIR FOLLOWERS',
    imageUrl: 'https://images.unsplash.com/photo-1509343256529-8ab3c22f3f7b?w=600&h=400&fit=crop',
    authorId: 'user-1',
    authorName: 'Lazy_Rebel',
    category: 'Politics',
    createdAt: '2024-05-01T00:00:00.000Z',
    likes: [],
    comments: [],
    shares: 890,
    isMemeOfWeek: true,
    savedBy: [],
  },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, addReputation, updateStats, addBadge } = useAuth();

  const [stories, setStories] = useLocalStorage<Story[]>('cjp_stories', initialStories);
  const [petitions, setPetitions] = useLocalStorage<Petition[]>('cjp_petitions', initialPetitions);
  const [memes, setMemes] = useLocalStorage<Meme[]>('cjp_memes', initialMemes);
  const [polls, setPolls] = useLocalStorage<Poll[]>('cjp_polls', initialPolls);
  const [issues, setIssues] = useLocalStorage<IssueReport[]>('cjp_issues', []);
  const [communities, setCommunities] = useLocalStorage<Community[]>('cjp_communities', initialCommunities);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('cjp_notifications', []);

  // Stories
  const addStory = useCallback((storyData: Omit<Story, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'comments' | 'savedBy' | 'reportedBy' | 'views'>): Story => {
    const story: Story = {
      ...storyData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      comments: [],
      savedBy: [],
      reportedBy: [],
      views: 0,
    };
    setStories(prev => [story, ...prev]);
    if (user) {
      updateStats({ storiesCreated: (user.stats?.storiesCreated || 0) + 1 });
      addReputation(50);
      if ((user.stats?.storiesCreated || 0) === 0) {
        addBadge({ name: 'First Story', icon: '📝', description: 'Shared your first story' });
      }
    }
    return story;
  }, [user, setStories, updateStats, addReputation, addBadge]);

  const updateStory = useCallback((id: string, updates: Partial<Story>) => {
    setStories(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, [setStories]);

  const deleteStory = useCallback((id: string) => {
    setStories(prev => prev.filter(s => s.id !== id));
  }, [setStories]);

  const upvoteStory = useCallback((id: string) => {
    if (!user) return;
    setStories(prev => prev.map(s => {
      if (s.id === id) {
        const alreadyUpvoted = s.upvotes;
        return { ...s, upvotes: s.upvotes + 1 };
      }
      return s;
    }));
  }, [user, setStories]);

  const downvoteStory = useCallback((id: string) => {
    setStories(prev => prev.map(s => s.id === id ? { ...s, downvotes: s.downvotes + 1 } : s));
  }, [setStories]);

  const commentOnStory = useCallback((storyId: string, content: string, replyTo?: string) => {
    if (!user) return;
    const comment: Comment = {
      id: generateId(),
      content,
      authorId: user.id,
      authorName: user.username,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      replies: [],
      replyTo,
    };
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        if (replyTo) {
          const addReplyToComment = (comments: Comment[]): Comment[] => {
            return comments.map(c => {
              if (c.id === replyTo) {
                return { ...c, replies: [...c.replies, comment] };
              }
              return { ...c, replies: addReplyToComment(c.replies) };
            });
          };
          return { ...s, comments: addReplyToComment(s.comments) };
        }
        return { ...s, comments: [...s.comments, comment] };
      }
      return s;
    }));
    updateStats({ commentsPosted: (user.stats?.commentsPosted || 0) + 1 });
    addReputation(10);
  }, [user, setStories, updateStats, addReputation]);

  const saveStory = useCallback((id: string) => {
    if (!user) return;
    setStories(prev => prev.map(s => {
      if (s.id === id) {
        const saved = s.savedBy.includes(user.id);
        return {
          ...s,
          savedBy: saved ? s.savedBy.filter(uid => uid !== user.id) : [...s.savedBy, user.id],
        };
      }
      return s;
    }));
  }, [user, setStories]);

  const reportStory = useCallback((id: string) => {
    if (!user) return;
    setStories(prev => prev.map(s => {
      if (s.id === id && !s.reportedBy.includes(user.id)) {
        return { ...s, reportedBy: [...s.reportedBy, user.id] };
      }
      return s;
    }));
  }, [user, setStories]);

  // Petitions
  const addPetition = useCallback((petitionData: Omit<Petition, 'id' | 'signatures' | 'createdAt' | 'status'>): Petition => {
    const petition: Petition = {
      ...petitionData,
      id: generateId(),
      signatures: [],
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    setPetitions(prev => [petition, ...prev]);
    if (user) {
      updateStats({ petitionsCreated: (user.stats?.petitionsCreated || 0) + 1 });
      addReputation(100);
      addBadge({ name: 'Petition Starter', icon: '✊', description: 'Created your first petition' });
    }
    return petition;
  }, [user, setPetitions, updateStats, addReputation, addBadge]);

  const updatePetition = useCallback((id: string, updates: Partial<Petition>) => {
    setPetitions(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, [setPetitions]);

  const deletePetition = useCallback((id: string) => {
    setPetitions(prev => prev.filter(p => p.id !== id));
  }, [setPetitions]);

  const signPetition = useCallback((id: string): boolean => {
    if (!user) return false;
    let signed = false;
    setPetitions(prev => prev.map(p => {
      if (p.id === id && !p.signatures.includes(user.id)) {
        signed = true;
        const newSigCount = p.signatures.length + 1;
        const status = newSigCount >= p.goal ? 'achieved' : 'active';
        return { ...p, signatures: [...p.signatures, user.id], status };
      }
      return p;
    }));
    if (signed) {
      updateStats({ petitionsSigned: (user.stats?.petitionsSigned || 0) + 1 });
      addReputation(20);
    }
    return signed;
  }, [user, setPetitions, updateStats, addReputation]);

  // Memes
  const addMeme = useCallback((memeData: Omit<Meme, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'isMemeOfWeek' | 'savedBy'>): Meme => {
    const meme: Meme = {
      ...memeData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
      shares: 0,
      isMemeOfWeek: false,
      savedBy: [],
    };
    setMemes(prev => [meme, ...prev]);
    if (user) {
      updateStats({ memesCreated: (user.stats?.memesCreated || 0) + 1 });
      addReputation(25);
      if ((user.stats?.memesCreated || 0) >= 9) {
        addBadge({ name: 'Meme Lord', icon: '😂', description: 'Created 10 memes' });
      }
    }
    return meme;
  }, [user, setMemes, updateStats, addReputation, addBadge]);

  const likeMeme = useCallback((id: string) => {
    if (!user) return;
    setMemes(prev => prev.map(m => {
      if (m.id === id) {
        const liked = m.likes.includes(user.id);
        return {
          ...m,
          likes: liked ? m.likes.filter(uid => uid !== user.id) : [...m.likes, user.id],
        };
      }
      return m;
    }));
  }, [user, setMemes]);

  const commentOnMeme = useCallback((memeId: string, content: string) => {
    if (!user) return;
    const comment: Comment = {
      id: generateId(),
      content,
      authorId: user.id,
      authorName: user.username,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      replies: [],
    };
    setMemes(prev => prev.map(m => m.id === memeId ? { ...m, comments: [...m.comments, comment] } : m));
  }, [user, setMemes]);

  const shareMeme = useCallback((id: string) => {
    setMemes(prev => prev.map(m => m.id === id ? { ...m, shares: m.shares + 1 } : m));
  }, [setMemes]);

  const saveMeme = useCallback((id: string) => {
    if (!user) return;
    setMemes(prev => prev.map(m => {
      if (m.id === id) {
        const saved = m.savedBy.includes(user.id);
        return {
          ...m,
          savedBy: saved ? m.savedBy.filter(uid => uid !== user.id) : [...m.savedBy, user.id],
        };
      }
      return m;
    }));
  }, [user, setMemes]);

  // Polls
  const votePoll = useCallback((pollId: string, optionId: string): boolean => {
    if (!user) return false;
    let voted = false;
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId && !poll.votedBy.includes(user.id)) {
        voted = true;
        addReputation(5);
        updateStats({ votesCast: (user.stats?.votesCast || 0) + 1 });
        return {
          ...poll,
          votedBy: [...poll.votedBy, user.id],
          options: poll.options.map(opt =>
            opt.id === optionId
              ? { ...opt, votes: opt.votes + 1, votedBy: [...opt.votedBy, user.id] }
              : opt
          ),
        };
      }
      return poll;
    }));
    return voted;
  }, [user, setPolls, addReputation, updateStats]);

  const changeVote = useCallback((pollId: string, newOptionId: string): boolean => {
    if (!user) return false;
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId && poll.votedBy.includes(user.id)) {
        return {
          ...poll,
          options: poll.options.map(opt => {
            if (opt.votedBy.includes(user.id)) {
              return { ...opt, votes: opt.votes - 1, votedBy: opt.votedBy.filter(uid => uid !== user.id) };
            }
            if (opt.id === newOptionId) {
              return { ...opt, votes: opt.votes + 1, votedBy: [...opt.votedBy, user.id] };
            }
            return opt;
          }),
        };
      }
      return poll;
    }));
    return true;
  }, [user, setPolls]);

  // Issues
  const addIssue = useCallback((issueData: Omit<IssueReport, 'id' | 'createdAt' | 'upvotes' | 'upvotedBy' | 'status'>): IssueReport => {
    const issue: IssueReport = {
      ...issueData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      upvotedBy: [],
      status: 'reported',
    };
    setIssues(prev => [issue, ...prev]);
    addReputation(30);
    return issue;
  }, [setIssues, addReputation]);

  const upvoteIssue = useCallback((id: string) => {
    if (!user) return;
    setIssues(prev => prev.map(issue => {
      if (issue.id === id && !issue.upvotedBy.includes(user.id)) {
        return { ...issue, upvotes: issue.upvotes + 1, upvotedBy: [...issue.upvotedBy, user.id] };
      }
      return issue;
    }));
  }, [user, setIssues]);

  // Communities
  const createCommunity = useCallback((communityData: Omit<Community, 'id' | 'createdAt' | 'members' | 'posts'>): Community => {
    const community: Community = {
      ...communityData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      members: [{
        userId: user!.id,
        joinedAt: new Date().toISOString(),
        role: 'admin',
      }],
      posts: [],
    };
    setCommunities(prev => [community, ...prev]);
    addReputation(100);
    addBadge({ name: 'Community Builder', icon: '🏗️', description: 'Created your first community' });
    return community;
  }, [user, setCommunities, addReputation, addBadge]);

  const joinCommunity = useCallback((id: string) => {
    if (!user) return;
    setCommunities(prev => prev.map(c => {
      if (c.id === id && !c.members.some(m => m.userId === user.id)) {
        updateStats({ communitiesJoined: (user.stats?.communitiesJoined || 0) + 1 });
        return {
          ...c,
          members: [...c.members, { userId: user.id, joinedAt: new Date().toISOString(), role: 'member' }],
        };
      }
      return c;
    }));
  }, [user, setCommunities, updateStats]);

  const leaveCommunity = useCallback((id: string) => {
    if (!user) return;
    setCommunities(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, members: c.members.filter(m => m.userId !== user.id) };
      }
      return c;
    }));
  }, [user, setCommunities]);

  const postInCommunity = useCallback((communityId: string, content: string) => {
    if (!user) return;
    const post: CommunityPost = {
      id: generateId(),
      content,
      authorId: user.id,
      authorName: user.username,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
    };
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        return { ...c, posts: [post, ...c.posts] };
      }
      return c;
    }));
    addReputation(15);
  }, [user, setCommunities, addReputation]);

  // Notifications
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, [setNotifications]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, [setNotifications]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Search
  const searchAll = useCallback((query: string) => {
    const q = query.toLowerCase();
    return {
      stories: stories.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q) ||
        s.authorName.toLowerCase().includes(q)
      ),
      petitions: petitions.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      ),
      communities: communities.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      ),
      memes: memes.filter(m =>
        m.caption.toLowerCase().includes(q)
      ),
    };
  }, [stories, petitions, communities, memes]);

  const manifestoPoll = polls.find(p => p.id === 'manifesto-poll') || polls[0];

  return (
    <DataContext.Provider value={{
      stories,
      addStory,
      updateStory,
      deleteStory,
      upvoteStory,
      downvoteStory,
      commentOnStory,
      saveStory,
      reportStory,
      petitions,
      addPetition,
      updatePetition,
      deletePetition,
      signPetition,
      memes,
      addMeme,
      likeMeme,
      commentOnMeme,
      shareMeme,
      saveMeme,
      polls,
      manifestoPoll,
      votePoll,
      changeVote,
      issues,
      addIssue,
      upvoteIssue,
      communities,
      createCommunity,
      joinCommunity,
      leaveCommunity,
      postInCommunity,
      notifications,
      addNotification,
      markNotificationRead,
      clearNotifications,
      unreadCount,
      searchAll,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
