import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ScrollText, Users, Image, User, X } from 'lucide-react';
import { useData, useAuth } from '../contexts';
import { formatDate } from '../hooks';
import { Story, Petition, Meme, Community } from '../contexts/DataContext';

export default function SearchPage() {
  const { stories, petitions, memes, communities, searchAll } = useData();
  const { users, getUserById } = useAuth();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return null;
    const q = query.toLowerCase();

    return {
      stories: stories.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q) ||
        s.authorName.toLowerCase().includes(q)
      ).slice(0, 5),
      petitions: petitions.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.creatorName.toLowerCase().includes(q)
      ).slice(0, 5),
      communities: communities.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      ).slice(0, 5),
      memes: memes.filter(m =>
        m.caption.toLowerCase().includes(q) ||
        m.authorName.toLowerCase().includes(q)
      ).slice(0, 5),
    };
  }, [query, stories, petitions, communities, memes]);

  const totalResults = results
    ? results.stories.length + results.petitions.length + results.communities.length + results.memes.length
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Search</h1>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search stories, petitions, communities, memes..."
          autoFocus
          className="w-full bg-dark-card border border-dark-border rounded-xl pl-14 pr-4 py-4 text-text-primary text-lg focus:outline-none focus:border-primary"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {!results && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted">Start typing to search across all content</p>
        </div>
      )}

      {results && totalResults === 0 && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <p className="text-text-primary text-lg mb-2">No results found</p>
          <p className="text-text-muted">Try different keywords or check spelling</p>
        </div>
      )}

      {results && totalResults > 0 && (
        <div className="space-y-8">
          <p className="text-text-muted text-sm">{totalResults} results for "{query}"</p>

          {results.stories.length > 0 && (
            <ResultSection
              title="Stories"
              icon={BookOpen}
              link="/stories"
              items={results.stories}
              render={(item: Story) => (
                <Link to="/stories" className="block p-4 bg-dark-card rounded-lg hover:bg-dark-hover transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 bg-dark-hover text-text-muted rounded text-xs">{item.category}</span>
                    <span className="text-text-muted text-xs">{formatDate(item.createdAt)}</span>
                  </div>
                  <h3 className="text-text-primary font-medium mb-1">{item.title}</h3>
                  <p className="text-text-muted text-sm line-clamp-2">{item.content}</p>
                  <p className="text-text-muted text-xs mt-2">by {item.authorName}</p>
                </Link>
              )}
            />
          )}

          {results.petitions.length > 0 && (
            <ResultSection
              title="Petitions"
              icon={ScrollText}
              link="/petitions"
              items={results.petitions}
              render={(item: Petition) => (
                <Link to={`/petitions/${item.id}`} className="block p-4 bg-dark-card rounded-lg hover:bg-dark-hover transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 bg-secondary/20 text-secondary rounded text-xs">{item.category}</span>
                    {item.urgent && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">Urgent</span>}
                  </div>
                  <h3 className="text-text-primary font-medium mb-1">{item.title}</h3>
                  <p className="text-text-muted text-sm line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-text-muted text-xs">
                    <span>{item.signatures.length.toLocaleString()} signatures</span>
                    <span>Goal: {item.goal.toLocaleString()}</span>
                  </div>
                </Link>
              )}
            />
          )}

          {results.communities.length > 0 && (
            <ResultSection
              title="Communities"
              icon={Users}
              link="/communities"
              items={results.communities}
              render={(item: Community) => (
                <Link to="/communities" className="block p-4 bg-dark-card rounded-lg hover:bg-dark-hover transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-2xl">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-text-primary font-medium">{item.name}</h3>
                      <p className="text-text-muted text-sm line-clamp-1">{item.description}</p>
                      <p className="text-text-muted text-xs mt-1">{item.members.length} members</p>
                    </div>
                  </div>
                </Link>
              )}
            />
          )}

          {results.memes.length > 0 && (
            <ResultSection
              title="Memes"
              icon={Image}
              link="/memes"
              items={results.memes}
              render={(item: Meme) => (
                <Link to="/memes" className="block p-4 bg-dark-card rounded-lg hover:bg-dark-hover transition-colors">
                  <div className="flex gap-4">
                    <img src={item.imageUrl} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <p className="text-text-secondary text-sm line-clamp-2">{item.caption}</p>
                      <p className="text-text-muted text-xs mt-2">{item.likes.length} likes • by {item.authorName}</p>
                    </div>
                  </div>
                </Link>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ResultSection<T>({ title, icon: Icon, link, items, render }: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  items: T[];
  render: (item: T) => React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          {title}
        </h2>
        <Link to={link} className="text-primary text-sm hover:underline">View All</Link>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i}>
            {render(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
