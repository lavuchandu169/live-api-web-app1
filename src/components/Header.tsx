
import { Star } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative overflow-hidden py-12 px-4">
      <div className="absolute inset-0 bg-nebula-gradient opacity-50"></div>
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Star className="text-space-star animate-twinkle" size={40} />
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
            NASA Space Explorer
          </h1>
          <Star className="text-space-star animate-twinkle" size={40} style={{ animationDelay: '1s' }} />
        </div>
        <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
          Discover the wonders of our universe through NASA's incredible imagery and data
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
          <span>Powered by NASA Open Data</span>
          <span>•</span>
          <span>Updated Daily</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
