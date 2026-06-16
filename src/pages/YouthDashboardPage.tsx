import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area, BarChart, Bar } from 'recharts';

const unemploymentData = [
  { month: 'Jan', rate: 7.2 },
  { month: 'Feb', rate: 7.5 },
  { month: 'Mar', rate: 7.8 },
  { month: 'Apr', rate: 8.1 },
  { month: 'May', rate: 8.3 },
  { month: 'Jun', rate: 8.5 },
];

const vacancyData = [
  { month: 'Jan', vacancies: 45000, filled: 32000 },
  { month: 'Feb', vacancies: 48000, filled: 35000 },
  { month: 'Mar', vacancies: 42000, filled: 30000 },
  { month: 'Apr', vacancies: 39000, filled: 28000 },
  { month: 'May', vacancies: 36000, filled: 26000 },
  { month: 'Jun', vacancies: 34000, filled: 24000 },
];

const examData = [
  { exam: 'SSC CGL', delayed: 45000, onTime: 120000 },
  { exam: 'UPSC', delayed: 12000, onTime: 89000 },
  { exam: 'Railways', delayed: 67000, onTime: 180000 },
  { exam: 'Banking', delayed: 23000, onTime: 95000 },
];

export default function YouthDashboardPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Youth Dashboard</h1>
        <p className="text-text-secondary">Real-time data on India's employment and education crisis</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-red-400" />
            <span className="text-text-muted text-sm">Unemployment Rate</span>
          </div>
          <p className="text-3xl font-bold text-red-400">8.5%</p>
          <p className="text-text-muted text-xs">+0.3% from last month</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-yellow-400" />
            <span className="text-text-muted text-sm">Govt. Vacancies</span>
          </div>
          <p className="text-3xl font-bold text-yellow-400">34K</p>
          <p className="text-text-muted text-xs">-2,000 this month</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-orange-400" />
            <span className="text-text-muted text-sm">Recruitment</span>
          </div>
          <p className="text-3xl font-bold text-orange-400">24K</p>
          <p className="text-text-muted text-xs">-2,000 this month</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-secondary" />
            <span className="text-text-muted text-sm">Results Delayed</span>
          </div>
          <p className="text-3xl font-bold text-secondary">32K</p>
          <p className="text-text-muted text-xs">+4,000 this month</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-bold text-text-primary mb-4">Unemployment Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={unemploymentData}>
                <XAxis dataKey="month" stroke="#B0B0B0" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#B0B0B0" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
                <Area type="monotone" dataKey="rate" stroke="#FFC107" fill="#FFC10720" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-text-primary mb-4">Vacancies vs Filled</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vacancyData}>
                <XAxis dataKey="month" stroke="#B0B0B0" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#B0B0B0" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
                <Line type="monotone" dataKey="vacancies" stroke="#FFC107" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="filled" stroke="#C0392B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-text-muted text-sm">Vacancies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
              <span className="text-text-muted text-sm">Filled</span>
            </div>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="text-lg font-bold text-text-primary mb-4">Exam Results Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={examData}>
                <XAxis dataKey="exam" stroke="#B0B0B0" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#B0B0B0" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
                <Bar dataKey="delayed" fill="#C0392B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="onTime" fill="#27AE60" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-secondary"></div>
              <span className="text-text-muted text-sm">Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-text-muted text-sm">On Time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
