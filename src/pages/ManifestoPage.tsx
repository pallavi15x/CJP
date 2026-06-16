import { Vote, Clock, Users } from 'lucide-react';
import { useData } from '../contexts';

export default function ManifestoPage() {
  const { manifestoPoll, votePoll } = useData();

  const totalVotes = manifestoPoll.options.reduce((sum: number, opt: any) => sum + opt.votes, 0);

  const categories = manifestoPoll.options.map((opt: any) => ({
    id: opt.id,
    label: opt.label,
    votes: opt.votes,
    percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0,
  }));

  const demands = [
    { category: 'Education', demands: ['Reform NTA and examination systems', 'Free quality education for all', 'Curriculum modernization'] },
    { category: 'Employment', demands: ['Fill 1 crore pending vacancies', 'Transparent recruitment process', 'Skill development programs'] },
    { category: 'Exam Transparency', demands: ['Timely result declaration', 'Appeal process for disputes', 'Anti-cheating measures'] },
    { category: "Women's Rights", demands: ['Safety officers in all districts', 'Fast-track courts for crimes', 'Equal pay enforcement'] },
    { category: 'Technology', demands: ['Digital infrastructure upgrade', 'Internet as basic right', 'Tech education access'] },
    { category: 'Environment', demands: ['Clean air initiatives', 'River cleaning projects', 'Renewable energy focus'] },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Youth Manifesto 2026</h1>
        <p className="text-text-secondary">A crowdsourced vision for India's future by the youth</p>
      </div>

      <div className="card mb-8 bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">LIVE</span>
          </div>
          <div className="flex items-center gap-4 text-text-muted text-sm">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {totalVotes.toLocaleString()} votes
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Ends Dec 2026
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-text-primary mb-4">Vote for Priorities</h2>

        <div className="space-y-4">
          {categories.map((category: any) => (
            <div key={category.id} className="bg-dark-bg/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-text-primary font-semibold">{category.label}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">{category.percentage}%</span>
                  <button
                    onClick={() => votePoll(manifestoPoll.id, category.id)}
                    className="px-3 py-1 bg-primary/20 text-primary hover:bg-primary hover:text-dark-bg rounded-full text-sm font-medium transition-colors"
                  >
                    <Vote className="w-4 h-4 inline mr-1" />
                    Vote
                  </button>
                </div>
              </div>
              <div className="h-4 bg-dark-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full transition-all duration-500"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
              <p className="text-text-muted text-xs mt-1">{category.votes.toLocaleString()} votes</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {demands.map((item, i) => (
          <div key={i} className="card">
            <h3 className="text-lg font-bold text-text-primary mb-3">{item.category}</h3>
            <ul className="space-y-2">
              {item.demands.map((demand, j) => (
                <li key={j} className="flex items-start gap-2 text-text-secondary text-sm">
                  <span className="text-primary mt-1">●</span>
                  {demand}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
