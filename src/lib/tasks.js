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
  0: { label: "Rest Day", icon: "💤", autoComplete: true, exercises: [] },
  1: { 
    label: "Chest Day", icon: "🏋️", autoComplete: false, 
    exercises: [
      { id: "chest-bench", label: "Flat Bench Press (3x10)" },
      { id: "chest-incline", label: "Incline DB Press (3x10)" },
      { id: "chest-dips", label: "Chest Dips (3x10)" },
      { id: "chest-cable", label: "Cable Crossovers (3x15)" }
    ] 
  },
  2: { 
    label: "Back Day", icon: "🏋️", autoComplete: false, 
    exercises: [
      { id: "back-deadlift", label: "Deadlifts (3x5)" },
      { id: "back-pullup", label: "Pull-ups (3xMax)" },
      { id: "back-row", label: "Barbell Rows (3x10)" },
      { id: "back-lat", label: "Lat Pulldowns (3x12)" }
    ] 
  },
  3: { 
    label: "Leg Day", icon: "🦵", autoComplete: false, 
    exercises: [
      { id: "leg-squat", label: "Barbell Squats (3x8)" },
      { id: "leg-press", label: "Leg Press (3x12)" },
      { id: "leg-rdl", label: "Romanian Deadlifts (3x10)" },
      { id: "leg-calf", label: "Calf Raises (4x15)" }
    ] 
  },
  4: { 
    label: "Shoulder Day", icon: "💪", autoComplete: false, 
    exercises: [
      { id: "shoulder-press", label: "Overhead Press (3x8)" },
      { id: "shoulder-lateral", label: "Lateral Raises (3x15)" },
      { id: "shoulder-facepull", label: "Face Pulls (3x12)" },
      { id: "shoulder-front", label: "Front Raises (3x12)" }
    ] 
  },
  5: { 
    label: "Arms Day", icon: "💪", autoComplete: false, 
    exercises: [
      { id: "arm-bicep", label: "Barbell Bicep Curls (3x10)" },
      { id: "arm-tricep", label: "Tricep Pushdowns (3x12)" },
      { id: "arm-hammer", label: "Hammer Curls (3x12)" },
      { id: "arm-skull", label: "Skull Crushers (3x10)" }
    ] 
  },
  6: { 
    label: "Core / Recovery", icon: "🧘", autoComplete: false, 
    exercises: [
      { id: "core-plank", label: "Planks (3x1 min)" },
      { id: "core-twist", label: "Russian Twists (3x20)" },
      { id: "core-legraise", label: "Hanging Leg Raises (3x15)" },
      { id: "core-foamroll", label: "Foam Rolling (10 min)" }
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
