import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Map, FileText, ScrollText, MessageSquare, BarChart2, Users, Trophy, Bot, Instagram, Youtube, MessageCircle } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/stories', label: 'Story Wall', icon: BookOpen },
  { to: '/issue-map', label: 'Issue Map', icon: Map },
  { to: '/manifesto', label: 'Manifesto Builder', icon: FileText },
  { to: '/petitions', label: 'Petitions', icon: ScrollText },
  { to: '/memes', label: 'Meme Parliament', icon: MessageSquare },
  { to: '/youth-dashboard', label: 'Youth Dashboard', icon: BarChart2 },
  { to: '/polls', label: 'Voice Polls', icon: BarChart2 },
  { to: '/communities', label: 'Communities', icon: Users },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/assistant', label: 'AI Assistant', icon: Bot },
];

export default function LeftSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-dark-bg border-r border-dark-border overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-dark-hover hover:text-text-primary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-4">
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-4 border border-primary/30">
          <div className="w-16 h-16 mx-auto mb-3 bg-primary rounded-full flex items-center justify-center">
            <span className="text-3xl">🪳</span>
          </div>
          <h3 className="text-text-primary font-bold text-center mb-1">Join the Movement</h3>
          <p className="text-text-muted text-sm text-center mb-3">Become a Certified Cockroach</p>
          <Link to="/signup" className="btn-primary block text-center text-sm">
            Join Now — It's Free!
          </Link>
          <p className="text-text-muted text-xs text-center mt-3">
            Already a member?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-dark-border">
        <div className="flex justify-center gap-4">
          <a href="#" className="text-text-muted hover:text-primary transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="text-text-muted hover:text-primary transition-colors">
            <MessageCircle className="w-5 h-5" />
          </a>
          <a href="#" className="text-text-muted hover:text-primary transition-colors">
            <Youtube className="w-5 h-5" />
          </a>
          <a href="#" className="text-text-muted hover:text-text-primary transition-colors">
            <span className="text-sm font-bold">X</span>
          </a>
        </div>
        <p className="text-text-muted text-xs text-center mt-3">
          © 2026 Cockroach Connect. CJP.
        </p>
      </div>
    </aside>
  );
}
