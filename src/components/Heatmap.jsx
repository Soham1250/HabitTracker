import { useMemo } from "react";
import { formatDateKey } from "../lib/storage";

/**
 * GitHub-style contribution heatmap.
 * Desktop: 180 days. Mobile: 30 days (via CSS media query).
 * Green = 100% complete, Red = missed/partial, Dark = no data/future.
 */
export default function Heatmap({ history }) {
  const { days180, days30, monthLabels180, monthLabels30 } = useMemo(() => {
    return generateHeatmapData(history);
  }, [history]);

  return (
    <div className="bg-surface rounded-2xl border border-white/5 p-5 md:p-6">
      <h2 className="font-mono text-base md:text-lg font-bold text-slate-200 tracking-tight mb-1">
        Execution History
      </h2>
      <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-5">
        180-Day Heatmap
      </p>

      {/* Desktop: 180 days */}
      <div className="hidden md:block">
        <MonthLabels labels={monthLabels180} />
        <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
          {days180.map((day, i) => (
            <HeatmapCell key={i} day={day} />
          ))}
        </div>
      </div>

      {/* Mobile: 30 days */}
      <div className="md:hidden">
        <MonthLabels labels={monthLabels30} />
        <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
          {days30.map((day, i) => (
            <HeatmapCell key={i} day={day} />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 text-xs font-mono text-slate-500">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-[#1a1a28]" />
        <div className="w-3 h-3 rounded-sm bg-red-500/60" />
        <div className="w-3 h-3 rounded-sm bg-green-500/40" />
        <div className="w-3 h-3 rounded-sm bg-green-500" />
        <span>More</span>
      </div>
    </div>
  );
}

function HeatmapCell({ day }) {
  if (!day) {
    return <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm" />;
  }

  const { date, status } = day;
  let bgClass = "bg-[#1a1a28]"; // default: no data
  let glowStyle = {};

  if (status === "complete") {
    bgClass = "bg-green-500";
    glowStyle = { boxShadow: "0 0 4px rgba(34, 197, 94, 0.4)" };
  } else if (status === "missed") {
    bgClass = "bg-red-500/70";
  } else if (status === "future") {
    bgClass = "bg-[#0f0f18]";
  }

  return (
    <div
      className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm ${bgClass} transition-colors duration-200 cursor-default`}
      style={glowStyle}
      title={`${date}: ${status}`}
    />
  );
}

function MonthLabels({ labels }) {
  return (
    <div className="flex mb-2 text-[10px] font-mono text-slate-600">
      {labels.map((label, i) => (
        <span key={i} className="flex-1 text-center">
          {label}
        </span>
      ))}
    </div>
  );
}

function generateHeatmapData(history) {
  const today = new Date();
  const todayStr = formatDateKey(today);

  // Generate 180 days of data (for desktop)
  const days180 = [];
  // We need to fill in blanks to align the grid to start on a Sunday
  const startDate180 = new Date(today);
  startDate180.setDate(startDate180.getDate() - 179);

  // Pad start to align with Sunday (start of week)
  const startDow = startDate180.getDay();
  for (let i = 0; i < startDow; i++) {
    days180.push(null); // empty padding cells
  }

  for (let i = 0; i < 180; i++) {
    const d = new Date(startDate180);
    d.setDate(d.getDate() + i);
    const key = formatDateKey(d);

    let status = "no-data";
    if (key > todayStr) {
      status = "future";
    } else if (history[key]) {
      status = history[key].allCompleted ? "complete" : "missed";
    } else if (key < todayStr) {
      status = "missed";
    }

    days180.push({ date: key, status });
  }

  // Generate 30 days for mobile
  const days30 = [];
  const startDate30 = new Date(today);
  startDate30.setDate(startDate30.getDate() - 29);

  const startDow30 = startDate30.getDay();
  for (let i = 0; i < startDow30; i++) {
    days30.push(null);
  }

  for (let i = 0; i < 30; i++) {
    const d = new Date(startDate30);
    d.setDate(d.getDate() + i);
    const key = formatDateKey(d);

    let status = "no-data";
    if (key > todayStr) {
      status = "future";
    } else if (history[key]) {
      status = history[key].allCompleted ? "complete" : "missed";
    } else if (key < todayStr) {
      status = "missed";
    }

    days30.push({ date: key, status });
  }

  // Month labels
  const monthLabels180 = getMonthLabels(startDate180, 180);
  const monthLabels30 = getMonthLabels(startDate30, 30);

  return { days180, days30, monthLabels180, monthLabels30 };
}

function getMonthLabels(startDate, totalDays) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const labels = [];
  let lastMonth = -1;

  // Sample a few points across the range
  const step = Math.max(1, Math.floor(totalDays / 6));
  for (let i = 0; i < totalDays; i += step) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const m = d.getMonth();
    if (m !== lastMonth) {
      labels.push(months[m]);
      lastMonth = m;
    } else {
      labels.push("");
    }
  }

  return labels;
}
