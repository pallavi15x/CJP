import { useState, useMemo } from 'react';
import { Heart, Share2, Sparkles, Plus, MessageCircle, Bookmark, Upload, Filter } from 'lucide-react';
import { useData, useAuth, useToast } from '../contexts';
import { formatDate } from '../hooks';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { Meme } from '../contexts/DataContext';

const categories = ['All', 'Politics', 'Career', 'Exam', 'Education', 'Daily Life', 'Satire'];
const sampleImages = [
  'https://images.unsplash.com/photo-1509343256529-8ab3c22f3f7b?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1557804506-669a67965ba6?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1434030216411-57b8a0ed9f6b?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
];

export default function MemeParliamentPage() {
  const { memes, addMeme, likeMeme, commentOnMeme, shareMeme, saveMeme } = useData();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [viewingMeme, setViewingMeme] = useState<Meme | null>(null);
  const [filter, setFilter] = useState('All');
  const [formData, setFormData] = useState({
    caption: '',
    category: 'Politics',
    imageUrl: sampleImages[0],
  });
  const [comment, setComment] = useState('');

  const filteredMemes = useMemo(() => {
    let result = memes.sort((a, b) => b.likes.length - a.likes.length);
    if (filter !== 'All') {
      result = result.filter(m => m.category === filter);
    }
    return result;
  }, [memes, filter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to create memes', 'error');
      return;
    }
    if (!formData.caption.trim()) {
      showToast('Please add a caption', 'error');
      return;
    }
    addMeme({
      caption: formData.caption,
      imageUrl: formData.imageUrl,
      authorId: user.id,
      authorName: user.username,
      category: formData.category,
    });
    showToast('Meme created!', 'success');
    setFormData({ caption: '', category: 'Politics', imageUrl: sampleImages[0] });
    setShowModal(false);
  };

  const handleLike = (id: string) => {
    if (!user) {
      showToast('Please login to like memes', 'error');
      return;
    }
    likeMeme(id);
  };

  const handleSave = (id: string) => {
    if (!user) {
      showToast('Please login to save memes', 'error');
      return;
    }
    saveMeme(id);
    const meme = memes.find(m => m.id === id);
    showToast(meme?.savedBy.includes(user.id) ? 'Removed from saved' : 'Saved!', 'success');
  };

  const handleShare = (id: string) => {
    shareMeme(id);
    showToast('Meme shared!', 'success');
  };

  const handleComment = () => {
    if (!viewingMeme || !comment.trim() || !user) return;
    commentOnMeme(viewingMeme.id, comment);
    setComment('');
    showToast('Comment added!', 'success');
  };

  const memeOfWeek = memes.find(m => m.isMemeOfWeek) || memes[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold text-text-primary">Meme Parliament</h1>
          <p className="text-text-secondary">Where humor meets activism</p>
        </div>
        {user && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Meme
          </button>
        )}
      </div>

      {memeOfWeek && (
        <div className="card mb-8 bg-gradient-to-r from-purple-900/30 to-primary/20 border-purple-500/30">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-bold">Meme of the Week</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <img src={memeOfWeek.imageUrl} alt={memeOfWeek.caption} className="w-full h-64 object-cover rounded-lg" />
            <div>
              <p className="text-text-secondary mb-4">{memeOfWeek.caption}</p>
              <div className="flex items-center gap-4">
                <button onClick={() => handleLike(memeOfWeek.id)} className="flex items-center gap-2 text-text-muted hover:text-red-400">
                  <Heart className="w-5 h-5" fill={user && memeOfWeek.likes.includes(user.id) ? 'currentColor' : 'none'} />
                  {memeOfWeek.likes.length}
                </button>
                <button onClick={() => handleShare(memeOfWeek.id)} className="flex items-center gap-2 text-text-muted hover:text-primary">
                  <Share2 className="w-5 h-5" />
                  {memeOfWeek.shares}
                </button>
                <button onClick={() => setViewingMeme(memeOfWeek)} className="flex items-center gap-2 text-text-muted hover:text-primary">
                  <MessageCircle className="w-5 h-5" />
                  {memeOfWeek.comments.length}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <Filter className="w-5 h-5 text-text-muted" />
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === cat ? 'bg-primary text-dark-bg' : 'bg-dark-card text-text-muted hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {memes.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="w-12 h-12 text-text-muted" />}
          title="No Memes Yet"
          description="Be the first to create a meme"
          action={user && <button onClick={() => setShowModal(true)} className="btn-primary">Create Meme</button>}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemes.map(meme => (
            <MemeCard
              key={meme.id}
              meme={meme}
              onLike={() => handleLike(meme.id)}
              onSave={() => handleSave(meme.id)}
              onShare={() => handleShare(meme.id)}
              onView={() => setViewingMeme(meme)}
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create a Meme" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Caption</label>
            <textarea
              required
              rows={3}
              value={formData.caption}
              onChange={e => setFormData(prev => ({ ...prev, caption: e.target.value }))}
              placeholder="Add a funny caption..."
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary resize-none"
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
            <label className="block text-sm text-text-secondary mb-2">Background Image</label>
            <div className="grid grid-cols-3 gap-2">
              {sampleImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: img }))}
                  className={`relative rounded-lg overflow-hidden ${formData.imageUrl === img ? 'ring-2 ring-primary' : ''}`}
                >
                  <img src={img} alt="" className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">Create Meme</button>
        </form>
      </Modal>

      <Modal isOpen={!!viewingMeme} onClose={() => setViewingMeme(null)} title="" size="xl">
        {viewingMeme && (
          <div>
            <img src={viewingMeme.imageUrl} alt={viewingMeme.caption} className="w-full h-64 object-cover rounded-lg mb-4" />
            <p className="text-text-secondary mb-4">{viewingMeme.caption}</p>
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => handleLike(viewingMeme.id)} className="flex items-center gap-2 text-text-muted hover:text-red-400">
                <Heart className="w-5 h-5" fill={user && viewingMeme.likes.includes(user.id) ? 'currentColor' : 'none'} />
                {viewingMeme.likes.length}
              </button>
              <span className="text-text-muted text-sm">by {viewingMeme.authorName} • {formatDate(viewingMeme.createdAt)}</span>
            </div>
            <div className="border-t border-dark-border pt-4">
              <h4 className="text-text-primary font-semibold mb-2">Comments</h4>
              {user && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary"
                  />
                  <button onClick={handleComment} className="btn-primary px-4">Post</button>
                </div>
              )}
              <div className="space-y-2">
                {viewingMeme.comments.map(c => (
                  <div key={c.id} className="p-3 bg-dark-hover rounded-lg">
                    <span className="text-text-primary font-medium">{c.authorName}</span>
                    <p className="text-text-muted text-sm">{c.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function MemeCard({ meme, onLike, onSave, onShare, onView, currentUserId }: {
  meme: Meme;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
  onView: () => void;
  currentUserId?: string;
}) {
  const liked = currentUserId && meme.likes.includes(currentUserId);
  const saved = currentUserId && meme.savedBy.includes(currentUserId);

  return (
    <div className="card group hover:border-purple-500/30 transition-colors">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={meme.imageUrl}
          alt={meme.caption}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {meme.isMemeOfWeek && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Meme of the Week
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-0.5 bg-dark-hover text-text-muted rounded text-xs">{meme.category}</span>
      </div>

      <p className="text-text-secondary text-sm mb-4 line-clamp-2 cursor-pointer hover:text-text-primary" onClick={onView}>{meme.caption}</p>

      <div className="flex items-center justify-between pt-4 border-t border-dark-border">
        <button onClick={onLike} className={`flex items-center gap-2 ${liked ? 'text-red-400' : 'text-text-muted hover:text-red-400'}`}>
          <Heart className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} />
          <span className="text-sm">{meme.likes.length}</span>
        </button>
        <button onClick={onView} className="flex items-center gap-2 text-text-muted hover:text-primary">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">{meme.comments.length}</span>
        </button>
        <button onClick={onShare} className="flex items-center gap-2 text-text-muted hover:text-primary">
          <Share2 className="w-5 h-5" />
        </button>
        <button onClick={onSave} className={`${saved ? 'text-primary' : 'text-text-muted hover:text-primary'}`}>
          <Bookmark className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
}
