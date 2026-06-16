import { useState } from 'react';
import { MapPin, Plus, AlertTriangle, TrendingUp, Filter, X } from 'lucide-react';
import { useData, useAuth, useToast } from '../contexts';
import { formatDate } from '../hooks';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { IssueReport } from '../contexts/DataContext';

const states = [
  'Uttar Pradesh', 'Bihar', 'Rajasthan', 'Maharashtra', 'Karnataka',
  'Delhi', 'Punjab', 'West Bengal', 'Tamil Nadu', 'Gujarat', 'Madhya Pradesh', 'Kerala'
];

const districts: Record<string, string[]> = {
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'],
  'Delhi': ['Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kannur'],
};

const categories = ['Unemployment', 'Exam Issues', 'Corruption', 'Infrastructure', 'Education', 'Healthcare', 'Women Safety', 'Other'];

const stateCoords: Record<string, { x: number; y: number }> = {
  'Uttar Pradesh': { x: 45, y: 25 },
  'Bihar': { x: 55, y: 30 },
  'Rajasthan': { x: 28, y: 32 },
  'Maharashtra': { x: 30, y: 55 },
  'Karnataka': { x: 32, y: 70 },
  'Delhi': { x: 42, y: 22 },
  'Punjab': { x: 38, y: 15 },
  'West Bengal': { x: 70, y: 35 },
  'Tamil Nadu': { x: 38, y: 82 },
  'Gujarat': { x: 22, y: 42 },
  'Madhya Pradesh': { x: 38, y: 40 },
  'Kerala': { x: 28, y: 78 },
};

