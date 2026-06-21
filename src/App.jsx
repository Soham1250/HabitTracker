import { useEffect, useState } from "react";
import { useHabitTracker } from "./hooks/useHabitTracker";
import { MODULES, getTotalTaskCount } from "./lib/tasks";
import StreakCounter from "./components/StreakCounter";
import DeathClock from "./components/DeathClock";
import TaskModule from "./components/TaskModule";
import WorkoutModule from "./components/WorkoutModule";
import Heatmap from "./components/Heatmap";
import MilestoneBadges from "./components/MilestoneBadges";
import WarningOverlay from "./components/WarningOverlay";
import SettingsMenu from "./components/SettingsMenu";
import QuoteOfDay from "./components/QuoteOfDay";
import Login from "./components/Login";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("auth_token")
  );

  useEffect(() => {
    const handleUnauthorized = () => setIsAuthenticated(false);
    window.addEventListener("auth_unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth_unauthorized", handleUnauthorized);
  }, []);

  const {
    state,
    today,
    dayOfWeek,
    todayData,
    workout,
    toggleTask,
    getCompletionCount,
    isAllComplete,
    isLoading,
    replaceState,
  } = useHabitTracker();

  const completedCount = getCompletionCount();
  const totalTasks = getTotalTaskCount(dayOfWeek);

  // Format today's date for display
  const displayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });



  // Loading screen
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          <p className="font-mono text-sm text-slate-500 uppercase tracking-widest">
            Syncing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Warning overlay (9 PM+) */}
      <WarningOverlay isAllComplete={isAllComplete} />

      <div className="min-h-dvh bg-bg px-4 py-6 md:px-8 md:py-10 max-w-5xl mx-auto">
        <QuoteOfDay />
        {/* Header row: title + date + settings */}
        <header className="flex items-center justify-between mb-2">
          <div>
            <h1 className="font-mono text-xs md:text-sm text-slate-500 uppercase tracking-[0.3em]">
              Daily Execution Protocol
            </h1>
            <p className="text-xs font-mono text-slate-600 mt-1">
              {displayDate}
            </p>
          </div>
          <SettingsMenu onImport={replaceState} state={state} />
        </header>

        {/* Hero: Streak counter */}
        <StreakCounter streak={state.streakCount} />

        {/* Death clock */}
        <DeathClock isAllComplete={isAllComplete} />

        {/* Overall progress bar */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Daily Progress
            </span>
            <span className="text-xs font-mono text-slate-400">
              {completedCount}/{totalTasks}
            </span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${(completedCount / totalTasks) * 100}%`,
                background:
                  completedCount === totalTasks
                    ? "linear-gradient(90deg, #22c55e, #4ade80)"
                    : "linear-gradient(90deg, #3b82f6, #60a5fa)",
              }}
            />
          </div>
        </div>

        {/* Milestone badges */}
        <MilestoneBadges
          earnedMilestones={state.milestones}
          currentStreak={state.streakCount}
        />

        {/* Task modules: Morning + Evening side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {MODULES.map((mod) => (
            <TaskModule
              key={mod.id}
              module={mod}
              tasks={todayData.tasks}
              onToggle={toggleTask}
            />
          ))}
        </div>

        {/* Workout module */}
        <div className="mt-4">
          <WorkoutModule
            workout={workout}
            tasks={todayData.tasks}
            isChecked={!!todayData.tasks["workout"]}
            onToggle={toggleTask}
          />
        </div>

        {/* Heatmap */}
        <div className="mt-6">
          <Heatmap history={state.history} />
        </div>

        {/* Footer */}
        <footer className="mt-10 pb-6 text-center">
          <p className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">
            No freeze days. No exceptions. Hold the line.
          </p>
        </footer>
      </div>
    </>
  );
}
