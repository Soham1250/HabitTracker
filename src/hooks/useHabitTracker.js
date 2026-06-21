import { useState, useEffect, useCallback, useRef } from "react";
import {
  loadState,
  saveState,
  checkMidnightReset,
  getTodayKey,
} from "../lib/storage";
import {
  getAllTaskIds,
  getTotalTaskCount,
  WORKOUT_SCHEDULE,
  MILESTONES,
  getParentChildMap,
  MODULES,
} from "../lib/tasks";

/**
 * Core custom hook that manages all habit tracker state.
 * Loads from MongoDB on mount, syncs changes back to MongoDB + localStorage.
 *
 * Sub-task architecture:
 * - Only leaf tasks (subtasks, sets, simple tasks) are directly toggleable.
 * - Parent tasks auto-complete when all their children are checked.
 * - Daily progress counts only leaf-level completions.
 */
export function useHabitTracker() {
  const [state, setState] = useState({
    streakCount: 0,
    lastCompletedDate: null,
    history: {},
    milestones: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  const today = getTodayKey();
  const dayOfWeek = new Date().getDay();
  const todayData = state.history[today] || { tasks: {}, allCompleted: false };
  const workout = WORKOUT_SCHEDULE[dayOfWeek];

  // Load state from MongoDB on mount
  useEffect(() => {
    async function init() {
      try {
        const loaded = await loadState();
        const checked = checkMidnightReset(loaded);
        setState(checked);
        // Save back if reset happened
        if (checked.streakCount !== loaded.streakCount) {
          await saveState(checked);
        }
      } catch (err) {
        console.error("Failed to load state:", err);
      } finally {
        setIsLoading(false);
        isInitialized.current = true;
      }
    }
    init();
  }, []);

  // Auto-complete Sunday rest day after state is loaded
  useEffect(() => {
    if (!isLoading && workout.autoComplete && !todayData.tasks["workout"]) {
      // For rest day, just mark workout as complete directly
      setState((prev) => {
        const todayKey = getTodayKey();
        const prevToday = prev.history[todayKey] || {
          tasks: {},
          allCompleted: false,
        };
        const newTasks = { ...prevToday.tasks, workout: true };

        const allIds = getAllTaskIds(new Date().getDay());
        const completedCount = allIds.filter((id) => newTasks[id]).length;
        const total = getTotalTaskCount(new Date().getDay());
        const allCompleted = completedCount >= total;

        let newStreak = prev.streakCount;
        let newLastCompleted = prev.lastCompletedDate;
        let newMilestones = [...prev.milestones];

        if (allCompleted && !prevToday.allCompleted) {
          newStreak = prev.streakCount + 1;
          newLastCompleted = todayKey;
          MILESTONES.forEach((m) => {
            if (newStreak >= m.days && !newMilestones.includes(m.days)) {
              newMilestones.push(m.days);
            }
          });
        }

        return {
          ...prev,
          streakCount: newStreak,
          lastCompletedDate: newLastCompleted,
          milestones: newMilestones,
          history: {
            ...prev.history,
            [todayKey]: {
              tasks: newTasks,
              allCompleted,
              completedAt: allCompleted ? new Date().toISOString() : null,
            },
          },
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // Persist to MongoDB + localStorage on every state change (after init)
  useEffect(() => {
    if (!isInitialized.current) return;
    saveState(state);
  }, [state]);

  // Check for midnight rollover every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentToday = getTodayKey();
      if (currentToday !== today) {
        window.location.reload();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [today]);

  /**
   * Toggles a leaf task's completion status for today.
   * After toggling, propagates upward to auto-complete parents.
   */
  const toggleTask = useCallback(
    (taskId) => {
      setState((prev) => {
        const todayKey = getTodayKey();
        const prevToday = prev.history[todayKey] || {
          tasks: {},
          allCompleted: false,
        };
        const newTasks = { ...prevToday.tasks };
        newTasks[taskId] = !newTasks[taskId];

        const currentDayOfWeek = new Date().getDay();
        const parentChildMap = getParentChildMap(currentDayOfWeek);

        // Propagate upward: check if any parent should auto-complete
        // For module tasks: subtask → parent task
        MODULES.forEach((mod) => {
          mod.tasks.forEach((task) => {
            if (task.subtasks && task.subtasks.length > 0) {
              const subtaskIds = task.subtasks.map((s) => s.id);
              if (subtaskIds.includes(taskId)) {
                newTasks[task.id] = subtaskIds.every((id) => newTasks[id]);
              }
            }
          });
        });

        // For workout: set → exercise → workout
        const workoutData = WORKOUT_SCHEDULE[currentDayOfWeek];
        if (workoutData && !workoutData.autoComplete) {
          const allExercisesDone = [];

          workoutData.exercises.forEach((exercise) => {
            const setIds = exercise.sets?.map((s) => s.id) || [];
            if (setIds.includes(taskId) || setIds.some((id) => id === taskId)) {
              // A set was toggled — check if all sets in this exercise are done
              newTasks[exercise.id] = setIds.every((id) => newTasks[id]);
            }
            allExercisesDone.push(
              setIds.length > 0 && setIds.every((id) => newTasks[id])
            );
          });

          // Check if all exercises (= all sets) are done
          newTasks["workout"] = allExercisesDone.every(Boolean);
        }

        // Count leaf completions
        const allIds = getAllTaskIds(currentDayOfWeek);
        const completedCount = allIds.filter((id) => newTasks[id]).length;
        const total = getTotalTaskCount(currentDayOfWeek);
        const allCompleted = completedCount >= total;

        let newStreak = prev.streakCount;
        let newLastCompleted = prev.lastCompletedDate;
        let newMilestones = [...prev.milestones];

        if (allCompleted && !prevToday.allCompleted) {
          newStreak = prev.streakCount + 1;
          newLastCompleted = todayKey;
          MILESTONES.forEach((m) => {
            if (newStreak >= m.days && !newMilestones.includes(m.days)) {
              newMilestones.push(m.days);
            }
          });
        } else if (!allCompleted && prevToday.allCompleted) {
          newStreak = Math.max(0, prev.streakCount - 1);
          if (newStreak === 0) newLastCompleted = null;
        }

        return {
          ...prev,
          streakCount: newStreak,
          lastCompletedDate: newLastCompleted,
          milestones: newMilestones,
          history: {
            ...prev.history,
            [todayKey]: {
              tasks: newTasks,
              allCompleted,
              completedAt: allCompleted ? new Date().toISOString() : null,
            },
          },
        };
      });
    },
    []
  );

  const getCompletionCount = useCallback(() => {
    const allIds = getAllTaskIds(dayOfWeek);
    return allIds.filter((id) => todayData.tasks[id]).length;
  }, [todayData.tasks, dayOfWeek]);

  const replaceState = useCallback((newState) => {
    const checked = checkMidnightReset(newState);
    setState(checked);
    saveState(checked);
  }, []);

  return {
    state,
    today,
    dayOfWeek,
    todayData,
    workout,
    toggleTask,
    getCompletionCount,
    isAllComplete: todayData.allCompleted,
    isLoading,
    replaceState,
  };
}
