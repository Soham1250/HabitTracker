/**
 * Static task definitions and workout schedule for the Habit Tracker.
 *
 * Architecture:
 * - Tasks can optionally have `subtasks` arrays. If present, the task is a
 *   non-interactive parent that auto-completes when all subtasks are checked.
 * - Workout exercises have `sets` arrays. Each set is an individually checkable
 *   sub-task. The exercise auto-completes when all sets are done.
 * - Only leaf-level IDs (subtask IDs, set IDs, simple task IDs) count toward
 *   daily progress. Parent IDs are excluded from counting.
 */

// ── Helper to generate numbered sub-tasks ──────────────────────────────────
function generateNumberedSubtasks(prefix, label, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}${i + 1}`,
    label: `${label} Q${i + 1}`,
  }));
}

function generateSets(exerciseId, count, reps) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${exerciseId}-s${i + 1}`,
    label: `Set ${i + 1} (${reps})`,
  }));
}

// ── Module Definitions ─────────────────────────────────────────────────────

export const MODULES = [
  {
    id: "morning",
    title: "The Morning Vanguard",
    subtitle: "QRE Block",
    tasks: [
      { id: "editorial", label: "Read the Daily English Editorial" },
      {
        id: "di-set",
        label: "Solve 1 DI Set (Pre-decode Master Table in <2 min)",
      },
      {
        id: "quant-arithmetic",
        label: "Quant Arithmetic (Adda247 Daksh)",
        subtasks: [
          ...generateNumberedSubtasks("quant-f", "Foundation", 10),
          ...generateNumberedSubtasks("quant-m", "Moderate", 10),
        ],
      },
      {
        id: "puzzle-seating",
        label: "Puzzle/Seating Sets",
        subtasks: [
          { id: "puzzle-1", label: "Set 1" },
          { id: "puzzle-2", label: "Set 2" },
          { id: "puzzle-3", label: "Set 3" },
          { id: "puzzle-4", label: "Set 4" },
        ],
      },
      {
        id: "reasoning-sequential",
        label: "Reasoning Sequential (Current Phase)",
        subtasks: [
          ...generateNumberedSubtasks("reasoning-f", "Foundation", 10),
          ...generateNumberedSubtasks("reasoning-m", "Moderate", 10),
        ],
      },
    ],
  },
  {
    id: "evening",
    title: "The Evening Pivot",
    subtitle: "IT & GA Block",
    tasks: [
      { id: "spotlight", label: "Study/Revise Spotlight Magazine" },
      { id: "gate", label: "GATE CS Theory & MCQs (Active: DBMS)" },
      { id: "leetcode", label: "Solve LeetCode POTD" },
    ],
  },
];

// ── Workout Schedule (Per-Set Sub-tasks) ───────────────────────────────────

