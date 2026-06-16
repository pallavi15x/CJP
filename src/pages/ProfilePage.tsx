import { Link } from 'react-router-dom';
import { Zap, Award, BookOpen, ScrollText, Settings } from 'lucide-react';
import { useAuth } from '../contexts';

const badges = [
  { id: '1', name: 'Certified Cockroach', icon: '🪳', description: 'Joined the movement', earned: true },
  { id: '2', name: 'First Story', icon: '📝', description: 'Shared your first story', earned: true },
  { id: '3', name: 'Petition Pioneer', icon: '✊', description: 'Created your first petition', earned: true },
  { id: '4', name: 'Rising Star', icon: '⭐', description: 'Earned 1000 reputation points', earned: true },
  { id: '5', name: 'Voice of Youth', icon: '📢', description: 'Got 100 upvotes', earned: true },
  { id: '6', name: 'Meme Master', icon: '😂', description: 'Created top meme', earned: false },
  { id: '7', name: 'Poll Pro', icon: '📊', description: 'Voted 50 times', earned: false },
  { id: '8', name: 'Legend', icon: '🏆', description: 'Reached 10,000 points', earned: false },
];

const activities = [
  { type: 'story', title: 'Shared a story: "How I Survived 3 Years of Unemployment"', time: '2h ago', icon: BookOpen },
  { type: 'petition', title: 'Signed petition: "Scrap NTA and Rebuild Exam System"', time: '5h ago', icon: ScrollText },
  { type: 'badge', title: 'Earned "Voice of Youth" badge', time: '1d ago', icon: Award },
  { type: 'story', title: 'Upvoted "Exam Paper Leak Destroyed My Career Dreams"', time: '2d ago', icon: BookOpen },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-24 h-24 bg-dark-card rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">👤</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Not Signed In</h1>
        <p className="text-text-secondary mb-6">Sign in to view your profile</p>
        <Link to="/" className="btn-primary">Go to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="relative">
            <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full object-cover" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-lg">🪳</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">{user.username}</h1>
                <p className="text-text-muted">{user.location}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                    {user.badge}
                  </span>
                </div>
              </div>
              <Link to="/settings" className="p-2 rounded-lg hover:bg-dark-hover text-text-muted hover:text-text-primary transition-colors">
                <Settings className="w-5 h-5" />
              </Link>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-xl font-bold text-text-primary">{user.reputation.toLocaleString()}</span>
                  <span className="text-text-muted text-sm ml-1">Reputation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card">
          <h2 className="text-lg font-bold text-text-primary mb-4">My Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.map(badge => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg text-center ${
                  badge.earned ? 'bg-dark-hover' : 'bg-dark-bg opacity-50'
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-2 bg-dark-card rounded-lg flex items-center justify-center text-2xl">
                  {badge.icon}
                </div>
                <p className="text-text-primary text-sm font-medium">{badge.name}</p>
                <p className="text-text-muted text-xs">{badge.description}</p>
                {badge.earned && (
                  <span className="inline-block mt-2 text-xs text-green-400">Earned</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-text-primary mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-dark-hover rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-text-primary text-sm">{activity.title}</p>
                    <p className="text-text-muted text-xs">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
