'use client';
import React, { useState, useEffect } from 'react';
import { Home, RefreshCw, Search, ArrowLeft } from 'lucide-react';

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
};

const NotFound = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isGlitching, setIsGlitching] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Initialize floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, #894cd1 0%, transparent 50%)`,
          transition: 'background 0.3s ease',
        }}
      />
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-purple-500 rounded-full opacity-60 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.speed + 2}s`,
          }}
        />
      ))}

      {/* Main content container */}
      <div className="relative z-10 bg-zinc-700 min-h-screen flex items-center justify-center">
        <div className="text-center px-6 max-w-4xl mx-auto">
          
          {/* Animated 404 text */}
          <div className="relative mb-8">
            <h1 
              className={`text-8xl md:text-9xl font-bold mb-4 transition-all duration-200 ${
                isGlitching ? 'transform scale-105 skew-x-2' : ''
              }`}
              style={{
                background: 'linear-gradient(45deg, #894cd1, #c084fc, #894cd1)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientShift 3s ease-in-out infinite',
              }}
            >
              404
            </h1>
            
            {/* Glitch overlay */}
            {isGlitching && (
              <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-red-500 opacity-70 animate-ping">
                404
              </div>
            )}
          </div>

          {/* Animated subtitle */}
          <div className="mb-8 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 animate-bounce">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-300 animate-pulse">
              Looks like this page decided to take a vacation
            </p>
          </div>

          {/* Animated search bar */}
         
          {/* Action buttons */}
          

          {/* Animated robot/alien character */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <div 
                className="w-full h-full rounded-full border-4 border-purple-500 animate-spin"
                style={{
                  background: 'conic-gradient(from 0deg, #894cd1, #c084fc, #894cd1)',
                  animationDuration: '3s',
                }}
              />
              <div className="absolute inset-2 bg-zinc-700 rounded-full flex items-center justify-center">
                <div className="text-4xl animate-bounce">🛸</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 animate-pulse">
              Our space crew is working on it!
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;