import { useState, useMemo } from 'react';
import { Users, MessageCircle, Plus, Search, UserPlus, UserMinus, TrendingUp } from 'lucide-react';
import { useData, useAuth, useToast } from '../contexts';
import { formatDate } from '../hooks';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { Community, CommunityPost } from '../contexts/DataContext';

const categories = ['All', 'Support', 'Career', 'Education', 'Politics', 'Entertainment', 'Local'];

export default function CommunitiesPage() {
  const { communities, createCommunity, joinCommunity, leaveCommunity, postInCommunity } = useData();
  const { user, updateStats } = useAuth();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [formData, setFormData] = useState({ name: '', description: '', category: 'Support', icon: '📝' });
  const [newPost, setNewPost] = useState('');

  const filteredCommunities = useMemo(() => {
    let result = [...communities];
    if (filter !== 'All') result = result.filter(c => c.category === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    return result.sort((a, b) => b.members.length - a.members.length);
  }, [communities, filter, search]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to create communities', 'error');
      return;
    }
    if (!formData.name.trim() || !formData.description.trim()) {
      showToast('Please fill all fields', 'error');
      return;
    }
    createCommunity({
      name: formData.name,
      description: formData.description,
      category: formData.category,
      icon: formData.icon,
      createdBy: user.id,
    });
    showToast('Community created!', 'success');
    setFormData({ name: '', description: '', category: 'Support', icon: '📝' });
    setShowModal(false);
  };

  const handleJoin = (id: string) => {
    if (!user) {
      showToast('Please login to join', 'error');
      return;
    }
    joinCommunity(id);
    showToast('Joined community!', 'success');
  };

  const handleLeave = (id: string) => {
    leaveCommunity(id);
    showToast('Left community', 'info');
    setSelectedCommunity(null);
  };

  const handlePost = () => {
    if (!selectedCommunity || !user || !newPost.trim()) return;
    postInCommunity(selectedCommunity.id, newPost);
    setNewPost('');
    showToast('Post shared!', 'success');
    const updated = communities.find(c => c.id === selectedCommunity.id);
    if (updated) setSelectedCommunity(updated);
  };

  const icons = ['📝', '💼', '🎓', '🏛️', '😂', '📍', '🚀', '💡', '🌍', '🪳'];

  return (
    <div>
      {!selectedCommunity ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Communities</h1>
              <p className="text-text-secondary text-sm">Join communities that matter to you</p>
            </div>
            {user && (
              <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Community
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
                placeholder="Search communities..."
                className="w-full bg-dark-card border border-dark-border rounded-lg pl-12 pr-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-text-primary"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {communities.length === 0 ? (
            <EmptyState
              icon={<Users className="w-12 h-12 text-text-muted" />}
              title="No Communities Yet"
              description="Create the first community and bring people together"
              action={user && <button onClick={() => setShowModal(true)} className="btn-primary">Create Community</button>}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map(community => {
                const isMember = user && community.members.some(m => m.userId === user.id);
                return (
                  <div key={community.id} className="card group hover:border-primary/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center text-3xl">
                        {community.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-text-primary font-semibold cursor-pointer hover:text-primary" onClick={() => setSelectedCommunity(community)}>
                          {community.name}
                        </h3>
                        <p className="text-text-muted text-sm line-clamp-2">{community.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-border">
                      <div className="flex items-center gap-4 text-text-muted text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {community.members.length}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {community.posts.length}
                        </div>
                      </div>
                      {user && (
                        <button
                          onClick={() => isMember ? handleLeave(community.id) : handleJoin(community.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isMember
                              ? 'bg-dark-hover text-text-muted hover:text-secondary'
                              : 'bg-primary/20 text-primary hover:bg-primary hover:text-dark-bg'
                          }`}
                        >
                          {isMember ? 'Leave' : 'Join'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <CommunityDetail
          community={selectedCommunity}
          onLeave={() => handleLeave(selectedCommunity.id)}
          newPost={newPost}
          setNewPost={setNewPost}
          onPost={handlePost}
          currentUserId={user?.id}
          onBack={() => setSelectedCommunity(null)}
        />
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create a Community" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Community name"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
            />
          </div>
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
            <label className="block text-sm text-text-secondary mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {icons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                    formData.icon === icon ? 'bg-primary/20 border-2 border-primary' : 'bg-dark-hover'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What is this community about?"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <button type="submit" className="btn-primary w-full">Create Community</button>
        </form>
      </Modal>
    </div>
  );
}

function CommunityDetail({ community, onLeave, newPost, setNewPost, onPost, currentUserId, onBack }: {
  community: Community;
  onLeave: () => void;
  newPost: string;
  setNewPost: (s: string) => void;
  onPost: () => void;
  currentUserId?: string;
  onBack: () => void;
}) {
  const isMember = currentUserId && community.members.some(m => m.userId === currentUserId);

  return (
    <div>
      <button onClick={onBack} className="text-text-muted hover:text-text-primary mb-6 flex items-center gap-2">
        ← Back to Communities
      </button>

      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center text-4xl">
            {community.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-primary">{community.name}</h1>
            <p className="text-text-muted">{community.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-dark-border">
          <div className="flex items-center gap-2 text-text-muted">
            <Users className="w-5 h-5" />
            {community.members.length} members
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <MessageCircle className="w-5 h-5" />
            {community.posts.length} posts
          </div>
          {isMember && (
            <button onClick={onLeave} className="ml-auto px-4 py-2 bg-secondary/20 text-secondary hover:bg-secondary hover:text-white rounded-lg text-sm transition-colors">
              Leave Community
            </button>
          )}
        </div>
      </div>

      {isMember && (
        <div className="card mb-6">
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Share something with the community..."
            rows={3}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary resize-none mb-4"
          />
          <button onClick={onPost} disabled={!newPost.trim()} className="btn-primary disabled:opacity-50">
            Post
          </button>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-text-primary">Posts</h2>
        {community.posts.length === 0 ? (
          <EmptyState
            icon={<MessageCircle className="w-12 h-12 text-text-muted" />}
            title="No Posts Yet"
            description="Be the first to post something"
          />
        ) : (
          community.posts.map(post => (
            <div key={post.id} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  👤
                </div>
                <div>
                  <p className="text-text-primary font-medium">{post.authorName}</p>
                  <p className="text-text-muted text-xs">{formatDate(post.createdAt)}</p>
                </div>
              </div>
              <p className="text-text-secondary">{post.content}</p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-dark-border">
                <button className="flex items-center gap-1 text-text-muted hover:text-primary text-sm">
                  <Users className="w-4 h-4" />
                  {post.likes.length}
                </button>
                <button className="flex items-center gap-1 text-text-muted hover:text-primary text-sm">
                  <MessageCircle className="w-4 h-4" />
                  {post.comments.length}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
