
import { Star } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 py-8 border-t border-white/10">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Star className="text-primary animate-twinkle" size={20} />
          <span className="text-white/90">Built with NASA Open Data APIs</span>
          <Star className="text-primary animate-twinkle" size={20} style={{ animationDelay: '1s' }} />
        </div>
        <p className="text-white/60 text-sm">
          Exploring the cosmos through science and technology
        </p>
        <div className="mt-4 text-white/40 text-xs">
          Data provided by NASA • Educational purposes only
        </div>
      </div>
    </footer>
  );
};

export default Footer;
