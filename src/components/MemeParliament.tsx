import { Link } from 'react-router-dom';
import { Heart, Share2, Sparkles } from 'lucide-react';
import { useData } from '../contexts';

export default function MemeParliament() {
  const { memes, likeMeme } = useData();

  const memeOfWeek = memes.find(m => m.isMemeOfWeek) || memes[0];

  if (!memeOfWeek) {
    return null;
  }

  const likeCount = memeOfWeek.likes?.length || 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-text-primary">Meme Parliament</h2>
        </div>
        <Link to="/memes" className="text-primary text-sm hover:underline">View All</Link>
      </div>

      <div className="relative">
        <img
          src={memeOfWeek.imageUrl}
          alt={memeOfWeek.caption}
          className="w-full h-48 object-cover rounded-lg"
        />
        {memeOfWeek.isMemeOfWeek && (
          <div className="absolute top-2 left-2 px-3 py-1 bg-primary text-dark-bg rounded-full text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Meme of the Week
          </div>
        )}
      </div>

      <p className="text-text-secondary text-sm mt-3 line-clamp-2">{memeOfWeek.caption}</p>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-border">
        <button
          onClick={() => likeMeme(memeOfWeek.id)}
          className="flex items-center gap-2 text-text-muted hover:text-red-400 transition-colors"
        >
          <Heart className="w-5 h-5" />
          <span className="text-sm">{likeCount.toLocaleString()}</span>
        </button>
        <button className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors">
          <Share2 className="w-5 h-5" />
          <span className="text-sm">{memeOfWeek.shares || 0}</span>
        </button>
      </div>
    </div>
  );
}
