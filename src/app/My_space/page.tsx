'use client';
import { Briefcase, FolderOpen, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClaudeInterface() {
  const [hoveredCard, setHoveredCard] = useState<null | 'back' | 'job' | 'project'>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoaded(false);
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Mock router function for demo purposes
  const handleBackClick = () => {
    router.push('/dashboard')
  };
  const handleJobClick = () => {
    router.push('/Job_verse')
  }
  const handleProjectClick = () => {
    router.push('/project_verse')
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center p-4 relative">
      {/* Improved Back Button with Animation */}
      <button
        onClick={handleBackClick}
        className={`absolute top-6 left-6 flex items-center gap-2  bg-purple-500 hover:bg-purple-800 border border-zinc-800 hover:border-purple-500 rounded-base px-4 py-2 transition-all duration-300 ${hoveredCard === 'back' ? 'scale-105' : ''} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        aria-label="Back to Dashboard"
        onMouseEnter={() => setHoveredCard('back')}
        onMouseLeave={() => setHoveredCard(null)}
        style={{ transitionDelay: '100ms' }}
      >
        <ArrowLeft size={18} className="text-white " />
        <span className="text-sm font-medium">Dashboard</span>
      </button>

      <div className={`mb-6 flex items-center gap-2 transition-opacity duration-700 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-purple-500 text-2xl">●</div>
        <h1 className="text-2xl font-medium">WorkLink</h1>
      </div>
      
      <h2 className={`text-4xl font-light mb-12 text-center transition-opacity duration-700 ease-in-out delay-100 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        How would you like to proceed?
      </h2>
      
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center">
        <button
          onClick={handleJobClick}
          className={`bg-zinc-800 border border-zinc-700 hover:border-purple-500 rounded-xl p-8 w-full md:w-80 md:h-96 flex flex-col items-center text-center transition-all duration-300 ${hoveredCard === 'job' ? 'scale-105' : ''} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          onMouseEnter={() => setHoveredCard('job')}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="flex items-center justify-center h-24 w-24 mb-12">
            <Briefcase size={84} className={`transition-colors duration-300 ${hoveredCard === 'job' ? 'text-purple-500' : ''}`} />
          </div>
          <h3 className="text-2xl font-medium mb-3">Job Verse</h3>
            <p className="text-zinc-400 text-sm">
            Create job listings, review applications, manage recruitment workflows, and connect with top talent for your organization.
            </p>
        </button>
        
        <button 
          onClick={handleProjectClick}
          className={`bg-zinc-800 border border-zinc-700 hover:border-purple-500 rounded-xl p-8 w-full md:w-80 md:h-96 flex flex-col items-center text-center transition-all duration-300 ${hoveredCard === 'project' ? 'scale-105' : ''} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          onMouseEnter={() => setHoveredCard('project')}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="flex items-center justify-center h-24 w-24 mb-12">
            <FolderOpen size={84} className={`transition-colors duration-300 ${hoveredCard === 'project' ? 'text-purple-500' : ''}`} />
          </div>
          <h3 className="text-2xl font-medium mb-3">Project Verse</h3>
            <p className="text-zinc-400 text-sm">
            Get higher engagement and better proposals for your project listings. 
            Effortlessly manage submissions, collaborate with contributors, and bring your ideas to life with the right talent.
            </p>
        </button>
      </div>
      <div className={`mt-8 text-center text-purple-500 text-sm transition-opacity duration-700 ease-in-out delay-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        Click on an option to continue
      </div>
    </div>
  );
}