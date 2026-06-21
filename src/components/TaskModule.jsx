/**
 * Renders a task module (Morning Vanguard / Evening Pivot) with checkboxes.
 * Supports nested sub-tasks: tasks with `subtasks` arrays render as
 * non-interactive parents with indented, checkable sub-task rows.
 * For quant/reasoning, section labels ("Foundation Level" / "Moderate Level")
 * are shown before each group of 10.
 */
export default function TaskModule({ module, tasks, onToggle }) {
  // Count only leaf-level completed tasks
  const getLeafCount = () => {
    let completed = 0;
    let total = 0;
    module.tasks.forEach((task) => {
      if (task.subtasks && task.subtasks.length > 0) {
        task.subtasks.forEach((sub) => {
          total++;
          if (tasks[sub.id]) completed++;
        });
      } else {
        total++;
        if (tasks[task.id]) completed++;
      }
    });
    return { completed, total };
  };

  const { completed: completedCount, total } = getLeafCount();
  const progressPercent = total > 0 ? (completedCount / total) * 100 : 0;

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
          if (task.subtasks && task.subtasks.length > 0) {
            return (
              <ParentTask
                key={task.id}
                task={task}
                tasks={tasks}
                onToggle={onToggle}
              />
            );
          }
          return (
            <LeafTask
              key={task.id}
              task={task}
              isChecked={!!tasks[task.id]}
              onToggle={onToggle}
            />
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

/**
 * A simple leaf task — directly checkable.
 */
function LeafTask({ task, isChecked, onToggle }) {
  return (
    <label
      className={`
        flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer
        transition-all duration-200 group
        ${isChecked ? "bg-green-500/8" : "hover:bg-white/3"}
      `}
    >
      <Checkbox isChecked={isChecked} />
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => onToggle(task.id)}
        className="absolute opacity-0 w-0 h-0"
      />
      <span
        className={`
          font-mono text-sm transition-all duration-200
          ${isChecked ? "text-green-400/70 line-through" : "text-slate-300"}
        `}
      >
        {task.label}
      </span>
    </label>
  );
}

/**
 * A parent task with sub-tasks. The parent is non-interactive;
 * it auto-completes when all sub-tasks are checked.
 */
function ParentTask({ task, tasks, onToggle }) {
  const allDone = task.subtasks.every((s) => tasks[s.id]);
  const doneCount = task.subtasks.filter((s) => tasks[s.id]).length;

  // Determine if this task uses Foundation/Moderate split
  const hasSplit =
    task.subtasks.length === 20 &&
    task.subtasks.some((s) => s.id.includes("-f")) &&
    task.subtasks.some((s) => s.id.includes("-m"));

  const foundationSubs = hasSplit
    ? task.subtasks.filter((s) => s.id.includes("-f"))
    : [];
  const moderateSubs = hasSplit
    ? task.subtasks.filter((s) => s.id.includes("-m"))
    : [];

  return (
    <div className="rounded-xl overflow-hidden">
      {/* Parent row — non-interactive */}
      <div
        className={`
          flex items-center gap-3 py-2.5 px-3 rounded-xl
          transition-all duration-200
          ${allDone ? "bg-green-500/8" : ""}
        `}
      >
        <StatusIndicator isDone={allDone} />
        <span
          className={`
            font-mono text-sm font-medium transition-all duration-200
            ${allDone ? "text-green-400/70 line-through" : "text-slate-300"}
          `}
        >
          {task.label}
        </span>
        <span className="text-xs font-mono text-slate-600 ml-auto">
          {doneCount}/{task.subtasks.length}
        </span>
      </div>

      {/* Sub-tasks — indented with left border */}
      <div className="mt-1 ml-2 space-y-0.5 border-l-2 border-white/5 pl-4">
        {hasSplit ? (
          <>
            <SectionLabel label="Foundation Level" color="amber" />
            {foundationSubs.map((sub) => (
              <SubTask
                key={sub.id}
                sub={sub}
                isChecked={!!tasks[sub.id]}
                onToggle={onToggle}
              />
            ))}
            <SectionLabel label="Moderate Level" color="cyan" />
            {moderateSubs.map((sub) => (
              <SubTask
                key={sub.id}
                sub={sub}
                isChecked={!!tasks[sub.id]}
                onToggle={onToggle}
              />
            ))}
          </>
        ) : (
          task.subtasks.map((sub) => (
            <SubTask
              key={sub.id}
              sub={sub}
              isChecked={!!tasks[sub.id]}
              onToggle={onToggle}
            />
          ))
        )}
      </div>
    </div>
  );
}

/**
 * Individual sub-task checkbox — smaller styling.
 */
function SubTask({ sub, isChecked, onToggle }) {
  return (
    <label className="flex items-center gap-3 py-1 cursor-pointer group">
      <div
        className={`
          relative w-4 h-4 rounded border flex items-center justify-center
          transition-all duration-200 shrink-0
          ${
            isChecked
              ? "bg-green-500/80 border-green-500/80"
              : "border-slate-600 group-hover:border-slate-400"
          }
        `}
      >
        {isChecked && (
          <svg
            className="w-2.5 h-2.5 text-white animate-check-in"
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
          onChange={() => onToggle(sub.id)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      <span
        className={`
          font-mono text-xs transition-all duration-200
          ${isChecked ? "text-slate-500 line-through" : "text-slate-400"}
        `}
      >
        {sub.label}
      </span>
    </label>
  );
}

/**
 * Section label for Foundation / Moderate split.
 */
function SectionLabel({ label, color }) {
  const colorClass =
    color === "amber" ? "text-amber-500/70" : "text-cyan-500/70";
  return (
    <p
      className={`text-[10px] font-mono uppercase tracking-widest mt-2 mb-1 ${colorClass}`}
    >
      {label}
    </p>
  );
}

/**
 * Non-interactive status indicator for parent tasks.
 * Shows dashed border when incomplete, solid green when done.
 */
function StatusIndicator({ isDone }) {
  return (
    <div
      className={`
        w-5 h-5 rounded-md flex items-center justify-center shrink-0
        transition-all duration-200
        ${
          isDone
            ? "bg-green-500 border-2 border-green-500 scale-110"
            : "border-2 border-dashed border-slate-600"
        }
      `}
    >
      {isDone && (
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
  );
}

/**
 * Interactive checkbox for leaf tasks.
 */
function Checkbox({ isChecked }) {
  return (
    <div
      className={`
        relative w-5 h-5 rounded-md border-2 flex items-center justify-center
        transition-all duration-200 shrink-0
        ${
          isChecked
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
    </div>
  );
}
