import { MILESTONES } from "../lib/tasks";

/**
 * Milestone badges for 7, 21, 50, and 100 day streaks.
 * Earned badges glow, unearned are dimmed silhouettes.
 */
export default function MilestoneBadges({ earnedMilestones, currentStreak }) {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-6 py-4">
      {MILESTONES.map((milestone) => {
        const isEarned = earnedMilestones.includes(milestone.days);
        const isNext =
          !isEarned &&
          currentStreak < milestone.days &&
          MILESTONES.findIndex(
            (m) => m.days > currentStreak && !earnedMilestones.includes(m.days)
          ) === MILESTONES.indexOf(milestone);

        return (
          <div
            key={milestone.days}
            className={`
              relative flex flex-col items-center gap-1.5 p-3 rounded-xl
              transition-all duration-500
              ${isEarned
                ? "scale-100"
                : "scale-90 opacity-40"
              }
              ${isEarned ? "animate-fade-in" : ""}
            `}
          >
            {/* Badge icon */}
            <div
              className={`
                text-3xl md:text-4xl transition-all duration-300
                ${isEarned ? "grayscale-0" : "grayscale"}
              `}
              style={
                isEarned
                  ? {
                      filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))",
                    }
                  : {}
              }
            >
              {milestone.icon}
            </div>

            {/* Label */}
            <span
              className={`
                text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider
                ${isEarned ? "text-green-400" : "text-slate-600"}
              `}
            >
              {milestone.label}
            </span>

            {/* Day count */}
            <span
              className={`
                text-[10px] font-mono
                ${isEarned ? "text-green-400/60" : "text-slate-700"}
              `}
            >
              {milestone.days}d
            </span>

            {/* Progress hint for next milestone */}
            {isNext && currentStreak > 0 && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full">
                <div className="h-0.5 bg-white/5 rounded-full mx-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500/60 rounded-full transition-all duration-500"
                    style={{
                      width: `${(currentStreak / milestone.days) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
