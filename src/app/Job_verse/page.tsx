'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

// Floating particle component
const FloatingParticle = ({ delay = 0 }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const animate = () => {
      setPosition({
        x: Math.sin(Date.now() * 0.001 + delay) * 20,
        y: Math.cos(Date.now() * 0.0015 + delay) * 15
      });
    };
    
    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [delay]);
  
  return (
    <div
      className="absolute w-2 h-2 bg-[#894cd1] rounded-full opacity-30 blur-sm"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.1s ease-out'
      }}
    />
  );
};

// Animated icon component
type AnimatedIconProps = {
  children: React.ReactNode;
  isHovered: boolean;
};

const AnimatedIcon = ({ children, isHovered }: AnimatedIconProps) => (
  <div className={`
    mb-8 transition-all duration-500 ease-out
    ${isHovered ? 'scale-110 drop-shadow-lg' : 'scale-100'}
  `}>
    <div className={`
      w-16 h-16 mx-auto flex items-center justify-center
      rounded-full bg-gradient-to-br from-[#894cd1] to-purple-600
      transition-all duration-300
      ${isHovered ? 'shadow-lg shadow-[#894cd1]/50 rotate-6' : 'rotate-0'}
    `}>
      {children}
    </div>
  </div>
);

// Post Job Icon
const PostJobIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

// Review Jobs Icon
const ReviewJobsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
    <path d="M9 11H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h5l2 2h9a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-9l-2-2z"/>
    <path d="M22 11V9"/>
    <path d="M11 11V9"/>
  </svg>
);

// Job option card component
type JobCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
};

const JobCard = ({ icon, title, description, onClick, className = "" }: JobCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  type Ripple = { x: number; y: number; size: number; id: number };
  const [ripples, setRipples] = useState<Ripple[]>([]);
  
  const createRipple = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    onClick();
  };
  
  return (
    <div
      className={`
        group relative overflow-hidden cursor-pointer 
        flex flex-col items-center justify-center p-12
        bg-zinc-700 rounded-2xl transition-all duration-500 ease-out
        hover:bg-zinc-600 hover:scale-105 hover:shadow-2xl
        border border-zinc-600 hover:border-[#894cd1]
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={createRipple}
    >
      {/* Gradient overlay */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500
        bg-gradient-to-br from-[#894cd1] to-transparent
      `} />
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full bg-[#894cd1] opacity-30 animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            animationDuration: '0.6s'
          }}
        />
      ))}
      
      {/* Floating particles */}
      <FloatingParticle delay={0} />
      <FloatingParticle delay={1} />
      <FloatingParticle delay={2} />
      
      {/* Animated border */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
        transition-opacity duration-500
        bg-gradient-to-r from-[#894cd1] via-transparent to-[#894cd1]
        bg-size-200 animate-gradient-x
      `} style={{ padding: '2px' }}>
        <div className="w-full h-full bg-zinc-700 rounded-2xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <AnimatedIcon isHovered={isHovered}>
          {icon}
        </AnimatedIcon>
        
        <h2 className={`
          text-2xl font-bold mb-3 transition-all duration-300
          ${isHovered ? 'text-[#894cd1] scale-110' : 'text-white'}
        `}>
          {title}
        </h2>
        
        <p className={`
          text-center text-zinc-300 transition-all duration-300 leading-relaxed
          ${isHovered ? 'text-zinc-200 scale-105' : ''}
        `}>
          {description}
        </p>
      </div>
      
      {/* Corner accent */}
      <div className={`
        absolute top-0 right-0 w-20 h-20 
        bg-gradient-to-bl from-[#894cd1] to-transparent
        opacity-0 group-hover:opacity-20 transition-opacity duration-500
        rounded-bl-full
      `} />
    </div>
  );
};

export default function JobVerse() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#894cd1] rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>
      
      {/* Main content container */}
      <div className="relative z-10 max-w-4xl mx-auto p-8">
        {/* Header with enhanced typography */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white relative">
            <span className="bg-gradient-to-r from-white via-zinc-200 to-white bg-clip-text text-transparent">
              What do you want to do?
            </span>
            
            {/* Underline animation */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-[#894cd1] to-purple-500 animate-pulse" 
                 style={{ 
                   animation: 'expandWidth 2s ease-in-out 0.5s forwards',
                   width: '0%'
                 }} />
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Choose your path and let&apos;s create something amazing together
          </p>
        </div>

        {/* Job cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <JobCard
            icon={<PostJobIcon />}
            title="Post a Job"
            description="Create and publish a new job listing to find the perfect candidate for your team"
            onClick={() => router.push('/jobpost')}
            className="hover:shadow-[#894cd1]/20"
          />
          
          <JobCard
            icon={<ReviewJobsIcon />}
            title="Review Jobs"
            description="Manage and review all your posted jobs, track applications and hiring progress"
            onClick={() => router.push('/job-board')}
            className="hover:shadow-[#894cd1]/20"
          />
        </div>
        
        {/* Bottom accent */}
        <div className="mt-16 text-center">
          <div className="inline-block w-12 h-1 bg-gradient-to-r from-transparent via-[#894cd1] to-transparent rounded-full" />
        </div>
      </div>
      
      {/* Custom styles */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes expandWidth {
          0% { width: 0%; }
          100% { width: 60%; }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .bg-size-200 {
          background-size: 200% 200%;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}