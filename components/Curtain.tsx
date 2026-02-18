
import React from 'react';

interface CurtainProps {
  isOpen: boolean;
  onClick: () => void;
  themeColor: string;
}

export const Curtain: React.FC<CurtainProps> = ({ isOpen, onClick, themeColor }) => {
  return (
    <div 
      className={`fixed inset-0 z-50 flex transition-all duration-1000 ease-in-out cursor-pointer overflow-hidden ${isOpen ? 'pointer-events-none' : ''}`}
      onClick={onClick}
    >
      {/* Left Panel */}
      <div 
        className={`w-1/2 h-full relative transition-transform duration-[1500ms] ease-in-out transform ${isOpen ? '-translate-x-full' : 'translate-x-0'}`}
        style={{ 
          backgroundColor: themeColor,
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, transparent 5%, rgba(0,0,0,0.1) 10%, transparent 15%, rgba(0,0,0,0.2) 20%, transparent 25%, rgba(0,0,0,0.1) 30%)'
        }}
      >
        <div className="absolute inset-y-0 right-0 w-4 bg-black/10 shadow-inner" />
      </div>

      {/* Right Panel */}
      <div 
        className={`w-1/2 h-full relative transition-transform duration-[1500ms] ease-in-out transform ${isOpen ? 'translate-x-full' : 'translate-x-0'}`}
        style={{ 
          backgroundColor: themeColor,
          backgroundImage: 'linear-gradient(to left, rgba(0,0,0,0.2) 0%, transparent 5%, rgba(0,0,0,0.1) 10%, transparent 15%, rgba(0,0,0,0.2) 20%, transparent 25%, rgba(0,0,0,0.1) 30%)'
        }}
      >
        <div className="absolute inset-y-0 left-0 w-4 bg-black/10 shadow-inner" />
      </div>

      {/* Center Label */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-full shadow-2xl animate-pulse">
           <p className="text-white font-serif text-xl tracking-widest uppercase">Tap to Open</p>
        </div>
      </div>
    </div>
  );
};
