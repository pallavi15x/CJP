import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ScrollText, Plus, Users, TrendingUp, Filter, Search, Edit2, Trash2, Share2, X } from 'lucide-react';
import { useData, useAuth, useToast } from '../contexts';
import { formatDate } from '../hooks';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { Petition } from '../contexts/DataContext';

const categories = ['All', 'Education', 'Employment', 'Women Rights', 'Environment', 'Healthcare', 'Technology', 'Governance', 'Other'];

export default function PetitionsPage() {
  const { petitions, addPetition, signPetition, updatePetition, deletePetition } = useData();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingPetition, setEditingPetition] = useState<Petition | null>(null);
  const [filter, setFilter] = useState({ category: 'All', status: 'All' });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'signatures' | 'goal'>('newest');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Education',
    goal: 100000,
    urgent: false,
    image: 'https://images.unsplash.com/photo-1434030216411-57b8a0ed9f6b?w=600&h=300&fit=crop',
  });

  const filteredPetitions = useMemo(() => {
    let result = [...petitions];
    if (filter.category !== 'All') {
      result = result.filter(p => p.category === filter.category);
    }
    if (filter.status !== 'All') {
      result = result.filter(p => p.status === filter.status);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case 'signatures':
        result.sort((a, b) => b.signatures.length - a.signatures.length);
        break;
      case 'goal':
        result.sort((a, b) => (b.signatures.length / b.goal) - (a.signatures.length / a.goal));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return result;
  }, [petitions, filter, search, sortBy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to create petitions', 'error');
      return;
    }
    if (formData.title.length < 10 || formData.description.length < 20) {
      showToast('Please provide more details', 'error');
      return;
    }
    if (editingPetition) {
      updatePetition(editingPetition.id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        goal: formData.goal,
        urgent: formData.urgent,
        image: formData.image,
      });
      showToast('Petition updated!', 'success');
    } else {
      addPetition({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        goal: formData.goal,
        createdBy: user.id,
        creatorName: user.username,
        image: formData.image,
        urgent: formData.urgent,
      });
      showToast('Petition created!', 'success');
    }
    setFormData({ title: '', description: '', category: 'Education', goal: 100000, urgent: false, image: 'https://images.unsplash.com/photo-1434030216411-57b8a0ed9f6b?w=600&h=300&fit=crop' });
    setShowModal(false);
    setEditingPetition(null);
  };

  const handleSign = (id: string) => {
    if (!user) {
      showToast('Please login to sign petitions', 'error');
      return;
    }
    const success = signPetition(id);
    if (success) {
      showToast('Petition signed!', 'success');
    } else {
      showToast('You already signed this petition', 'info');
    }
  };

  const handleEdit = (petition: Petition) => {
    setEditingPetition(petition);
    setFormData({
      title: petition.title,
      description: petition.description,
      category: petition.category,
      goal: petition.goal,
      urgent: petition.urgent,
      image: petition.image,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    deletePetition(id);
    showToast('Petition deleted', 'info');
  };

  const openCreateModal = () => {
    setEditingPetition(null);
    setFormData({ title: '', description: '', category: 'Education', goal: 100000, urgent: false, image: 'https://images.unsplash.com/photo-1434030216411-57b8a0ed9f6b?w=600&h=300&fit=crop' });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Active Petitions</h1>
          <p className="text-text-secondary text-sm">Sign petitions that matter to you</p>
        </div>
        {user && (
          <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Petition
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search petitions..."
            className="w-full bg-dark-card border border-dark-border rounded-lg pl-12 pr-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={filter.category}
          onChange={e => setFilter(prev => ({ ...prev, category: e.target.value }))}
          className="bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-text-primary"
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-text-primary"
        >
          <option value="newest">Newest</option>
          <option value="signatures">Most Signatures</option>
          <option value="goal">Closest to Goal</option>
        </select>
      </div>

      {petitions.length === 0 ? (
        <EmptyState
          icon={<ScrollText className="w-12 h-12 text-text-muted" />}
          title="No Petitions Yet"
          description="Create the first petition and rally support for your cause"
          action={user && <button onClick={openCreateModal} className="btn-primary">Create Petition</button>}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPetitions.map(petition => (
            <PetitionCard
              key={petition.id}
              petition={petition}
              onSign={() => handleSign(petition.id)}
              onEdit={() => handleEdit(petition)}
              onDelete={() => handleDelete(petition.id)}
              onShare={() => {
                navigator.clipboard.writeText(`${window.location.origin}/petitions/${petition.id}`);
                showToast('Link copied!', 'success');
              }}
              onView={() => navigate(`/petitions/${petition.id}`)}
              isOwner={user?.id === petition.createdBy}
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingPetition(null) }} title={editingPetition ? 'Edit Petition' : 'Create a Petition'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Petition Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What are you asking for?"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary"
              >
                {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Signature Goal</label>
              <input
                type="number"
                required
                min={1000}
                value={formData.goal}
                onChange={e => setFormData(prev => ({ ...prev, goal: parseInt(e.target.value) || 1000 }))}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Description</label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Explain why this petition matters..."
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, urgent: !prev.urgent }))}
              className={`w-12 h-6 rounded-full transition-colors ${formData.urgent ? 'bg-secondary' : 'bg-dark-hover'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${formData.urgent ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
            <label className="text-text-secondary text-sm">Mark as urgent</label>
          </div>
          <button type="submit" className="btn-primary w-full">
            {editingPetition ? 'Update Petition' : 'Create Petition'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

function PetitionCard({ petition, onSign, onEdit, onDelete, onShare, onView, isOwner, currentUserId }: {
  petition: Petition;
  onSign: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
  onView: () => void;
  isOwner: boolean;
  currentUserId?: string;
}) {
  const progress = (petition.signatures.length / petition.goal) * 100;
  const signed = currentUserId && petition.signatures.includes(currentUserId);

  return (
    <div className="card group hover:border-secondary/50 transition-colors">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img src={petition.image} alt={petition.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-2 left-2 flex gap-2">
          <span className="px-2 py-1 bg-dark-bg/80 backdrop-blur text-text-muted rounded text-xs">{petition.category}</span>
          {petition.urgent && <span className="px-2 py-1 bg-secondary text-white rounded text-xs font-bold">URGENT</span>}
        </div>
        {progress >= 100 && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
            <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">GOAL REACHED!</span>
          </div>
        )}
      </div>

      <h3 className="text-text-primary font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-primary" onClick={onView}>{petition.title}</h3>
      <p className="text-text-muted text-sm mb-4 line-clamp-2">{petition.description}</p>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-secondary" />
            <span className="text-text-primary font-medium">{petition.signatures.length.toLocaleString()}</span>
          </div>
          <span className="text-primary font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-dark-bg rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-secondary to-secondary-hover rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <p className="text-text-muted text-xs mt-1 text-right">Goal: {petition.goal.toLocaleString()}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-text-muted text-xs">by {petition.creatorName}</span>
        <div className="flex items-center gap-1">
          <button onClick={onShare} className="p-1.5 text-text-muted hover:text-primary rounded hover:bg-dark-hover">
            <Share2 className="w-4 h-4" />
          </button>
          {isOwner && (
            <>
              <button onClick={onEdit} className="p-1.5 text-text-muted hover:text-primary rounded hover:bg-dark-hover">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={onDelete} className="p-1.5 text-text-muted hover:text-secondary rounded hover:bg-dark-hover">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <button
        onClick={onSign}
        disabled={signed || progress >= 100}
        className={`w-full mt-4 py-2 rounded-lg font-medium transition-colors ${
          signed ? 'bg-green-500/20 text-green-400' :
          progress >= 100 ? 'bg-dark-hover text-text-muted' :
          'bg-secondary/20 text-secondary hover:bg-secondary hover:text-white'
        }`}
      >
        {signed ? 'Signed' : progress >= 100 ? 'Goal Reached' : 'Sign This Petition'}
      </button>
    </div>
  );
}

export function PetitionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { petitions, signPetition } = useData();
  const { user } = useAuth();
  const { showToast } = useToast();

  const petition = petitions.find(p => p.id === id);

  if (!petition) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Petition Not Found</h1>
        <button onClick={() => navigate('/petitions')} className="btn-primary">Back to Petitions</button>
      </div>
    );
  }

  const progress = (petition.signatures.length / petition.goal) * 100;
  const signed = user && petition.signatures.includes(user.id);

  const handleSign = () => {
    if (!user) {
      showToast('Please login to sign', 'error');
      return;
    }
    const success = signPetition(petition.id);
    showToast(success ? 'Petition signed!' : 'Already signed', success ? 'success' : 'info');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-text-muted hover:text-text-primary mb-6 flex items-center gap-2">
        ← Back to Petitions
      </button>

      <div className="card">
        <div className="relative overflow-hidden rounded-lg mb-6">
          <img src={petition.image} alt={petition.title} className="w-full h-64 object-cover" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-dark-bg/80 backdrop-blur text-text-primary rounded">{petition.category}</span>
            {petition.urgent && <span className="px-3 py-1 bg-secondary text-white rounded font-bold">URGENT</span>}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-2">{petition.title}</h1>
        <p className="text-text-muted mb-6">
          Started by {petition.creatorName} • {formatDate(petition.createdAt)}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-dark-hover rounded-lg text-center">
            <p className="text-3xl font-bold text-secondary">{petition.signatures.length.toLocaleString()}</p>
            <p className="text-text-muted text-sm">Signatures</p>
          </div>
          <div className="p-4 bg-dark-hover rounded-lg text-center">
            <p className="text-3xl font-bold text-primary">{Math.round(progress)}%</p>
            <p className="text-text-muted text-sm">of Goal</p>
          </div>
          <div className="p-4 bg-dark-hover rounded-lg text-center">
            <p className="text-3xl font-bold text-text-primary">{petition.goal.toLocaleString()}</p>
            <p className="text-text-muted text-sm">Goal</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="h-4 bg-dark-bg rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        </div>

        <div className="prose prose-invert max-w-none mb-6">
          <p className="text-text-secondary whitespace-pre-wrap">{petition.description}</p>
        </div>

        <button
          onClick={handleSign}
          disabled={signed || progress >= 100}
          className={`w-full py-3 rounded-lg font-medium ${
            signed ? 'bg-green-500/20 text-green-400' :
            progress >= 100 ? 'bg-dark-hover text-text-muted' :
            'btn-primary'
          }`}
        >
          {signed ? 'You Signed This Petition' : progress >= 100 ? 'Goal Reached' : 'Sign This Petition'}
        </button>
      </div>
    </div>
  );
}
