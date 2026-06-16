import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const chartData = [
  { month: 'Jan', unemployment: 7.2, vacancies: 45000, recruitment: 32000, delayed: 15000 },
  { month: 'Feb', unemployment: 7.5, vacancies: 48000, recruitment: 35000, delayed: 18000 },
  { month: 'Mar', unemployment: 7.8, vacancies: 42000, recruitment: 30000, delayed: 22000 },
  { month: 'Apr', unemployment: 8.1, vacancies: 39000, recruitment: 28000, delayed: 25000 },
  { month: 'May', unemployment: 8.3, vacancies: 36000, recruitment: 26000, delayed: 28000 },
  { month: 'Jun', unemployment: 8.5, vacancies: 34000, recruitment: 24000, delayed: 32000 },
];

const stats = [
  { label: 'Unemployment %', value: '8.5%', trend: 'up', color: 'text-red-400' },
  { label: 'Govt. Vacancies', value: '34,000', trend: 'down', color: 'text-yellow-400' },
  { label: 'Recruitment', value: '24,000', trend: 'down', color: 'text-orange-400' },
  { label: 'Results Delayed', value: '32,000', trend: 'up', color: 'text-secondary' },
];

export default function YouthDashboard() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-lg font-bold text-text-primary">Youth Dashboard</h2>
          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium">LIVE</span>
        </div>
        <Link to="/youth-dashboard" className="text-primary text-sm hover:underline">Full Dashboard</Link>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-dark-hover rounded-lg px-3 py-2">
            <div className="flex items-center gap-1 mb-1">
              {stat.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-red-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-green-400" />
              )}
              <span className="text-text-muted text-xs">{stat.label}</span>
            </div>
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="month"
              stroke="#B0B0B0"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f1f1f',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#FFFFFF' }}
              itemStyle={{ color: '#B0B0B0' }}
            />
            <Line
              type="monotone"
              dataKey="unemployment"
              stroke="#FFC107"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="vacancies"
              stroke="#C0392B"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="delayed"
              stroke="#A93226"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
