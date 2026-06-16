import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useLocalStorage, generateId } from '../hooks';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  location: string;
  bio: string;
  badge: string;
  reputation: number;
  badges: Badge[];
  joinedAt: string;
  stats: {
    storiesCreated: number;
    commentsPosted: number;
    petitionsSigned: number;
    petitionsCreated: number;
    memesCreated: number;
    votesCast: number;
    communitiesJoined: number;
  };
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, username: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addReputation: (points: number) => void;
  addBadge: (badge: Omit<Badge, 'id' | 'earnedAt'>) => void;
  updateStats: (updates: Partial<User['stats']>) => void;
  isAuthenticated: boolean;
  getUserById: (id: string) => User | undefined;
  getUserByUsername: (username: string) => User | undefined;
}

const defaultBadges: Badge[] = [
  { id: '1', name: 'Certified Cockroach', icon: '🪳', description: 'Joined the CJP movement', earnedAt: new Date().toISOString() },
];

const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop';

const initialUsers: User[] = [
  {
    id: 'user-1',
    name: 'Lazy Rebel',
    username: 'Lazy_Rebel',
    email: 'lazy@rebel.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    location: 'Delhi, India',
    bio: 'Fighting for transparency and justice',
    badge: 'Exam Survivor',
    reputation: 12680,
    badges: defaultBadges,
    joinedAt: '2024-01-15T10:00:00.000Z',
    stats: {
      storiesCreated: 15,
      commentsPosted: 89,
      petitionsSigned: 23,
      petitionsCreated: 3,
      memesCreated: 7,
      votesCast: 45,
      communitiesJoined: 4,
    },
  },
  {
    id: 'user-2',
    name: 'Delhi Fighter',
    username: 'DelhiFighter',
    email: 'delhi@fighter.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    location: 'New Delhi, India',
    bio: 'Voice of the youth',
    badge: 'Voice of Youth',
    reputation: 11450,
    badges: defaultBadges,
    joinedAt: '2024-02-01T10:00:00.000Z',
    stats: {
      storiesCreated: 8,
      commentsPosted: 56,
      petitionsSigned: 18,
      petitionsCreated: 1,
      memesCreated: 12,
      votesCast: 34,
      communitiesJoined: 3,
    },
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useLocalStorage<User[]>('cjp_users', initialUsers);
  const [user, setUser] = useLocalStorage<User | null>('cjp_current_user', null);

  const login = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!foundUser) {
      return { success: false, error: 'Invalid email or password' };
    }
    setUser(foundUser);
    return { success: true };
  }, [users, setUser]);

  const signup = useCallback((name: string, username: string, email: string, password: string): { success: boolean; error?: string } => {
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'Username already taken' };
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser: User = {
      id: generateId(),
      name,
      username,
      email,
      password,
      avatar: defaultAvatar,
      location: '',
      bio: '',
      badge: 'New Member',
      reputation: 0,
      badges: [{ id: generateId(), name: 'Certified Cockroach', icon: '🪳', description: 'Joined the CJP movement', earnedAt: new Date().toISOString() }],
      joinedAt: new Date().toISOString(),
      stats: {
        storiesCreated: 0,
        commentsPosted: 0,
        petitionsSigned: 0,
        petitionsCreated: 0,
        memesCreated: 0,
        votesCast: 0,
        communitiesJoined: 0,
      },
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return { success: true };
  }, [users, setUsers, setUser]);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
    setUsers(prev => prev.map(u => u.id === user?.id ? { ...u, ...updates } : u));
  }, [user?.id, setUser, setUsers]);

  const addReputation = useCallback((points: number) => {
    setUser(prev => prev ? { ...prev, reputation: prev.reputation + points } : null);
    setUsers(prev => prev.map(u => u.id === user?.id ? { ...u, reputation: u.reputation + points } : u));
  }, [user?.id, setUser, setUsers]);

  const addBadge = useCallback((badge: Omit<Badge, 'id' | 'earnedAt'>) => {
    const newBadge: Badge = {
      ...badge,
      id: generateId(),
      earnedAt: new Date().toISOString(),
    };
    setUser(prev => prev ? { ...prev, badges: [...prev.badges, newBadge] } : null);
    setUsers(prev => prev.map(u => u.id === user?.id ? { ...u, badges: [...u.badges, newBadge] } : u));
  }, [user?.id, setUser, setUsers]);

  const updateStats = useCallback((updates: Partial<User['stats']>) => {
    setUser(prev => prev ? { ...prev, stats: { ...prev.stats, ...updates } } : null);
    setUsers(prev => prev.map(u => u.id === user?.id ? { ...u, stats: { ...u.stats, ...updates } } : u));
  }, [user?.id, setUser, setUsers]);

  const getUserById = useCallback((id: string) => users.find(u => u.id === id), [users]);
  const getUserByUsername = useCallback((username: string) => users.find(u => u.username.toLowerCase() === username.toLowerCase()), [users]);

  return (
    <AuthContext.Provider value={{
      user,
      users,
      login,
      signup,
      logout,
      updateProfile,
      addReputation,
      addBadge,
      updateStats,
      isAuthenticated: !!user,
      getUserById,
      getUserByUsername,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
