/**
 * Static task definitions and workout schedule for the Habit Tracker.
 */

export const MODULES = [
  {
    id: "morning",
    title: "The Morning Vanguard",
    subtitle: "QRE Block",
    tasks: [
      { id: "quant", label: "30-45 min Quant" },
      { id: "editorial", label: "English Editorial" },
      { id: "di-set", label: "1 DI Set" },
      { id: "core-quants", label: "10 Core Quants" },
      { id: "puzzle", label: "1 3-Variable Puzzle" },
      { id: "reasoning", label: "10 Core Reasoning" },
    ],
  },
  {
    id: "evening",
    title: "The Evening Pivot",
    subtitle: "IT & GA Block",
    tasks: [
      { id: "spotlight", label: "Spotlight Magazine" },
      { id: "gate", label: "GATE CS Theory" },
      { id: "leetcode", label: "LeetCode POTD" },
    ],
  },
];

export const WORKOUT_SCHEDULE = {
  0: { label: "Rest Day", icon: "💤", autoComplete: true },
  1: { label: "Chest Day", icon: "🏋️", autoComplete: false },
  2: { label: "Back Day", icon: "🏋️", autoComplete: false },
  3: { label: "Leg Day", icon: "🦵", autoComplete: false },
  4: { label: "Shoulder Day", icon: "💪", autoComplete: false },
  5: { label: "Arms Day", icon: "💪", autoComplete: false },
  6: { label: "Core / Recovery", icon: "🧘", autoComplete: false },
};

export const MILESTONES = [
  { days: 7, label: "Ignition", icon: "🔥" },
  { days: 21, label: "Locked In", icon: "🔒" },
  { days: 50, label: "Unstoppable", icon: "⚡" },
  { days: 100, label: "Centurion", icon: "🏛️" },
];

/**
 * Returns all task IDs for a given day (including the workout task).
 */
export function getAllTaskIds(dayOfWeek) {
  const taskIds = [];
  MODULES.forEach((mod) => {
    mod.tasks.forEach((t) => taskIds.push(t.id));
  });
  taskIds.push("workout");
  return taskIds;
}

/**
 * Returns the total number of tasks for a given day.
 * Always 10: 6 (morning) + 3 (evening) + 1 (workout).
 */
export function getTotalTaskCount() {
  return 10;
}
