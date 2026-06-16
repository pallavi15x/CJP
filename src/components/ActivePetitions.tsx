import { Link } from 'react-router-dom';
import { ScrollText } from 'lucide-react';
import { useData } from '../contexts';

export default function ActivePetitions() {
  const { petitions, signPetition } = useData();

  const activePetitions = petitions.slice(0, 3);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-secondary" />
          <h2 className="text-lg font-bold text-text-primary">Active Petitions</h2>
        </div>
        <Link to="/petitions" className="text-primary text-sm hover:underline">View All</Link>
      </div>

      <div className="space-y-4">
        {activePetitions.map(petition => {
          const signatureCount = petition.signatures?.length || 0;
          const progress = (signatureCount / petition.goal) * 100;
          return (
            <div key={petition.id} className="group">
              <div className="flex gap-3">
                <img
                  src={petition.image}
                  alt={petition.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-medium line-clamp-2 text-sm">{petition.title}</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-text-muted">{signatureCount.toLocaleString()} signed</span>
                      <span className="text-primary font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-secondary to-secondary-hover rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-text-muted text-xs">Goal: {petition.goal.toLocaleString()}</span>
                      <button
                        onClick={() => signPetition(petition.id)}
                        className="text-xs px-3 py-1 bg-secondary/20 text-secondary hover:bg-secondary hover:text-white rounded-full transition-colors"
                      >
                        Sign Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
