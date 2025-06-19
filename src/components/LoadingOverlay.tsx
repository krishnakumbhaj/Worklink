'use client';

import React from 'react';

interface LoadingOverlayProps {
  navigating: boolean;
  navigationTarget?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ navigating, navigationTarget }) => (
  <div className={`fixed inset-0 bg-[#121212] backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-500 ${navigating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
    <div className="text-center">
      <div className="relative mb-6">
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
      <div className="w-64 h-1 bg-zinc-800 rounded-full mt-6 mx-auto overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full animate-pulse" style={{ width: '70%' }}></div>
      </div>
    </div>
  </div>
);

export default LoadingOverlay;
