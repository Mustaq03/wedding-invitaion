
import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
  themeColor: string;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate, themeColor }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number}>({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      // Robust ISO parsing
      let dateString = targetDate;
      if (!dateString.includes('T')) {
        dateString = dateString + 'T00:00:00';
      }
      
      const target = new Date(dateString).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (isNaN(target) || distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsFinished(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
      setIsFinished(false);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const Item = ({ val, label }: { val: number, label: string }) => (
    <div className="flex flex-col items-center min-w-[70px] sm:min-w-[95px] bg-white p-3 sm:p-5 rounded-3xl border border-[#d4af37]/40 shadow-xl">
      <span className="text-3xl sm:text-5xl font-serif font-black text-black leading-none block mb-1">
        {val.toString().padStart(2, '0')}
      </span>
      <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-black">{label}</span>
    </div>
  );

  if (isFinished) {
    return (
      <div className="text-center py-6">
        <p className="font-cursive text-3xl sm:text-4xl text-[#d4af37] font-bold">The blessed day has arrived!</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-4 flex-wrap px-2">
      <Item val={timeLeft.days} label="Days" />
      <Item val={timeLeft.hours} label="Hours" />
      <Item val={timeLeft.minutes} label="Mins" />
      <Item val={timeLeft.seconds} label="Secs" />
    </div>
  );
};
