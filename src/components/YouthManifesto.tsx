import { Link } from 'react-router-dom';
import { Vote, TrendingUp } from 'lucide-react';
import { useData } from '../contexts';

export default function YouthManifesto() {
  const { manifestoPoll, votePoll } = useData();

  const totalVotes = manifestoPoll?.options?.reduce((sum, opt) => sum + opt.votes, 0) || 0;

  if (!manifestoPoll || !manifestoPoll.options) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-lg font-bold text-text-primary">Youth Manifesto 2026</h2>
          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium">LIVE</span>
        </div>
        <Link to="/manifesto" className="text-primary text-sm hover:underline">View Full Manifesto</Link>
      </div>

      <p className="text-text-muted text-sm mb-4">
        {totalVotes.toLocaleString()} votes cast • Community-driven priorities
      </p>

      <div className="space-y-3">
        {manifestoPoll.options.map(option => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 1000) / 10 : 0;
          return (
            <div key={option.id}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-text-primary text-sm font-medium">{option.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">{percentage}%</span>
                  <button
                    onClick={() => votePoll(manifestoPoll.id, option.id)}
                    className="p-1 hover:bg-primary/20 rounded transition-colors group"
                    title="Vote for this category"
                  >
                    <Vote className="w-4 h-4 text-text-muted group-hover:text-primary" />
                  </button>
                </div>
              </div>
              <div className="h-3 bg-dark-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-dark-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-text-secondary text-sm">Trending: {manifestoPoll.options[0]?.label || 'Employment'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
