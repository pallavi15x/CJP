import { useMemo, useState } from 'react';
import { Trophy, Medal, Award, Zap, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth, useData } from '../contexts';
import { formatDate } from '../hooks';

type SortBy = 'reputation' | 'stories' | 'petitions' | 'votes';

export default function LeaderboardPage() {
  const { users, user: currentUser } = useAuth();
  const { stories, petitions, memes } = useData();
  const [sortBy, setSortBy] = useState<SortBy>('reputation');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['top']));

  const leaderboardData = useMemo(() => {
    return users.map(u => {
      const storiesPosted = u.stats?.storiesCreated || 0;
      const petitionsCreated = u.stats?.petitionsCreated || 0;
      const petitionsSigned = u.stats?.petitionsSigned || 0;
      const votesCast = u.stats?.votesCast || 0;
      return {
        ...u,
        stats: {
          ...u.stats,
          storiesPosted,
          petitionsCreated,
          petitionsSigned,
          votesCast,
        },
      };
    }).sort((a, b) => {
      switch (sortBy) {
        case 'stories': return (b.stats?.storiesCreated || 0) - (a.stats?.storiesCreated || 0);
        case 'petitions': return (b.stats?.petitionsCreated || 0) - (a.stats?.petitionsCreated || 0);
        case 'votes': return (b.stats?.votesCast || 0) - (a.stats?.votesCast || 0);
        default: return b.reputation - a.reputation;
      }
    });
  }, [users, sortBy, stories, petitions, memes]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const toggleExpand = (section: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Community Leaderboard</h1>
        <p className="text-text-secondary">Top contributors of the CJP movement</p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {[
          { id: 'reputation', label: 'Reputation' },
          { id: 'stories', label: 'Stories' },
          { id: 'petitions', label: 'Petitions' },
          { id: 'votes', label: 'Votes' },
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => setSortBy(opt.id as SortBy)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sortBy === opt.id ? 'bg-primary text-dark-bg' : 'bg-dark-card text-text-muted hover:text-text-primary'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {leaderboardData.slice(0, 3).map((lu, i) => (
          <div
            key={lu.id}
            className={`card text-center relative ${i === 0 ? 'border-primary/50 bg-primary/5' : ''}`}
          >
            {i === 0 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-dark-bg rounded-full text-xs font-bold">
                #1 Champion
              </div>
            )}
            <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-dark-border">
              <img src={lu.avatar} alt={lu.username} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-text-primary font-bold">{lu.username}</h3>
            <p className="text-text-muted text-sm mb-2">{lu.location || 'India'}</p>
            <div className="flex items-center justify-center gap-2 mb-2">
              {getRankIcon(i + 1)}
              <span className="text-primary font-bold">{lu.reputation.toLocaleString()}</span>
              <span className="text-text-muted text-sm">pts</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {lu.badges.slice(0, 3).map((b, j) => (
                <span key={j} className="px-2 py-1 bg-dark-hover rounded-full text-xs text-text-muted">
                  {b.icon} {b.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-4 px-4 text-text-muted text-sm font-medium">Rank</th>
              <th className="text-left py-4 px-4 text-text-muted text-sm font-medium">User</th>
              <th className="text-left py-4 px-4 text-text-muted text-sm font-medium hidden md:table-cell">Location</th>
              <th className="text-right py-4 px-4 text-text-muted text-sm font-medium">Rep</th>
              <th className="text-right py-4 px-4 text-text-muted text-sm font-medium hidden sm:table-cell">Stories</th>
              <th className="text-right py-4 px-4 text-text-muted text-sm font-medium hidden lg:table-cell">Petitions</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((lu, i) => {
              const isCurrentUser = currentUser?.id === lu.id;
              return (
                <tr
                  key={lu.id}
                  className={`border-b border-dark-border last:border-0 hover:bg-dark-hover transition-colors ${
                    isCurrentUser ? 'bg-primary/10' : i < 3 ? 'bg-dark-hover/30' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(i + 1) || <span className="text-text-muted w-6 text-center font-bold">{i + 1}</span>}
                      {isCurrentUser && <span className="text-xs text-primary">(You)</span>}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img src={lu.avatar} alt={lu.username} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-text-primary font-medium">{lu.username}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 bg-dark-hover rounded text-text-muted">
                            {lu.badge}
                          </span>
                          <span className="text-xs text-text-muted">
                            Joined {formatDate(lu.joinedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell text-text-muted text-sm">{lu.location || 'India'}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-text-primary font-bold">{lu.reputation.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right hidden sm:table-cell">
                    <span className="text-text-muted">{lu.stats?.storiesCreated || 0}</span>
                  </td>
                  <td className="py-4 px-4 text-right hidden lg:table-cell">
                    <span className="text-text-muted">{lu.stats?.petitionsCreated || 0}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
