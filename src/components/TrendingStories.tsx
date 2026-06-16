import { Link } from 'react-router-dom';
import { ArrowUp, MessageCircle, TrendingUp } from 'lucide-react';
import { useData } from '../contexts';

export default function TrendingStories() {
  const { stories, upvoteStory } = useData();

  const trendingStories = stories.slice(0, 4);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-primary">Trending Stories</h2>
        </div>
        <Link to="/stories" className="text-primary text-sm hover:underline">View All</Link>
      </div>

      <div className="space-y-3">
        {trendingStories.map(story => (
          <div
            key={story.id}
            className="p-3 bg-dark-hover rounded-lg hover:bg-dark-border/50 transition-colors cursor-pointer"
          >
            <p className="text-text-primary font-medium line-clamp-2 mb-2">{story.title}</p>
            <div className="flex items-center justify-between">
              <p className="text-text-muted text-xs">
                by {story.authorName} • {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'Recently'}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    upvoteStory(story.id);
                  }}
                  className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm">{story.upvotes}</span>
                </button>
                <div className="flex items-center gap-1 text-text-muted">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{story.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
