/**
 * Special workout module that dynamically displays today's workout.
 * Sunday auto-completes as Rest Day.
 */
export default function WorkoutModule({ workout, tasks, isChecked, onToggle }) {
  const isAutoComplete = workout.autoComplete;
  const exercises = workout.exercises || [];
  const completedCount = exercises.filter((e) => tasks[e.id]).length;
  const totalCount = exercises.length;

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
            width: isAutoComplete ? "100%" : totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%",
            background: "linear-gradient(90deg, #22c55e, #4ade80)",
          }}
        />
      </div>

      {/* Workout task */}
      <label
        className={`
          flex items-center gap-3 py-2.5 px-3 rounded-xl
          transition-all duration-200 group
          ${isAutoComplete ? "cursor-default" : "cursor-pointer"}
          ${isChecked ? "bg-green-500/8" : "hover:bg-white/3"}
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
          {!isAutoComplete && (
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle("workout")}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          )}
        </div>

        {/* Label */}
        <div className="flex items-center gap-2">
          <span className="text-lg">{workout.icon}</span>
          <span
            className={`
              font-mono text-sm transition-all duration-200
              ${isChecked ? "text-green-400/70 line-through" : "text-slate-300"}
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
      </label>

      {/* Sub-exercises */}
      {!isAutoComplete && exercises.length > 0 && (
        <div className="mt-3 ml-2 space-y-2 border-l-2 border-white/5 pl-4">
          {exercises.map((exercise) => {
            const isExerciseChecked = !!tasks[exercise.id];
            return (
              <label
                key={exercise.id}
                className="flex items-center gap-3 py-1 cursor-pointer group"
              >
                <div
                  className={`
                    relative w-4 h-4 rounded border flex items-center justify-center
                    transition-all duration-200 shrink-0
                    ${isExerciseChecked
                      ? "bg-green-500/80 border-green-500/80"
                      : "border-slate-600 group-hover:border-slate-400"
                    }
                  `}
                >
                  {isExerciseChecked && (
                    <svg
                      className="w-2.5 h-2.5 text-white animate-check-in"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <input
                    type="checkbox"
                    checked={isExerciseChecked}
                    onChange={() => onToggle(exercise.id)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <span
                  className={`
                    font-mono text-xs transition-all duration-200
                    ${isExerciseChecked ? "text-slate-500 line-through" : "text-slate-400"}
                  `}
                >
                  {exercise.label}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {/* Status */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500">
          {isAutoComplete ? "1/1" : `${completedCount}/${totalCount}`}
        </span>
        {isChecked && (
          <span className="text-xs font-mono text-green-400 uppercase tracking-wider animate-fade-in">
            ✓ Complete
          </span>
        )}
      </div>
    </div>
  );
}
