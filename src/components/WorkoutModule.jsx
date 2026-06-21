/**
 * Workout module with per-set checkboxes.
 * Each exercise is a non-interactive group header.
 * Each set is an individually checkable sub-task.
 * The workout parent auto-completes when all sets across all exercises are done.
 * Sunday auto-completes as Rest Day.
 */
export default function WorkoutModule({ workout, tasks, isChecked, onToggle }) {
  const isAutoComplete = workout.autoComplete;
  const exercises = workout.exercises || [];

  // Count total sets and completed sets
  const totalSets = exercises.reduce(
    (sum, ex) => sum + (ex.sets?.length || 0),
    0
  );
  const completedSets = exercises.reduce(
    (sum, ex) =>
      sum + (ex.sets?.filter((s) => tasks[s.id]).length || 0),
    0
  );

  return (
    <div className="bg-surface rounded-2xl border border-white/5 p-5 md:p-6 transition-all duration-300 hover:border-white/10">
      {/* Header */}
      <div className="mb-5">
        <h2 className="font-mono text-base md:text-lg font-bold text-slate-200 tracking-tight">
          The Physical Protocol
        </h2>
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
          Hypertrophy Split
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/5 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: isAutoComplete
              ? "100%"
              : totalSets > 0
                ? `${(completedSets / totalSets) * 100}%`
                : "0%",
            background:
              isAutoComplete || completedSets === totalSets
                ? "linear-gradient(90deg, #22c55e, #4ade80)"
                : "linear-gradient(90deg, #3b82f6, #60a5fa)",
          }}
        />
      </div>

      {/* Workout parent row — non-interactive status indicator */}
      <div
        className={`
          flex items-center gap-3 py-2.5 px-3 rounded-xl
          transition-all duration-200
          ${isChecked ? "bg-green-500/8" : ""}
        `}
      >
        {/* Status indicator (non-interactive) */}
        <div
          className={`
            w-5 h-5 rounded-md flex items-center justify-center shrink-0
            transition-all duration-200
            ${
              isChecked
                ? "bg-green-500 border-2 border-green-500 scale-110"
                : isAutoComplete
                  ? "bg-green-500 border-2 border-green-500 scale-110"
                  : "border-2 border-dashed border-slate-600"
            }
          `}
        >
          {(isChecked || isAutoComplete) && (
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
        </div>

        {/* Label */}
        <div className="flex items-center gap-2">
          <span className="text-lg">{workout.icon}</span>
          <span
            className={`
              font-mono text-sm font-medium transition-all duration-200
              ${isChecked || isAutoComplete ? "text-green-400/70 line-through" : "text-slate-300"}
            `}
          >
            {workout.label}
          </span>
          {isAutoComplete && (
            <span className="text-xs font-mono text-slate-500 ml-1">
              (Auto-completed)
            </span>
          )}
        </div>

        {!isAutoComplete && (
          <span className="text-xs font-mono text-slate-600 ml-auto">
            {completedSets}/{totalSets}
          </span>
        )}
      </div>

      {/* Exercise groups with per-set checkboxes */}
      {!isAutoComplete && exercises.length > 0 && (
        <div className="mt-3 ml-2 space-y-3 border-l-2 border-white/5 pl-4">
          {exercises.map((exercise) => {
            const sets = exercise.sets || [];
            const exerciseDone = sets.length > 0 && sets.every((s) => tasks[s.id]);
            const exerciseCompletedCount = sets.filter((s) => tasks[s.id]).length;

            return (
              <div key={exercise.id}>
                {/* Exercise header — non-interactive group label */}
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`
                      w-3.5 h-3.5 rounded flex items-center justify-center shrink-0
                      transition-all duration-200
                      ${
                        exerciseDone
                          ? "bg-green-500/60 border border-green-500/60"
                          : "border border-dashed border-slate-600"
                      }
                    `}
                  >
                    {exerciseDone && (
                      <svg
                        className="w-2 h-2 text-white"
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
                  </div>
                  <span
                    className={`
                      font-mono text-xs font-semibold transition-all duration-200
                      ${exerciseDone ? "text-green-400/60 line-through" : "text-slate-300"}
                    `}
                  >
                    {exercise.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-600 ml-auto">
                    {exerciseCompletedCount}/{sets.length}
                  </span>
                </div>

                {/* Set checkboxes */}
                <div className="ml-5 space-y-0.5">
                  {sets.map((set) => {
                    const isSetChecked = !!tasks[set.id];
                    return (
                      <label
                        key={set.id}
                        className="flex items-center gap-3 py-0.5 cursor-pointer group"
                      >
                        <div
                          className={`
                            relative w-3.5 h-3.5 rounded border flex items-center justify-center
                            transition-all duration-200 shrink-0
                            ${
                              isSetChecked
                                ? "bg-green-500/80 border-green-500/80"
                                : "border-slate-600 group-hover:border-slate-400"
                            }
                          `}
                        >
                          {isSetChecked && (
                            <svg
                              className="w-2 h-2 text-white animate-check-in"
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
                            checked={isSetChecked}
                            onChange={() => onToggle(set.id)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                        <span
                          className={`
                            font-mono text-[11px] transition-all duration-200
                            ${isSetChecked ? "text-slate-500 line-through" : "text-slate-400"}
                          `}
                        >
                          {set.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Status */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500">
          {isAutoComplete ? "Rest Day" : `${completedSets}/${totalSets} sets`}
        </span>
        {(isChecked || isAutoComplete) && (
          <span className="text-xs font-mono text-green-400 uppercase tracking-wider animate-fade-in">
            ✓ Complete
          </span>
        )}
      </div>
    </div>
  );
}
