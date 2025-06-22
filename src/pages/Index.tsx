
import { useState } from 'react';
import Header from '../components/Header';
import ApodSection from '../components/ApodSection';
import MarsRoverSection from '../components/MarsRoverSection';
import NeoSection from '../components/NeoSection';
import EarthSection from '../components/EarthSection';
import Footer from '../components/Footer';

const Index = () => {
  const [activeSection, setActiveSection] = useState('apod');

  const sections = [
    { id: 'apod', label: 'Daily Picture', component: ApodSection },
    { id: 'mars', label: 'Mars Rovers', component: MarsRoverSection },
    { id: 'neo', label: 'Asteroids', component: NeoSection },
    { id: 'earth', label: 'Earth Images', component: EarthSection },
  ];

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || ApodSection;

  return (
    <div className="min-h-screen bg-space-gradient">
      <Header />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-40 glass-card mx-4 mt-4 mb-8 rounded-2xl">
        <div className="flex flex-wrap justify-center gap-2 p-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeSection === section.id
                  ? 'bg-primary text-primary-foreground shadow-lg space-glow'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        <ActiveComponent />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
