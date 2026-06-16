import { Users, MessageCircle, Trophy, BarChart2, Heart } from 'lucide-react';

const stats = [
  { icon: Users, value: '2,45,678', label: 'Registered Members', color: 'text-blue-400' },
  { icon: MessageCircle, value: '1,23,456', label: 'Stories Shared', color: 'text-green-400' },
  { icon: Trophy, value: '345', label: 'Petitions Created', color: 'text-yellow-400' },
  { icon: BarChart2, value: '18,72,543', label: 'Signatures Collected', color: 'text-purple-400' },
  { icon: Heart, value: '5,67,890', label: 'Votes Cast', color: 'text-red-400' },
];

export default function StatsStrip() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="card flex items-center gap-4 hover:border-primary/50 transition-colors group">
            <div className={`w-12 h-12 rounded-lg bg-dark-hover flex items-center justify-center group-hover:bg-primary/20 transition-colors`}>
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-sm text-text-muted">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
