import { useMemo } from "react";

/**
 * The largest, most prominent element on the page.
 * Giant streak number with pulsing glow when active,
 * broken/red shake state when streak is 0.
 */
export default function StreakCounter({ streak }) {
  const isActive = streak > 0;

  const glowStyle = useMemo(() => {
    if (!isActive) return {};
    const intensity = Math.min(streak * 2, 40);
    return {
      textShadow: `0 0 ${intensity}px rgba(34, 197, 94, 0.6), 0 0 ${intensity * 2}px rgba(34, 197, 94, 0.3)`,
    };
  }, [streak, isActive]);

  return (
    <div className="flex flex-col items-center justify-center py-8 md:py-12">
      <div
        className={`
          font-mono font-black leading-none tracking-tighter
          text-[8rem] md:text-[12rem] lg:text-[14rem]
          transition-all duration-500
          ${isActive
            ? "text-green-400 animate-pulse-subtle"
            : "text-red-500 animate-shake"
          }
        `}
        style={glowStyle}
      >
        {streak}
      </div>
      <div
        className={`
          mt-2 text-sm md:text-base font-mono uppercase tracking-[0.4em]
          ${isActive ? "text-green-400/60" : "text-red-500/60"}
        `}
      >
        {isActive ? "Day Streak" : "Streak Broken"}
      </div>
    </div>
  );
}
