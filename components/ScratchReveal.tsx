
import React, { useRef, useEffect, useState } from 'react';

interface ScratchRevealProps {
  id: string;
  onComplete: () => void;
  content: React.ReactNode;
}

export const ScratchReveal: React.FC<ScratchRevealProps> = ({ id, onComplete, content }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background color for the scratch surface
    ctx.fillStyle = '#D4AF37'; // Gold-ish
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add noise/texture
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    for(let i=0; i<400; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 0.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Add some text instruction on canvas
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE', canvas.width/2, canvas.height/2 + 30);
  }, []);

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPosition(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    checkRevealStatus();
  };

  const checkRevealStatus = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) transparentPixels++;
    }

    const percent = (transparentPixels / (pixels.length / 4)) * 100;
    if (percent > 45 && !isRevealed) {
      setIsRevealed(true);
      onComplete();
    }
  };

  return (
    <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-8 border-white flex items-center justify-center bg-white">
      {/* Revealed Content */}
      <div className={`absolute inset-0 flex items-center justify-center p-6 transition-all duration-700 ${isRevealed ? 'scale-110' : 'scale-90'}`}>
        {content}
      </div>

      {/* Interactive Scratch Layer */}
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className={`absolute inset-0 cursor-crosshair touch-none transition-opacity duration-1000 ${isRevealed ? 'opacity-0' : 'opacity-100'}`}
        onMouseDown={() => (isDrawing.current = true)}
        onMouseUp={() => (isDrawing.current = false)}
        onMouseLeave={() => (isDrawing.current = false)}
        onMouseMove={scratch}
        onTouchStart={(e) => { e.preventDefault(); isDrawing.current = true; }}
        onTouchEnd={() => (isDrawing.current = false)}
        onTouchMove={scratch}
      />
    </div>
  );
};
