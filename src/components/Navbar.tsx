import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Bell, ShoppingCart, Menu, X, User, LogOut, Settings, BarChart2 } from 'lucide-react';
import { useTheme, useAuth, useCart, useData } from '../contexts';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { unreadCount } = useData();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-lg border-b border-dark-border px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-xl font-bold text-dark-bg">C</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-text-primary leading-tight">COCKROACH CONNECT</h1>
            <p className="text-xs text-text-secondary">Voice of the Lazy & Unemployed</p>
          </div>
        </Link>

        <div className="hidden md:flex flex-1 max-w-lg mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search issues, posts, people..."
              className="w-full bg-dark-card border border-dark-border rounded-full py-2.5 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </form>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-dark-hover transition-colors text-text-secondary hover:text-text-primary"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Link to="/notifications" className="relative p-2 rounded-full hover:bg-dark-hover transition-colors text-text-secondary hover:text-text-primary">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative p-2 rounded-full hover:bg-dark-hover transition-colors text-text-secondary hover:text-text-primary">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-dark-bg text-xs font-bold rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-dark-hover transition-colors"
              >
                <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-dark-card border border-dark-border rounded-lg shadow-xl overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-dark-border">
                    <p className="text-text-primary font-semibold">{user.username}</p>
                    <p className="text-text-muted text-sm">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-dark-hover text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <User className="w-5 h-5" />
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-dark-hover text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <BarChart2 className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-dark-hover text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-dark-border py-2">
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); navigate('/'); }}
                      className="flex items-center gap-3 px-4 py-2.5 w-full hover:bg-dark-hover text-text-secondary hover:text-secondary transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm hidden sm:block">
              Login / Sign Up
            </Link>
          )}

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-full hover:bg-dark-hover transition-colors text-text-secondary"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="lg:hidden mt-4 p-4 bg-dark-card rounded-lg border border-dark-border animate-fade-in">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-dark-bg border border-dark-border rounded-full py-2.5 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </form>
          <MobileNavLinks onClose={() => setShowMobileMenu(false)} />
        </div>
      )}
    </nav>
  );
}

function MobileNavLinks({ onClose }: { onClose: () => void }) {
  const links = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/stories', label: 'Story Wall', icon: '📝' },
    { to: '/petitions', label: 'Petitions', icon: '✊' },
    { to: '/polls', label: 'Voice Polls', icon: '📊' },
    { to: '/memes', label: 'Meme Parliament', icon: '😂' },
    { to: '/communities', label: 'Communities', icon: '👥' },
    { to: '/issue-map', label: 'Issue Map', icon: '🗺️' },
    { to: '/store', label: 'Store', icon: '🛒' },
    { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { to: '/assistant', label: 'AI Assistant', icon: '🤖' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {links.map(link => (
        <Link
          key={link.to}
          to={link.to}
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-hover transition-colors text-text-primary"
        >
          <span className="text-xl">{link.icon}</span>
          <span className="text-sm font-medium">{link.label}</span>
        </Link>
      ))}
    </div>
  );
}
