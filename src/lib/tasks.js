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
  0: { 
    label: "Rest Day", icon: "💤", autoComplete: true, exercises: [] 
  },
  1: { 
    label: "Chest Day", icon: "🏋️", autoComplete: false, 
    exercises: [
      { id: "chest-incline", label: "Incline DB Press (4x8-10)" },
      { id: "chest-flat", label: "Flat Machine/BB Press (3x8-10)" },
      { id: "chest-cable", label: "High-to-Low Cable Crossovers (3x10-12)" },
      { id: "chest-dips", label: "Weighted Dips (3xFailure)" }
    ] 
  },
  2: { 
    label: "Shoulder Day", icon: "💪", autoComplete: false, 
    exercises: [
      { id: "shoulder-press", label: "Seated DB Overhead Press (4x8-10)" },
      { id: "shoulder-lateral", label: "DB/Cable Lateral Raises (4x12-15)" },
      { id: "shoulder-facepull", label: "Cable Face Pulls (4x15)" },
      { id: "shoulder-shrug", label: "DB Shrugs (3x10-12)" }
    ] 
  },
  3: { 
    label: "Back Day", icon: "🏋️", autoComplete: false, 
    exercises: [
      { id: "back-latpulldown", label: "Wide-Grip Lat Pulldowns (4x8-10)" },
      { id: "back-row", label: "BB Bent-Over Rows (4x8-10)" },
      { id: "back-cablerow", label: "Seated Cable Rows (3x10-12)" },
      { id: "back-straightarm", label: "Straight-Arm Pulldowns (3x12-15)" }
    ] 
  },
  4: { 
    label: "Arms Day", icon: "💪", autoComplete: false, 
    exercises: [
      { id: "arm-tricepext", label: "Overhead Cable Tricep Ext (4x10-12)" },
      { id: "arm-bicep", label: "BB/EZ-Bar Bicep Curls (4x8-10)" },
      { id: "arm-pushdown", label: "Triceps Rope Pushdowns (3x10-12)" },
      { id: "arm-hammer", label: "DB Hammer Curls (3x10-12)" }
    ] 
  },
  5: { 
    label: "Leg Day", icon: "🦵", autoComplete: false, 
    exercises: [
      { id: "leg-squat", label: "BB Squats / Heavy Leg Press (4x8-10)" },
      { id: "leg-rdl", label: "Romanian Deadlifts (4x8-10)" },
      { id: "leg-ext", label: "Leg Extensions (3x12-15)" },
      { id: "leg-calf", label: "Standing Calf Raises (4x15-20)" }
    ] 
  },
  6: { 
    label: "Core / Recovery", icon: "🧘", autoComplete: false, 
    exercises: [
      { id: "core-legraise", label: "Hanging Leg Raises (4x10-15)" },
      { id: "core-crunch", label: "Weighted Cable Crunches (3x12-15)" },
      { id: "core-plank", label: "Plank (3x60s)" },
      { id: "core-cardio", label: "Zone 2 Cardio (15-20 min)" }
    ] 
  },
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