export default function IssueMapPage() {
  const { issues, addIssue, upvoteIssue } = useData();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [filter, setFilter] = useState({ category: 'All', urgency: 'All' });
  const [formData, setFormData] = useState({
    state: states[0],
    district: districts[states[0]][0],
    category: 'Unemployment',
    description: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
  });

  const stateIssues = selectedState
    ? issues
        .filter(i => i.state === selectedState)
        .filter(i => filter.category === 'All' || i.category === filter.category)
        .filter(i => filter.urgency === 'All' || i.urgency === filter.urgency)
        .sort((a, b) => b.upvotes - a.upvotes)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to report issues', 'error');
      return;
    }
    if (!formData.description.trim()) {
      showToast('Please describe the issue', 'error');
      return;
    }
    addIssue({
      state: formData.state,
      district: formData.district,
      category: formData.category,
      description: formData.description,
      authorId: user.id,
      authorName: user.username,
      urgency: formData.urgency,
    });
    showToast('Issue reported successfully!', 'success');
    setFormData({ ...formData, description: '' });
    setShowModal(false);
  };

  const getIssueCount = (state: string) => issues.filter(i => i.state === state).length;
  const issuesByCategory = categories.map(cat => ({
    category: cat,
    count: issues.filter(i => i.category === cat).length,
  })).filter(c => c.count > 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Issue Map of India</h1>
          <p className="text-text-secondary text-sm">Report and track issues across the nation</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Report an Issue
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card">
          <div className="relative bg-dark-hover rounded-lg p-6 min-h-[400px]">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
              <path
                d="M20,5 L50,3 L70,10 L85,25 L90,45 L85,65 L70,80 L50,90 L30,85 L15,70 L10,50 L15,30 L20,5"
                fill="none"
                stroke="#FFC107"
                strokeWidth="0.8"
              />
            </svg>
            {states.map(state => {
              const coords = stateCoords[state];
              if (!coords) return null;
              const count = getIssueCount(state);
              const size = Math.min(24, 12 + count / 100);

              return (
                <div
                  key={state}
                  className="absolute group cursor-pointer"
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  onClick={() => setSelectedState(state)}
                >
                  <div
                    className={`rounded-full animate-pulse ${selectedState === state ? 'bg-primary' : 'bg-secondary'}`}
                    style={{ width: `${size}px`, height: `${size}px` }}
                  />
                  <div className="hidden group-hover:block absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 min-w-[160px] shadow-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-text-primary font-semibold text-sm">{state}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-secondary" />
                      <p className="text-secondary font-bold text-sm">{count}</p>
                      <span className="text-text-muted text-xs">issues</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h2 className="text-lg font-bold text-text-primary mb-4">By Category</h2>
            <div className="space-y-2">
              {issuesByCategory.map(cat => (
                <div key={cat.category} className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">{cat.category}</span>
                  <span className="text-text-primary font-bold">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-text-primary mb-2">Total Issues</h2>
            <p className="text-3xl font-bold text-secondary">{issues.length}</p>
          </div>
        </div>
      </div>

      {selectedState && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {selectedState} Issues
            </h2>
            <div className="flex items-center gap-2">
              <select
                value={filter.category}
                onChange={e => setFilter(prev => ({ ...prev, category: e.target.value }))}
                className="bg-dark-bg border border-dark-border rounded-lg px-3 py-1.5 text-text-primary text-sm"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <button onClick={() => setSelectedState(null)} className="p-2 hover:bg-dark-hover rounded-lg">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
          </div>

          {stateIssues.length === 0 ? (
            <EmptyState
              icon={<MapPin className="w-12 h-12 text-text-muted" />}
              title="No Issues Reported"
              description={`Be the first to report an issue in ${selectedState}`}
            />
          ) : (
            <div className="space-y-3">
              {stateIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} onUpvote={() => { if (user) upvoteIssue(issue.id) }} currentUserId={user?.id} />
              ))}
            </div>
          )}
        </div>
      )}

      {issues.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Recent Reports
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {issues.slice(0, 6).map(issue => (
              <div key={issue.id} className="p-4 bg-dark-hover rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    issue.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
                    issue.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {issue.urgency.toUpperCase()}
                  </span>
                  <span className="text-text-muted text-xs">{formatDate(issue.createdAt)}</span>
                </div>
                <p className="text-text-primary font-medium text-sm mb-1">{issue.state} - {issue.district}</p>
                <p className="text-text-muted text-sm line-clamp-2">{issue.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="px-2 py-0.5 bg-dark-bg text-text-muted rounded text-xs">{issue.category}</span>
                  <div className="flex items-center gap-1 text-text-muted text-sm">
                    <ArrowUp className="w-4 h-4" />
                    {issue.upvotes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Report an Issue" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">State</label>
              <select
                value={formData.state}
                onChange={e => setFormData(prev => ({ ...prev, state: e.target.value, district: districts[e.target.value][0] }))}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
              >
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">District</label>
              <select
                value={formData.district}
                onChange={e => setFormData(prev => ({ ...prev, district: e.target.value }))}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
              >
                {(districts[formData.state] || []).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Urgency</label>
              <select
                value={formData.urgency}
                onChange={e => setFormData(prev => ({ ...prev, urgency: e.target.value as typeof formData.urgency }))}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the issue in detail..."
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <button type="submit" className="btn-primary w-full">Submit Report</button>
        </form>
      </Modal>
    </div>
  );
}

function ArrowUp(props: { className: string }) {
  return <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
}

function IssueCard({ issue, onUpvote, currentUserId }: { issue: IssueReport; onUpvote: () => void; currentUserId?: string }) {
  const upvoted = currentUserId && issue.upvotedBy.includes(currentUserId);

  return (
    <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={onUpvote}
            className={`p-1.5 rounded ${upvoted ? 'text-primary bg-primary/20' : 'text-text-muted hover:bg-dark-hover hover:text-primary'}`}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <span className="text-text-primary font-bold">{issue.upvotes}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs ${
              issue.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
              issue.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {issue.urgency.toUpperCase()}
            </span>
            <span className="px-2 py-0.5 bg-dark-hover text-text-muted rounded text-xs">{issue.category}</span>
            <span className={`px-2 py-0.5 rounded text-xs ${
              issue.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
              issue.status === 'investigating' ? 'bg-primary/20 text-primary' :
              'bg-secondary/20 text-secondary'
            }`}>
              {issue.status}
            </span>
          </div>
          <p className="text-text-muted text-sm mb-1">{issue.district} District</p>
          <p className="text-text-primary text-sm">{issue.description}</p>
          <div className="flex items-center justify-between mt-3 text-text-muted text-xs">
            <span>Reported by {issue.authorName}</span>
            <span>{formatDate(issue.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
