import { useState, useEffect } from "react";

/**
 * Countdown timer to midnight.
 * Color transitions from green → amber → red → pulsing red.
 * Shows "SECURED" when all tasks are complete.
 */
export default function DeathClock({ isAllComplete }) {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isAllComplete) {
    return (
      <div className="flex items-center justify-center gap-3 py-4">
        <div className="text-green-400 text-3xl">✓</div>
        <div className="font-mono text-lg md:text-xl text-green-400 uppercase tracking-widest">
          Secured
        </div>
      </div>
    );
  }

  const { hours, minutes, seconds, totalSeconds } = timeLeft;
  const colorClass = getColorClass(totalSeconds);
  const isPulsing = totalSeconds <= 900; // last 15 minutes

  return (
    <div className="flex flex-col items-center py-4">
      <div className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500 mb-2">
        Time Remaining
      </div>
      <div
        className={`
          font-mono text-3xl md:text-4xl font-bold tracking-wider
          transition-colors duration-1000
          ${colorClass}
          ${isPulsing ? "animate-pulse" : ""}
        `}
      >
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </div>
    </div>
  );
}

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
  };
}

function getColorClass(totalSeconds) {
  const oneHour = 3600;
  const threeHours = 3 * 3600;

  if (totalSeconds <= oneHour) return "text-red-500";
  if (totalSeconds <= threeHours) return "text-amber-400";
  return "text-green-400/70";
}

function pad(n) {
  return String(n).padStart(2, "0");
}
