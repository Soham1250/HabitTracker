import { getTotalSequentialTopics } from "../lib/syllabus";

export default function SyllabusProgress({ completedChapters }) {
  const totalTopics = getTotalSequentialTopics();
  const completedCount = completedChapters.length;
  const remainingCount = totalTopics - completedCount;
  
  const percentage = totalTopics === 0 ? 0 : Math.round((completedCount / totalTopics) * 100);

  // SVG Pie Chart calculations (Radius 15.91549431 gives circumference of 100)
  const radius = 15.91549431;
  const strokeDasharray = `${percentage} ${100 - percentage}`;

  return (
    <div className="bg-surface-elevated rounded-xl border border-white/5 p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider">
          Syllabus Mastery
        </h2>
        <span className="text-xs font-mono text-amber-500">
          {completedCount} / {totalTopics} Mastered
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Pie Chart */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-lg">
              {/* Background circle */}
              <path
                className="text-white/5"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              {/* Progress circle */}
              <path
                className="text-amber-500 transition-all duration-1000 ease-out"
                strokeDasharray={strokeDasharray}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-mono text-white">{percentage}%</span>
            </div>
          </div>
        </div>

        {/* Completion Log */}
        <div className="h-32 overflow-y-auto pr-2 custom-scrollbar">
          {completedChapters.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs font-mono text-slate-600 text-center">
              No chapters mastered yet.<br/>Hold the line.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {completedChapters.map((chapter) => {
                const d = new Date(chapter.completedAt);
                const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                return (
                  <div key={chapter.chapterId} className="flex items-start gap-3 p-2 rounded-lg bg-surface/50 border border-white/5 animate-fade-in">
                    <div className="mt-0.5 text-amber-500">✔</div>
                    <div>
                      <div className="text-sm text-slate-300">{chapter.title}</div>
                      <div className="text-[10px] font-mono text-slate-500 tracking-wider uppercase mt-1">
                        {dateStr}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
