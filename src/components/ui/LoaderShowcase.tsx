import { useState, useEffect } from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'green' | 'purple' | 'gradient';
  showText?: boolean;
  text?: string;
}

export default function AwesomeLoader({
  size = 'medium',
  color = 'gradient',
  showText = true,
  text = 'Loading...'
}: LoaderProps) {
  const [progress, setProgress] = useState(0);
  
  // Simulated progress animation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        return newProgress > 100 ? 0 : newProgress;
      });
    }, 30);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Size classes mapping
  const sizeClasses = {
    small: {
      wrapper: 'w-20 h-20',
      circle: 'w-16 h-16',
      innerCircle: 'w-10 h-10',
      text: 'text-xs mt-2'
    },
    medium: {
      wrapper: 'w-32 h-32',
      circle: 'w-24 h-24',
      innerCircle: 'w-16 h-16',
      text: 'text-sm mt-3'
    },
    large: {
      wrapper: 'w-40 h-40',
      circle: 'w-32 h-32',
      innerCircle: 'w-20 h-20',
      text: 'text-base mt-4'
    }
  };

  // Color classes mapping
  const colorClasses = {
    blue: {
      outer: 'border-blue-500',
      inner: 'border-blue-300 bg-blue-100',
      text: 'text-blue-600',
      glow: 'shadow-blue-300'
    },
    green: {
      outer: 'border-green-500',
      inner: 'border-green-300 bg-green-100',
      text: 'text-green-600',
      glow: 'shadow-green-300'
    },
    purple: {
      outer: 'border-purple-500',
      inner: 'border-purple-300 bg-purple-100',
      text: 'text-purple-600',
      glow: 'shadow-purple-300'
    },
    gradient: {
      outer: 'border-transparent',
      inner: 'border-transparent bg-white',
      text: 'text-gray-700',
      glow: 'shadow-blue-300'
    }
  };

  // Determine if using gradient
  const isGradient = color === 'gradient';
  
  // Calculate the animated properties based on progress
  const rotation = progress * 3.6; // 3.6 degrees per 1% progress (360° total)
  const pulseScale = 1 + (Math.sin(progress * 0.1) * 0.05); // Subtle pulse between 0.95 and 1.05
  const dotOffset = Math.sin(progress * 0.1) * 3; // Dots movement oscillation

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative flex items-center justify-center ${sizeClasses[size].wrapper}`}>
        {/* Outer spinning circle */}
        <div 
          className={`absolute rounded-full border-4 ${colorClasses[color].outer} border-t-transparent animate-spin shadow-lg ${colorClasses[color].glow} ${sizeClasses[size].circle}`}
          style={{
            animationDuration: '1.5s',
            ...(isGradient ? {
              background: 'linear-gradient(45deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1))',
              borderImage: 'linear-gradient(45deg, #3b82f6, #9333ea) 1',
              borderStyle: 'solid'
            } : {})
          }}
        />
        
        {/* Glowing background effect */}
        <div 
          className={`absolute rounded-full opacity-20 animate-pulse ${sizeClasses[size].circle}`}
          style={{
            transform: `scale(${pulseScale})`,
            background: isGradient 
              ? 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(147,51,234,0.4) 100%)' 
              : '',
            animationDuration: '2s'
          }}
        />
        
        {/* Inner pulsing circle */}
        <div 
          className={`rounded-full border-2 ${colorClasses[color].inner} flex items-center justify-center shadow-inner ${sizeClasses[size].innerCircle}`}
          style={{ transform: `scale(${pulseScale})` }}
        >
          {/* Progress percentage */}
          <span 
            className={`font-semibold ${colorClasses[color].text}`}
            style={{ fontSize: size === 'small' ? '0.75rem' : size === 'medium' ? '0.875rem' : '1rem' }}
          >
            {progress}%
          </span>
        </div>
        
        {/* Decorative dots orbiting */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
          const radian = (angle + rotation) * (Math.PI / 180);
          const radius = size === 'small' ? 9 : size === 'medium' ? 13 : 17;
          const adjustedRadius = radius + (index % 2 === 0 ? dotOffset : -dotOffset);
          
          const x = Math.cos(radian) * adjustedRadius;
          const y = Math.sin(radian) * adjustedRadius;
          
          const dotSize = size === 'small' ? 'w-1 h-1' : size === 'medium' ? 'w-1.5 h-1.5' : 'w-2 h-2';
          
          return (
            <div 
              key={index}
              className={`absolute rounded-full ${dotSize} ${isGradient ? 'bg-gradient-to-r from-blue-500 to-purple-500' : `bg-${color.replace('gradient', 'blue')}-500`}`}
              style={{
                transform: `translate(${x}px, ${y}px) scale(${1 - (progress % 25) / 100})`,
                opacity: 0.7 + (index % 3) * 0.1,
              }}
            />
          );
        })}
      </div>
      
      {/* Loading text */}
      {showText && (
        <div className={`${colorClasses[color].text} ${sizeClasses[size].text} font-medium`}>
          {text}
        </div>
      )}
    </div>
  );
}

// Demo component to showcase the different loader variations
export function LoaderShowcase() {
  return (
    <div className="p-12 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-12 text-gray-800">Awesome Loader Showcase</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-6 text-gray-700">Blue Loader</h3>
          <AwesomeLoader color="blue" />
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-6 text-gray-700">Green Loader</h3>
          <AwesomeLoader color="green" />
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-6 text-gray-700">Purple Loader</h3>
          <AwesomeLoader color="purple" />
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-6 text-gray-700">Small Gradient</h3>
          <AwesomeLoader size="small" color="gradient" />
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-6 text-gray-700">Medium Gradient</h3>
          <AwesomeLoader size="medium" color="gradient" />
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-6 text-gray-700">Large Gradient</h3>
          <AwesomeLoader size="large" color="gradient" text="Loading Data..." />
        </div>
      </div>
    </div>
  );
}