/**
 * Renders a task module (Morning Vanguard / Evening Pivot) with checkboxes.
 * Each checked item gets a strike-through and scale animation.
 * Includes a progress bar showing module completion.
 */
export default function TaskModule({ module, tasks, onToggle }) {
  const completedCount = module.tasks.filter((t) => tasks[t.id]).length;
  const total = module.tasks.length;
  const progressPercent = (completedCount / total) * 100;

  return (
    <div className="bg-surface rounded-2xl border border-white/5 p-5 md:p-6 transition-all duration-300 hover:border-white/10">
      {/* Header */}
      <div className="mb-5">
        <h2 className="font-mono text-base md:text-lg font-bold text-slate-200 tracking-tight">
          {module.title}
        </h2>
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
          {module.subtitle}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/5 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progressPercent}%`,
            background:
              progressPercent === 100
                ? "linear-gradient(90deg, #22c55e, #4ade80)"
                : "linear-gradient(90deg, #3b82f6, #60a5fa)",
          }}
        />
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {module.tasks.map((task) => {
          const isChecked = !!tasks[task.id];
          return (
            <label
              key={task.id}
              className={`
                flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer
                transition-all duration-200 group
                ${isChecked
                  ? "bg-green-500/8"
                  : "hover:bg-white/3"
                }
              `}
            >
              {/* Custom checkbox */}
              <div
                className={`
                  relative w-5 h-5 rounded-md border-2 flex items-center justify-center
                  transition-all duration-200 shrink-0
                  ${isChecked
                    ? "bg-green-500 border-green-500 scale-110"
                    : "border-slate-600 group-hover:border-slate-400"
                  }
                `}
              >
                {isChecked && (
                  <svg
                    className="w-3 h-3 text-white animate-check-in"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(task.id)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {/* Label */}
              <span
                className={`
                  font-mono text-sm transition-all duration-200
                  ${isChecked
                    ? "text-green-400/70 line-through"
                    : "text-slate-300"
                  }
                `}
              >
                {task.label}
              </span>
            </label>
          );
        })}
      </div>

      {/* Completion badge */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500">
          {completedCount}/{total}
        </span>
        {completedCount === total && (
          <span className="text-xs font-mono text-green-400 uppercase tracking-wider animate-fade-in">
            ✓ Complete
          </span>
        )}
      </div>
    </div>
  );
}
