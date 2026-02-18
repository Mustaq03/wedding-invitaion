
import React, { useRef, useEffect, useState } from 'react';

interface MultiStageScratchProps {
  onComplete: () => void;
  content: React.ReactNode;
  themeColor: string;
}

export const MultiStageScratch: React.FC<MultiStageScratchProps> = ({ onComplete, content, themeColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);

  const initCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.globalCompositeOperation = 'source-over';
    
    // Premium Gold Foil Surface
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#d4af37');
    grad.addColorStop(0.3, '#f7e4a3');
    grad.addColorStop(0.5, '#ffffff');
    grad.addColorStop(0.7, '#f7e4a3');
    grad.addColorStop(1, '#c09a2d');
    ctx.fillStyle = grad;
    
    ctx.fillRect(0, 0, width, height);

    // Decorative sparkles on the surface
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for(let i=0; i<500; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, width-16, height-16);

    ctx.font = 'bold 13px "Playfair Display", serif';
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.fillText('SCRATCH TO DISCOVER', width/2, height/2 + 70);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    initCanvas(ctx, canvas.width, canvas.height);
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
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const { x, y } = getPosition(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2); 
    ctx.fill();

    checkRevealStatus(ctx, canvas.width, canvas.height);
  };

  const checkRevealStatus = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
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
    <div className={`relative w-80 h-80 rounded-[4rem] overflow-hidden transition-all duration-1000 border-8 border-white flex items-center justify-center bg-white ${isRevealed ? 'shadow-2xl z-20' : 'shadow-[0_40px_80px_-20px_rgba(212,175,55,0.4)]'}`}>
      <div 
        className={`absolute inset-0 flex items-center justify-center p-8 transition-all duration-1000 rounded-[3.5rem] ${isRevealed ? 'revealed-glow animate-reveal-pop' : 'opacity-90 scale-100'}`}
      >
        <div className="text-black transform-gpu">
          {content}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className={`absolute inset-0 cursor-crosshair touch-none transition-opacity duration-1000 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onMouseDown={() => (isDrawing.current = true)}
        onMouseUp={() => (isDrawing.current = false)}
        onMouseLeave={() => (isDrawing.current = false)}
        onMouseMove={scratch}
        onTouchStart={(e) => { isDrawing.current = true; }}
        onTouchEnd={() => (isDrawing.current = false)}
        onTouchMove={scratch}
      />
      
      {!isRevealed && (
        <div className="absolute bottom-12 left-0 right-0 pointer-events-none flex flex-col items-center">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black/50 drop-shadow-lg">
             Reveal your invitation
           </p>
        </div>
      )}
    </div>
  );
};
