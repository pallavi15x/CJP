import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, BarChart2, BookOpen, ScrollText, Vote, Users, Zap, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useAuth, useData } from '../contexts';
import { formatDate } from '../hooks';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { stories, petitions, memes, communities } = useData();

  if (!user) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <BarChart2 className="w-16 h-16 text-text-muted mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-text-primary mb-2">Login Required</h1>
        <p className="text-text-secondary mb-6">Please login to view your dashboard</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  const userStories = stories.filter(s => s.authorId === user.id);
  const userPetitions = petitions.filter(p => p.createdBy === user.id);
  const signedPetitions = petitions.filter(p => p.signatures.includes(user.id));
  const userMemes = memes.filter(m => m.authorId === user.id);
  const joinedCommunities = communities.filter(c => c.members.some(m => m.userId === user.id));
  const savedStories = stories.filter(s => s.savedBy.includes(user.id));
  const savedMemes = memes.filter(m => m.savedBy.includes(user.id));

  const stats = [
    { label: 'Stories Created', value: user.stats?.storiesCreated || 0, icon: BookOpen, color: 'text-blue-400' },
    { label: 'Petitions Signed', value: user.stats?.petitionsSigned || 0, icon: ScrollText, color: 'text-green-400' },
    { label: 'Votes Cast', value: user.stats?.votesCast || 0, icon: Vote, color: 'text-yellow-400' },
    { label: 'Communities', value: joinedCommunities.length, icon: Users, color: 'text-purple-400' },
  ];

  const totalUpvotes = userStories.reduce((sum, s) => sum + s.upvotes, 0) + userMemes.reduce((sum, m) => sum + m.likes.length, 0);
  const totalComments = userStories.reduce((sum, s) => sum + s.comments.length, 0) + userMemes.reduce((sum, m) => sum + m.comments.length, 0);

  const activityData = [
    { month: 'Jan', activity: 5 },
    { month: 'Feb', activity: 12 },
    { month: 'Mar', activity: 8 },
    { month: 'Apr', activity: 15 },
    { month: 'May', activity: 22 },
    { month: 'Jun', activity: user.stats?.storiesCreated || 1 },
  ];

  const categoryData = [
    { name: 'Stories', value: userStories.length, color: '#FFC107' },
    { name: 'Petitions', value: userPetitions.length, color: '#C0392B' },
    { name: 'Memes', value: userMemes.length, color: '#9B59B6' },
  ].filter(d => d.value > 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Your Dashboard</h1>
          <p className="text-text-secondary text-sm">Activity overview and statistics</p>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="text-primary font-bold text-xl">{user.reputation.toLocaleString()}</span>
          <span className="text-text-muted text-sm">reputation</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between mb-2">
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            <p className="text-text-muted text-sm">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-lg font-bold text-text-primary mb-4">Activity Over Time</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <XAxis dataKey="month" stroke="#B0B0B0" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
                <Line type="monotone" dataKey="activity" stroke="#FFC107" strokeWidth={2} dot={{ fill: '#FFC107' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-text-primary mb-4">Content Distribution</h2>
          <div className="h-48 flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-text-muted">No content yet</p>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {categoryData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: d.color }} />
                <span className="text-text-muted text-sm">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary">Achievements</h2>
            <Link to="/profile" className="text-primary text-sm hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {user.badges.map((badge, i) => (
              <div key={i} className="aspect-square bg-dark-hover rounded-lg flex flex-col items-center justify-center">
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-text-muted text-xs mt-1 truncate w-full text-center px-1">{badge.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
              <span className="text-text-muted text-sm">Total Upvotes Received</span>
              <span className="text-primary font-bold">{totalUpvotes.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
              <span className="text-text-muted text-sm">Comments Received</span>
              <span className="text-text-primary font-bold">{totalComments}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-text-primary mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/stories" className="flex items-center justify-between p-3 bg-dark-hover rounded-lg hover:bg-dark-border transition-colors">
              <span className="text-text-primary flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                Share Your Story
              </span>
              <span className="text-text-muted">→</span>
            </Link>
            <Link to="/petitions" className="flex items-center justify-between p-3 bg-dark-hover rounded-lg hover:bg-dark-border transition-colors">
              <span className="text-text-primary flex items-center gap-3">
                <ScrollText className="w-5 h-5 text-secondary" />
                Create Petition
              </span>
              <span className="text-text-muted">→</span>
            </Link>
            <Link to="/memes" className="flex items-center justify-between p-3 bg-dark-hover rounded-lg hover:bg-dark-border transition-colors">
              <span className="text-text-primary flex items-center gap-3">
                <span className="text-lg">😂</span>
                Create Meme
              </span>
              <span className="text-text-muted">→</span>
            </Link>
            <Link to="/communities" className="flex items-center justify-between p-3 bg-dark-hover rounded-lg hover:bg-dark-border transition-colors">
              <span className="text-text-primary flex items-center gap-3">
                <Users className="w-5 h-5 text-green-400" />
                Join Community
              </span>
              <span className="text-text-muted">→</span>
            </Link>
          </div>
        </div>
      </div>

      {savedStories.length > 0 && (
        <div className="card mt-6">
          <h2 className="text-lg font-bold text-text-primary mb-4">Saved Content ({savedStories.length + savedMemes.length})</h2>
          <div className="space-y-2">
            {savedStories.slice(0, 3).map(story => (
              <Link key={story.id} to="/stories" className="flex items-center gap-3 p-3 bg-dark-hover rounded-lg hover:bg-dark-border transition-colors">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="text-text-primary text-sm flex-1 truncate">{story.title}</span>
                <span className="text-text-muted text-xs">Story</span>
              </Link>
            ))}
            {savedMemes.slice(0, 2).map(meme => (
              <Link key={meme.id} to="/memes" className="flex items-center gap-3 p-3 bg-dark-hover rounded-lg hover:bg-dark-border transition-colors">
                <span className="w-5 h-5 text-xl">😂</span>
                <span className="text-text-primary text-sm flex-1 truncate">{meme.caption}</span>
                <span className="text-text-muted text-xs">Meme</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
