
import React, { useState, useEffect } from 'react';
import { WeddingData } from '../types';
import { Curtain } from './Curtain';
import { MultiStageScratch } from './MultiStageScratch';
import { Countdown } from './Countdown';
import confetti from 'canvas-confetti';

interface InvitationViewProps {
  data: WeddingData;
  isShared?: boolean;
}

export const InvitationView: React.FC<InvitationViewProps> = ({ data, isShared = false }) => {
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [nikahRevealed, setNikahRevealed] = useState(false);

  const triggerSparkles = () => {
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#d4af37', '#f7e4a3', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleNikahReveal = () => {
    setNikahRevealed(true);
    triggerSparkles();
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { dayName: 'Date', day: '??', month: 'Month', year: 'Year' };
    return {
      dayName: d.toLocaleDateString('en-US', { weekday: 'long' }),
      day: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'long' }),
      year: d.getFullYear()
    };
  };

  const nikahDateInfo = formatDate(data.nikahDate);
  const valimaDateInfo = formatDate(data.valimaDate);

  const getShareableUrl = () => {
    const json = JSON.stringify(data);
    const u8 = new TextEncoder().encode(json);
    const base64 = btoa(String.fromCharCode(...u8))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#view=${base64}`;
  };

  const shareInvitation = async () => {
    const url = getShareableUrl();
    const text = `Asalam-o-Alaikum! 🌹\n\nYou are cordially invited to the wedding of ${data.brideName} & ${data.groomName}.\n\nView our digital invitation here:\n${url}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Wedding: ${data.brideName} & ${data.groomName}`,
          text: text,
          url: url,
        });
      } catch (err) {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-[#fdfbf7] overflow-x-hidden islamic-bg pb-20">
      <Curtain isOpen={curtainOpen} onClick={() => setCurtainOpen(true)} themeColor={data.themeColor} />

      <div className={`w-full max-w-lg transition-all duration-1000 ${curtainOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-white/20 backdrop-blur-sm">
          <div className="mb-8 sway">
             <p className="font-arabic text-5xl mb-8 text-[#d4af37]">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
             <div className="w-20 h-20 border-2 border-[#d4af37] rounded-full flex items-center justify-center mx-auto rotate-45 shadow-lg">
               <span className="font-cursive text-4xl -rotate-45 font-bold" style={{ color: data.themeColor }}>&</span>
             </div>
          </div>
          <h1 className="text-6xl sm:text-7xl font-cursive mb-6 gold-shimmer font-bold leading-tight drop-shadow-sm">
            {data.brideName} & {data.groomName}
          </h1>
          <p className="font-serif text-xl text-black max-w-sm italic mb-10 leading-relaxed px-4 font-medium">
            {data.welcomeMessage}
          </p>
          <div className="mt-20 text-[10px] text-[#d4af37] font-bold uppercase tracking-[0.6em] animate-bounce">
            Scroll for the reveal
          </div>
        </section>

        {/* NIKAH SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-white/80 border-y border-[#d4af37]/20 relative shadow-inner">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent"></div>
          
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-[#d4af37] mb-4">The Nikah Ceremony</h2>
          <h3 className="text-4xl font-serif italic mb-12 text-black font-bold">Sacred Union</h3>
          
          <div className="relative mb-8 transform transition-transform hover:scale-105 duration-500">
             <MultiStageScratch 
                onComplete={handleNikahReveal}
                themeColor={data.themeColor}
                content={
                   <div className="flex flex-col items-center text-center">
                     <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] mb-2 font-bold">{nikahDateInfo.dayName}</span>
                     <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-serif font-black text-black">{nikahDateInfo.day}</span>
                        <span className="text-3xl font-serif text-gray-700 font-bold">{nikahDateInfo.month}</span>
                     </div>
                     <span className="text-2xl font-light tracking-tighter text-gray-500 mt-2">{nikahDateInfo.year}</span>
                   </div>
                }
             />
          </div>

          {/* GAZÉBO ILLUSTRATION - Placeholder avatar removed as requested */}
          <div className="mb-12 opacity-90 max-w-[280px]">
             <img 
               src="https://vpssqzdfjnyovqofymst.supabase.co/storage/v1/object/public/test//gazebo.png" 
               alt="Wedding Gazebo" 
               className="w-full h-auto drop-shadow-xl contrast-125 brightness-75"
             />
          </div>
          
          <div className={`transition-all duration-1000 ${nikahRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
             <div className="flex flex-col items-center">
                <p className="text-lg font-bold text-gray-800 mb-6">{data.nikahTime}</p>
                <h4 className="text-2xl font-serif font-black text-black mb-3">{data.nikahVenue}</h4>
                <p className="text-sm text-gray-600 mb-10 px-6 font-medium leading-relaxed italic">{data.nikahAddress}</p>
                <a 
                  href={data.nikahMapLink} target="_blank" rel="noreferrer"
                  className="flex items-center gap-4 bg-black text-[#d4af37] px-8 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-[#d4af37] hover:text-black transition-all shadow-xl"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  Open in Maps
                </a>
             </div>
          </div>
        </section>

        {/* VALIMA SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-[#fdfbf7] relative">
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-[#d4af37] mb-4">The Valima Reception</h2>
          <h3 className="text-4xl font-serif italic mb-12 text-black font-bold">A Feast of Celebration</h3>
          
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-[#d4af37]/20 border border-[#d4af37]/30 w-full mb-16 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full -mr-16 -mt-16"></div>
             <div className="flex flex-col items-center text-center relative z-10">
                <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] mb-2 font-black">{valimaDateInfo.dayName}</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-serif font-black text-black">{valimaDateInfo.day}</span>
                  <span className="text-3xl font-serif text-gray-700 font-bold">{valimaDateInfo.month}</span>
                </div>
                <span className="text-2xl font-light tracking-tighter text-gray-400 mt-2">{valimaDateInfo.year}</span>
                
                <div className="mt-8 pt-8 border-t border-gray-100 w-full space-y-4">
                  <p className="text-lg font-black text-black">{data.valimaTime}</p>
                  <p className="text-2xl font-serif italic text-gray-800 font-bold">{data.valimaVenue}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-medium leading-relaxed">{data.valimaAddress}</p>
                  <div className="pt-6">
                    <a 
                      href={data.valimaMapLink} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-3 bg-[#d4af37] text-black px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                    >
                      View Valima Location
                    </a>
                  </div>
                </div>
             </div>
          </div>

          {/* COUNTDOWN SECTION */}
          <div className="py-12 bg-white rounded-[3rem] border-2 border-[#d4af37]/20 px-6 w-full shadow-2xl">
            <h4 className="text-[10px] uppercase tracking-[0.6em] text-gray-400 mb-8 font-black">Counting down to our day</h4>
            <Countdown targetDate={data.nikahDate} themeColor={data.themeColor} />
          </div>
        </section>

        {/* FOOTER */}
        <section className="p-10 space-y-24 bg-white/60">
           <div className="text-center p-14 bg-stone-50 rounded-[4rem] border-2 border-dashed border-[#d4af37]/40 shadow-sm">
             <h3 className="text-xs font-black mb-8 uppercase tracking-[0.6em] text-[#d4af37]">Dress Code</h3>
             <p className="text-black font-serif italic text-2xl leading-relaxed font-bold">
               {data.dressCode}
             </p>
          </div>

          <footer className="text-center py-10">
             <div className="mb-12 sway">
               <p className="font-arabic text-6xl text-[#d4af37] drop-shadow-md">جزاك الله خيرا</p>
             </div>
             <p className="font-cursive text-6xl mb-8 gold-shimmer font-bold">With Prayers & Love,</p>
             <div className="flex flex-col gap-3">
                <p className="text-2xl font-serif text-black font-black">{data.brideName} & {data.groomName}</p>
                <p className="text-xs text-gray-500 uppercase tracking-[0.3em] mt-12 font-bold italic">Families of both the Bride & Groom</p>
             </div>
             
             <div className="mt-24">
                <button 
                  onClick={shareInvitation}
                  className="bg-[#25D366] text-white p-6 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all border-4 border-white flex items-center justify-center mx-auto"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </button>
                <p className="text-[10px] text-gray-500 mt-6 uppercase tracking-[0.4em] font-black">Share with Family & Friends</p>
             </div>
          </footer>
        </section>
      </div>
    </div>
  );
};
