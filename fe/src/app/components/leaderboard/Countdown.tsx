import { useState, useEffect } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const utcNow = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          now.getUTCHours(),
          now.getUTCMinutes(),
          now.getUTCSeconds()
        )
      );

      // Set target date to July 31st of current year
      const targetDate = new Date(
        Date.UTC(utcNow.getUTCFullYear(), 6, 31, 23, 59, 59)
      );

      // If we're past July 31st, set target to next year
      if (utcNow > targetDate) {
        targetDate.setUTCFullYear(targetDate.getUTCFullYear() + 1);
      }

      const difference = targetDate.getTime() - utcNow.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-4 px-4">
      <p className="text-white text-base md:text-xl font-lexend-giga uppercase text-center">
        Leaderboard will reset in
      </p>
      <div className="flex items-center justify-center gap-2 md:gap-4">
        <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
          <span className="text-[#FFAD00] text-xl md:text-3xl font-lexend-giga">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-white text-xs md:text-sm">Days</span>
        </div>
        <span className="text-[#FFAD00] text-xl md:text-3xl">:</span>
        <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
          <span className="text-[#FFAD00] text-xl md:text-3xl font-lexend-giga">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-white text-xs md:text-sm">Hours</span>
        </div>
        <span className="text-[#FFAD00] text-xl md:text-3xl">:</span>
        <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
          <span className="text-[#FFAD00] text-xl md:text-3xl font-lexend-giga">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-white text-xs md:text-sm">Minutes</span>
        </div>
        <span className="text-[#FFAD00] text-xl md:text-3xl">:</span>
        <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
          <span className="text-[#FFAD00] text-xl md:text-3xl font-lexend-giga">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-white text-xs md:text-sm">Seconds</span>
        </div>
      </div>
    </div>
  );
}
