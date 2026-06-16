import { Link } from 'react-router-dom';
import { MapPin, Plus } from 'lucide-react';
import { useData } from '../contexts';

const stateData = [
  { name: 'Uttar Pradesh', code: 'UP', issues: 1234, x: 45, y: 25 },
  { name: 'Bihar', code: 'BR', issues: 987, x: 55, y: 30 },
  { name: 'Rajasthan', code: 'RJ', issues: 756, x: 28, y: 32 },
  { name: 'Maharashtra', code: 'MH', issues: 1089, x: 30, y: 55 },
  { name: 'Karnataka', code: 'KA', issues: 876, x: 32, y: 70 },
  { name: 'Delhi', code: 'DL', issues: 567, x: 42, y: 22 },
  { name: 'West Bengal', code: 'WB', issues: 678, x: 70, y: 35 },
  { name: 'Tamil Nadu', code: 'TN', issues: 543, x: 38, y: 82 },
];

export default function IssueMap() {
  const { issues } = useData();

  const getStateIssues = (stateName: string) => {
    return issues.filter(i => i.state === stateName).length;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-text-primary">Issue Map of India</h2>
        <Link to="/issue-map" className="text-primary text-sm hover:underline">View Full Map</Link>
      </div>

      <div className="relative bg-dark-hover rounded-lg p-4 min-h-[300px]">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
          <path
            d="M25,10 L45,8 L65,15 L75,25 L85,40 L80,60 L70,75 L55,85 L40,80 L25,70 L15,55 L20,35 L25,10"
            fill="none"
            stroke="#FFC107"
            strokeWidth="0.5"
          />
        </svg>

        {stateData.map(state => {
          const actualIssues = getStateIssues(state.name);
          const displayIssues = actualIssues || state.issues;
          return (
            <div
              key={state.code}
              className="absolute group cursor-pointer"
              style={{ left: `${state.x}%`, top: `${state.y}%` }}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
                <div className="absolute -inset-2 bg-secondary/30 rounded-full animate-ping"></div>
              </div>
              <div className="hidden group-hover:block absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                <p className="text-text-primary font-semibold text-sm">{state.name}</p>
                <div className="flex items-center gap-1 text-text-muted text-xs">
                  <MapPin className="w-3 h-3 text-secondary" />
                  {displayIssues.toLocaleString()} issues
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute bottom-4 left-4 right-4">
          <Link to="/issue-map" className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            Report an Issue
          </Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {stateData.slice(0, 4).map(state => {
          const actualIssues = getStateIssues(state.name);
          const displayIssues = actualIssues || state.issues;
          return (
            <div key={state.code} className="text-center p-2 bg-dark-hover rounded-lg">
              <p className="text-xs text-text-muted">{state.code}</p>
              <p className="text-sm font-semibold text-text-primary">{displayIssues}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
