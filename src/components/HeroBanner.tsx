import { Link } from 'react-router-dom';
import { Share2, Compass, Megaphone } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-dark-card to-dark-bg border border-dark-border">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1591198936756-7aec4e5a3ba1?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/90 to-transparent"></div>

      <div className="relative z-10 p-6 md:p-10 flex flex-col lg:flex-row items-center gap-8 min-h-[360px]">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-4">
            WE MAY BE CALLED{' '}
            <span className="text-primary">COCKROACHES</span>
            <div>BUT WE REFUSE TO STAY SILENT.</div>
          </h1>

          <div className="flex items-center gap-4 mt-6 mb-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
              <Megaphone className="w-12 h-12 text-dark-bg" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold text-text-primary">VOICE OF THE YOUTH.</p>
              <p className="text-xl md:text-2xl font-bold text-primary">POWER OF THE PEOPLE.</p>
              <p className="text-primary font-semibold mt-1">#MainBhiCockroach</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <Link to="/stories" className="btn-primary flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Your Story
            </Link>
            <Link to="/petitions" className="btn-secondary flex items-center gap-2">
              <Compass className="w-5 h-5" />
              Explore Issues
            </Link>
          </div>
        </div>

        <div className="hidden lg:block flex-shrink-0">
          <div className="relative">
            <div className="w-64 h-80 bg-gradient-to-b from-dark-hover to-dark-card rounded-2xl border border-dark-border flex items-center justify-center shadow-2xl">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-7xl">🪳</span>
                </div>
                <div className="px-4">
                  <div className="bg-dark-bg rounded-lg px-4 py-2 border border-dark-border">
                    <p className="text-xs text-text-secondary">wearing</p>
                    <p className="text-sm font-bold text-text-primary">BLACK HOODIE</p>
                    <p className="text-primary font-bold">CJP</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary rounded-full flex items-center justify-center animate-pulse">
              <Megaphone className="w-10 h-10 text-dark-bg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
