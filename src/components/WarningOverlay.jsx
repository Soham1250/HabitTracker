import { useState, useEffect } from "react";

/**
 * After 9:00 PM, if tasks remain incomplete, this component:
 * - Applies a red vignette/border glow to the page
 * - Shows a warning banner
 * - Intensity increases as midnight approaches
 */
export default function WarningOverlay({ isAllComplete }) {
  const [warningLevel, setWarningLevel] = useState(0);

  useEffect(() => {
    function check() {
      const now = new Date();
      const hour = now.getHours();

      if (isAllComplete || hour < 21) {
        setWarningLevel(0);
        return;
      }

      // 21:00 = level 1 (subtle), scales up to midnight
      // 21-22 = 0.2, 22-23 = 0.5, 23-24 = 0.8-1.0
      if (hour >= 23) {
        const min = now.getMinutes();
        setWarningLevel(0.8 + (min / 60) * 0.2);
      } else if (hour >= 22) {
        setWarningLevel(0.5);
      } else {
        setWarningLevel(0.2);
      }
    }

    check();
    const interval = setInterval(check, 10000); // check every 10 seconds
    return () => clearInterval(interval);
  }, [isAllComplete]);

  if (warningLevel === 0) return null;

  return (
    <>
      {/* Vignette overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(239, 68, 68, ${warningLevel * 0.15}) 100%)`,
        }}
      />

      {/* Top border glow */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50 transition-opacity duration-1000"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(239, 68, 68, ${warningLevel * 0.8}), transparent)`,
          opacity: warningLevel,
        }}
      />

      {/* Warning banner */}
      <div
        className={`
          fixed top-4 left-1/2 -translate-x-1/2 z-50
          px-5 py-2.5 rounded-xl
          font-mono text-xs md:text-sm uppercase tracking-wider
          text-red-400 bg-red-500/10 border border-red-500/20
          backdrop-blur-sm
          transition-all duration-500
          ${warningLevel > 0.5 ? "animate-pulse" : ""}
        `}
      >
        ⚠ Tasks Remaining — Streak at Risk
      </div>
    </>
  );
}
