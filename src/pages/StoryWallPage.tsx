import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, MessageCircle, Share2, Plus, X, Bookmark, Flag, Edit2, Trash2, Search, Filter, Clock, TrendingUp } from 'lucide-react';
import { useData, useAuth, useToast } from '../contexts';
import { formatDate } from '../hooks';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { Story, Comment } from '../contexts/DataContext';

const categories = ['All', 'Career', 'Education', 'Exam', 'Government', 'Corruption', 'Personal', 'Politics'];

export default function StoryWallPage() {
  const { stories, addStory, updateStory, deleteStory, upvoteStory, downvoteStory, commentOnStory, saveStory, reportStory } = useData();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [sort, setSort] = useState<'newest' | 'upvotes' | 'trending'>('newest');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ title: '', content: '', category: 'Personal', isAnonymous: false });

  const filteredStories = useMemo(() => {
    let result = [...stories];
    if (category !== 'All') {
      result = result.filter(s => s.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q));
    }
    switch (sort) {
      case 'upvotes':
        result.sort((a, b) => b.upvotes - a.downvotes - (a.upvotes - a.downvotes));
        break;
      case 'trending':
        result.sort((a, b) => (b.upvotes / (new Date().getTime() - new Date(b.createdAt).getTime())) - (a.upvotes / (new Date().getTime() - new Date(a.createdAt).getTime())));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return result;
  }, [stories, sort, category, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (editingStory) {
      updateStory(editingStory.id, { title: formData.title, content: formData.content, category: formData.category });
      showToast('Story updated!', 'success');
    } else {
      addStory({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        authorId: user!.id,
        authorName: formData.isAnonymous ? 'Anonymous' : user!.username,
        authorAvatar: user!.avatar,
        isAnonymous: formData.isAnonymous,
      });
      showToast('Story published!', 'success');
    }
    setFormData({ title: '', content: '', category: 'Personal', isAnonymous: false });
    setShowModal(false);
    setEditingStory(null);
  };

  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setFormData({ title: story.title, content: story.content, category: story.category, isAnonymous: story.isAnonymous });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    deleteStory(id);
    showToast('Story deleted', 'info');
  };

  const openCreateModal = () => {
    setEditingStory(null);
    setFormData({ title: '', content: '', category: 'Personal', isAnonymous: false });
    setShowModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Story Wall</h1>
          <p className="text-text-secondary text-sm">Share your story. Your voice matters.</p>
        </div>
        {user && (
          <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Share Your Story
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
            placeholder="Search stories..."
            className="w-full bg-dark-card border border-dark-border rounded-lg pl-12 pr-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-text-muted" />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as typeof sort)}
            className="bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
          >
            <option value="newest">Newest</option>
            <option value="upvotes">Most Upvoted</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </div>

      {stories.length === 0 ? (
        <EmptyState
          icon={<MessageCircle className="w-12 h-12 text-text-muted" />}
          title="No Stories Yet"
          description="Be the first to share your story with the community"
          action={user && <button onClick={openCreateModal} className="btn-primary">Share Your Story</button>}
        />
      ) : (
        <div className="space-y-4">
          {filteredStories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              onUpvote={() => { if (user) upvoteStory(story.id) }}
              onDownvote={() => downvoteStory(story.id)}
              onSave={() => { saveStory(story.id); showToast(story.savedBy.includes(user?.id || '') ? 'Removed from saved' : 'Saved!', 'success'); }}
              onReport={() => { reportStory(story.id); showToast('Story reported', 'info'); }}
              onEdit={() => handleEdit(story)}
              onDelete={() => handleDelete(story.id)}
              onView={() => setViewingStory(story)}
              isOwner={user?.id === story.authorId}
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingStory(null); }} title={editingStory ? 'Edit Story' : 'Share Your Story'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Give your story a title..."
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Category</label>
            <select
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
            >
              {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Your Story</label>
            <textarea
              required
              rows={6}
              value={formData.content}
              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share your experience with the community..."
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
              className={`w-12 h-6 rounded-full transition-colors ${formData.isAnonymous ? 'bg-primary' : 'bg-dark-hover'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${formData.isAnonymous ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
            <label className="text-text-secondary text-sm">Post anonymously</label>
          </div>
          <button type="submit" className="btn-primary w-full">
            {editingStory ? 'Update Story' : 'Publish Story'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={!!viewingStory} onClose={() => setViewingStory(null)} title={viewingStory?.title || ''} size="xl">
        {viewingStory && (
          <StoryDetail
            story={viewingStory}
            onComment={(content, replyTo) => {
              commentOnStory(viewingStory.id, content, replyTo);
              const updated = stories.find(s => s.id === viewingStory.id);
              if (updated) setViewingStory(updated);
            }}
            currentUserId={user?.id}
          />
        )}
      </Modal>
    </div>
  );
}

function StoryCard({ story, onUpvote, onDownvote, onSave, onReport, onEdit, onDelete, onView, isOwner, currentUserId }: {
  story: Story;
  onUpvote: () => void;
  onDownvote: () => void;
  onSave: () => void;
  onReport: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  isOwner: boolean;
  currentUserId?: string;
}) {
  const saved = currentUserId && story.savedBy.includes(currentUserId);

  return (
    <div className="card group">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <button onClick={onUpvote} className="p-2 rounded-lg hover:bg-primary/20 text-text-muted hover:text-primary transition-colors">
            <ArrowUp className="w-5 h-5" />
          </button>
          <span className="text-text-primary font-bold">{story.upvotes - story.downvotes}</span>
          <button onClick={onDownvote} className="p-2 rounded-lg hover:bg-secondary/20 text-text-muted hover:text-secondary transition-colors">
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-dark-hover text-text-muted rounded text-xs">{story.category}</span>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2 cursor-pointer hover:text-primary" onClick={onView}>{story.title}</h3>
          <p className="text-text-secondary text-sm mb-4 line-clamp-3">{story.content}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">{story.isAnonymous ? '🎭' : '👤'}</span>
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">{story.authorName}</p>
                  <p className="text-text-muted text-xs">{formatDate(story.createdAt)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onView} className="flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors px-2 py-1 rounded hover:bg-dark-hover">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{story.comments.length}</span>
              </button>
              <button onClick={onSave} className={`p-2 rounded hover:bg-dark-hover transition-colors ${saved ? 'text-primary' : 'text-text-muted hover:text-primary'}`}>
                <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
              </button>
              <button onClick={onReport} className="p-2 text-text-muted hover:text-secondary rounded hover:bg-dark-hover transition-colors">
                <Flag className="w-4 h-4" />
              </button>
              {isOwner && (
                <>
                  <button onClick={onEdit} className="p-2 text-text-muted hover:text-primary rounded hover:bg-dark-hover transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={onDelete} className="p-2 text-text-muted hover:text-secondary rounded hover:bg-dark-hover transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryDetail({ story, onComment, currentUserId }: { story: Story; onComment: (content: string, replyTo?: string) => void; currentUserId?: string }) {
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(commentText, replyingTo || undefined);
    setCommentText('');
    setReplyingTo(null);
  };

  const renderComments = (comments: Comment[], depth = 0) => (
    <div className={`space-y-4 ${depth > 0 ? 'ml-8' : ''}`}>
      {comments.map(comment => (
        <div key={comment.id} className="p-3 bg-dark-hover rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-text-primary font-medium text-sm">{comment.authorName}</span>
            <span className="text-text-muted text-xs">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-text-secondary text-sm">{comment.content}</p>
          <button onClick={() => setReplyingTo(comment.id)} className="text-primary text-xs mt-2 hover:underline">
            Reply
          </button>
          {comment.replies.length > 0 && renderComments(comment.replies, depth + 1)}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 bg-dark-hover text-text-muted rounded text-xs">{story.category}</span>
        <span className="text-text-muted text-xs">{formatDate(story.createdAt)}</span>
      </div>
      <p className="text-text-secondary mb-6">{story.content}</p>

      <div className="border-t border-dark-border pt-4">
        <h4 className="text-text-primary font-semibold mb-4">Comments ({story.comments.length})</h4>
        {currentUserId && (
          <form onSubmit={handleSubmit} className="mb-4">
            {replyingTo && (
              <div className="flex items-center gap-2 mb-2 text-text-muted text-sm">
                Replying to comment
                <button type="button" onClick={() => setReplyingTo(null)} className="text-primary hover:underline">Cancel</button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary"
              />
              <button type="submit" className="btn-primary px-4">Post</button>
            </div>
          </form>
        )}
        {renderComments(story.comments)}
      </div>
    </div>
  );
}