export const WORKOUT_SCHEDULE = {
  0: {
    label: "Rest Day",
    icon: "💤",
    autoComplete: true,
    exercises: [],
  },
  1: {
    label: "Chest Day",
    icon: "🏋️",
    autoComplete: false,
    exercises: [
      {
        id: "chest-incline",
        label: "Incline Dumbbell Press",
        sets: generateSets("chest-incline", 4, "8-10 reps"),
      },
      {
        id: "chest-flat",
        label: "Flat Machine/BB Press",
        sets: generateSets("chest-flat", 3, "8-10 reps"),
      },
      {
        id: "chest-cable",
        label: "High-to-Low Cable Crossovers",
        sets: generateSets("chest-cable", 3, "10-12 reps"),
      },
      {
        id: "chest-dips",
        label: "Weighted Dips",
        sets: generateSets("chest-dips", 3, "to failure"),
      },
    ],
  },
  2: {
    label: "Shoulder Day",
    icon: "💪",
    autoComplete: false,
    exercises: [
      {
        id: "shoulder-press",
        label: "Seated DB Overhead Press",
        sets: generateSets("shoulder-press", 4, "8-10 reps"),
      },
      {
        id: "shoulder-lateral",
        label: "DB Lateral Raises",
        sets: generateSets("shoulder-lateral", 4, "12-15 reps"),
      },
      {
        id: "shoulder-facepull",
        label: "Cable Face Pulls",
        sets: generateSets("shoulder-facepull", 4, "15 reps"),
      },
      {
        id: "shoulder-shrug",
        label: "DB Shrugs",
        sets: generateSets("shoulder-shrug", 3, "10-12 reps"),
      },
    ],
  },
  3: {
    label: "Back Day",
    icon: "🏋️",
    autoComplete: false,
    exercises: [
      {
        id: "back-latpulldown",
        label: "Wide-Grip Lat Pulldowns",
        sets: generateSets("back-latpulldown", 4, "8-10 reps"),
      },
      {
        id: "back-row",
        label: "BB Bent-Over Rows",
        sets: generateSets("back-row", 4, "8-10 reps"),
      },
      {
        id: "back-cablerow",
        label: "Seated Cable Rows",
        sets: generateSets("back-cablerow", 3, "10-12 reps"),
      },
      {
        id: "back-straightarm",
        label: "Straight-Arm Pulldowns",
        sets: generateSets("back-straightarm", 3, "12-15 reps"),
      },
    ],
  },
  4: {
    label: "Arms Day",
    icon: "💪",
    autoComplete: false,
    exercises: [
      {
        id: "arm-tricepext",
        label: "Overhead Cable Tricep Ext",
        sets: generateSets("arm-tricepext", 4, "10-12 reps"),
      },
      {
        id: "arm-bicep",
        label: "BB/EZ-Bar Bicep Curls",
        sets: generateSets("arm-bicep", 4, "8-10 reps"),
      },
      {
        id: "arm-pushdown",
        label: "Triceps Rope Pushdowns",
        sets: generateSets("arm-pushdown", 3, "10-12 reps"),
      },
      {
        id: "arm-hammer",
        label: "DB Hammer Curls",
        sets: generateSets("arm-hammer", 3, "10-12 reps"),
      },
    ],
  },
  5: {
    label: "Leg Day",
    icon: "🦵",
    autoComplete: false,
    exercises: [
      {
        id: "leg-squat",
        label: "BB Squats / Heavy Leg Press",
        sets: generateSets("leg-squat", 4, "8-10 reps"),
      },
      {
        id: "leg-rdl",
        label: "Romanian Deadlifts",
        sets: generateSets("leg-rdl", 4, "8-10 reps"),
      },
      {
        id: "leg-ext",
        label: "Leg Extensions",
        sets: generateSets("leg-ext", 3, "12-15 reps"),
      },
      {
        id: "leg-calf",
        label: "Standing Calf Raises",
        sets: generateSets("leg-calf", 4, "15-20 reps"),
      },
    ],
  },
  6: {
    label: "Core / Recovery",
    icon: "🧘",
    autoComplete: false,
    exercises: [
      {
        id: "core-legraise",
        label: "Hanging Leg Raises",
        sets: generateSets("core-legraise", 4, "10-15 reps"),
      },
      {
        id: "core-crunch",
        label: "Weighted Cable Crunches",
        sets: generateSets("core-crunch", 3, "12-15 reps"),
      },
      {
        id: "core-plank",
        label: "Plank",
        sets: generateSets("core-plank", 3, "60s"),
      },
      {
        id: "core-cardio",
        label: "Zone 2 Cardio",
        sets: [{ id: "core-cardio-s1", label: "15-20 min session" }],
      },
    ],
  },
};

export const MILESTONES = [
  { days: 7, label: "Ignition", icon: "🔥" },
  { days: 21, label: "Locked In", icon: "🔒" },
  { days: 50, label: "Unstoppable", icon: "⚡" },
  { days: 100, label: "Centurion", icon: "🏛️" },
];

/**
 * Returns all LEAF task IDs for a given day (only checkable items).
 * Parent IDs are excluded — only subtask IDs, set IDs, and simple task IDs.
 */
export function getAllTaskIds(dayOfWeek) {
  const taskIds = [];

  // Module tasks
  MODULES.forEach((mod) => {
    mod.tasks.forEach((task) => {
      if (task.subtasks && task.subtasks.length > 0) {
        // Parent with subtasks — collect subtask IDs only
        task.subtasks.forEach((sub) => taskIds.push(sub.id));
      } else {
        // Simple leaf task
        taskIds.push(task.id);
      }
    });
  });

  // Workout sets
  const workout = WORKOUT_SCHEDULE[dayOfWeek];
  if (workout && !workout.autoComplete) {
    workout.exercises.forEach((exercise) => {
      if (exercise.sets && exercise.sets.length > 0) {
        exercise.sets.forEach((set) => taskIds.push(set.id));
      }
    });
  }

  return taskIds;
}

/**
 * Returns the total number of leaf tasks for a given day.
 * This varies by day due to different workout set counts.
 */
export function getTotalTaskCount(dayOfWeek) {
  return getAllTaskIds(dayOfWeek).length;
}

/**
 * Builds a map of parent ID → child IDs for quick lookup during toggle.
 * Includes both module subtask parents and workout exercise parents.
 */
export function getParentChildMap(dayOfWeek) {
  const map = {};

  // Module task parents
  MODULES.forEach((mod) => {
    mod.tasks.forEach((task) => {
      if (task.subtasks && task.subtasks.length > 0) {
        map[task.id] = task.subtasks.map((s) => s.id);
      }
    });
  });

  // Workout exercise parents → set IDs
  const workout = WORKOUT_SCHEDULE[dayOfWeek];
  if (workout && !workout.autoComplete) {
    const allSetIds = [];
    workout.exercises.forEach((exercise) => {
      if (exercise.sets && exercise.sets.length > 0) {
        const setIds = exercise.sets.map((s) => s.id);
        map[exercise.id] = setIds;
        allSetIds.push(...setIds);
      }
    });
    // "workout" parent → all set IDs across all exercises
    map["workout"] = allSetIds;
  }

  return map;
}
