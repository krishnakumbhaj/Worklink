'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  Users, 
  Clock, 
  Search, 
  Code,
  PlusCircle,
} from 'lucide-react';

export default function Project_verse () {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    setLoaded(false);
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (path: string, title: string) => {
    setNavigating(true);
    setNavigationTarget(title);
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      router.push(path);
    }, 800);
  };

  const clientCards = [
    {
      id: 'My Projects',
      title: "My Projects", 
      description: "Manage your posted projects, view applications, and track the status of all your project listings.",
      icon: <Briefcase size={48} />,
      path: "/work-projects",
      delay: '200ms'
    },
    {
      id: 'Review Applications',
      title: "Review Applications",
      description: "Review and evaluate project applicants, compare proposals, and select the perfect freelancer for your projects.",
      icon: <Users size={48} />,
      path: "/review_applications",
      delay: '300ms'
    },
    {
      id: 'Active Projects',
      title: "Active Projects",
      description: "Monitor progress, communicate with freelancers, and track milestones of your active projects.",
      icon: <Clock size={48} />,
      path: "/ClientOngoingProjects",
      delay: '400ms'
    }
  ];

  const freelancerCards = [
    {
      id: 'Available Work',
      title: "Available Work",
      description: "Browse available projects, discover new opportunities, and apply to projects that match your skills and interests.",
      icon: <Search size={48} />,
      path: "/dev_listing_project",
      delay: '600ms'
    },
    {
      id: 'My Assignments',
      title: "My Assignments",
      description: "Manage your accepted freelance projects, track deadlines, and collaborate with clients on active work.",
      icon: <Code size={48} />,
      path: "/OngoingProjects",
      delay: '700ms'
    }
  ];

  // Loading Overlay Component
  const LoadingOverlay = () => (
    <div className={`fixed inset-0 bg-[#121212] backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-500 ${navigating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="text-center">
        <div className="relative mb-6">
          {/* Animated circles */}
          <div className="w-20 h-20 mx-auto relative">
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xl font-medium text-white">Loading {navigationTarget}</p>
          <p className="text-purple-400 text-sm">Preparing your workspace...</p>
        </div>
        {/* Progress bar */}
        <div className="w-64 h-1 bg-zinc-800 rounded-full mt-6 mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <LoadingOverlay />
      <div className="bg-[#121212] min-h-screen text-white flex flex-col items-center justify-center p-4 relative">
        {/* Back Button */}
        <button
          onClick={() => handleNavigation('/post_work', 'Putting it out...')}
          className={`absolute top-6 right-6 flex items-center gap-2 bg-purple-500 hover:bg-purple-800 border border-zinc-800 hover:border-purple-500 rounded-xl px-7 py-4 transition-all duration-300 ${hoveredCard === 'back' ? 'scale-105' : ''} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
          aria-label="Back to Home"
          onMouseEnter={() => setHoveredCard('back')}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ transitionDelay: '100ms' }}
          disabled={navigating}
        >
          <PlusCircle size={18} className="text-white" />
          <span className="text-sm font-medium">Create Work</span>
        </button>

        {/* Header */}
        <div className={`mb-6 flex items-center gap-2 transition-opacity duration-700 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-purple-500 text-2xl">●</div>
          <h1 className="text-2xl font-medium">WorkLink Dashboard</h1>
        </div>
        
        <h2 className={`text-4xl font-light mb-6 text-center transition-opacity duration-700 ease-in-out delay-100 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          Choose your workspace
        </h2>

        {/* Client Section */}
        <div className="w-full max-w-6xl mb-8">
          <h3 className={`text-xl font-medium mb-4 text-purple-400 transition-opacity duration-700 ease-in-out delay-150 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            As a Client
          </h3>
          <div className="flex flex-col items-center gap-4">
            {/* Top card - centered */}
            <div className="w-full max-w-md">
              <button
                onClick={() => handleNavigation(clientCards[0].path, clientCards[0].title)}
                className={`w-full bg-zinc-800 border border-zinc-700 hover:border-purple-500 rounded-xl p-6 h-32 flex items-center gap-6 text-left transition-all duration-300 ${hoveredCard === clientCards[0].id ? 'scale-105' : ''} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${navigating ? 'opacity-50 cursor-not-allowed' : ''}`}
                onMouseEnter={() => !navigating && setHoveredCard(clientCards[0].id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ transitionDelay: clientCards[0].delay }}
                disabled={navigating}
              >
                <div className="flex-shrink-0">
                  <div className={`transition-colors duration-300 ${hoveredCard === clientCards[0].id ? 'text-purple-500' : 'text-white'}`}>
                    {clientCards[0].icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium mb-2">{clientCards[0].title}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">{clientCards[0].description}</p>
                </div>
              </button>
            </div>
            
            {/* Bottom two cards - side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
              {clientCards.slice(1).map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleNavigation(card.path, card.title)}
                  className={`bg-zinc-800 border border-zinc-700 hover:border-purple-500 rounded-xl p-6 h-32 flex items-center gap-6 text-left transition-all duration-300 ${hoveredCard === card.id ? 'scale-105' : ''} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${navigating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onMouseEnter={() => !navigating && setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ transitionDelay: card.delay }}
                  disabled={navigating}
                >
                  <div className="flex-shrink-0">
                    <div className={`transition-colors duration-300 ${hoveredCard === card.id ? 'text-purple-500' : 'text-white'}`}>
                      {card.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium mb-2">{card.title}</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">{card.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Freelancer Section */}
        <div className="w-full max-w-6xl mb-8">
          <h3 className={`text-xl font-medium mb-4 text-purple-400 transition-opacity duration-700 ease-in-out delay-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            As a Freelancer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freelancerCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleNavigation(card.path, card.title)}
                className={`bg-zinc-800 border border-zinc-700 hover:border-purple-500 rounded-xl p-6 h-32 flex items-center gap-6 text-left transition-all duration-300 ${hoveredCard === card.id ? 'scale-105' : ''} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${navigating ? 'opacity-50 cursor-not-allowed' : ''}`}
                onMouseEnter={() => !navigating && setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ transitionDelay: card.delay }}
                disabled={navigating}
              >
                <div className="flex-shrink-0">
                  <div className={`transition-colors duration-300 ${hoveredCard === card.id ? 'text-purple-500' : 'text-white'}`}>
                    {card.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium mb-2">{card.title}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">{card.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={`mt-4 text-center text-purple-500 text-sm transition-opacity duration-700 ease-in-out delay-800 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          Select an option to continue
        </div>
      </div>
    </>
  );
};

// export default Project_verse;