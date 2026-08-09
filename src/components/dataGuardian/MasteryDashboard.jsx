import React from "react";

export default function MasteryDashboard({ gameState }) {
  const mastery = gameState.conceptMastery || {
    "ER Modeling": 75,
    "Keys & Constraints": 80,
    "Normalization": 60,
    "Relational Algebra": 55,
    "SQL Joins": 85,
    "Subqueries": 60,
    "Indexing": 50,
    "Transactions": 70,
    "Concurrency": 50
  };

  // Calculate average score across all topics
  const topicValues = Object.values(mastery);
  const avgMastery = Math.round(
    topicValues.reduce((acc, curr) => acc + curr, 0) / topicValues.length
  );

  let rank = "Junior Analyst";
  let rankBadge = "🥉";
  if (avgMastery >= 90) {
    rank = "Data Guardian Officer";
    rankBadge = "👑";
  } else if (avgMastery >= 75) {
    rank = "Senior Market Analyst";
    rankBadge = "🥇";
  } else if (avgMastery >= 60) {
    rank = "Database Specialist";
    rankBadge = "🥈";
  }

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      {/* Rank Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-purple-950/80 to-slate-900 p-6 rounded-2xl border border-purple-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <span className="text-5xl bg-white/5 p-3 rounded-2xl border border-white/10">{rankBadge}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                Official SEBI Officer Rating
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">{rank}</h2>
            <p className="text-xs font-mono text-slate-400">
              Overall DBMS Concept Readiness: {avgMastery}%
            </p>
          </div>
        </div>

        <div className="text-right font-mono">
          <p className="text-3xl font-extrabold text-purple-400">{avgMastery}%</p>
          <p className="text-[10px] text-slate-400 uppercase">Syllabus Mastery Score</p>
        </div>
      </div>

      {/* Topic Mastery Progress Bars */}
      <div className="bg-surface-elevated p-6 rounded-2xl border border-white/10 space-y-5">
        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest">
          DBMS & SQL Concept Mastery Breakdown
        </h3>

        <div className="space-y-4">
          {Object.entries(mastery).map(([topic, val]) => (
            <div key={topic} className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>{topic}</span>
                <span className={val >= 75 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                  {val}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    val >= 80
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                      : val >= 60
                      ? "bg-gradient-to-r from-blue-500 to-indigo-400"
                      : "bg-gradient-to-r from-amber-500 to-rose-400"
                  }`}
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Box */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-amber-500/30 font-mono text-xs space-y-2">
        <h4 className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <span>💡</span> Recommended Revision Actions:
        </h4>
        <p className="text-slate-300 leading-relaxed">
          Your Indexing (50%) and Concurrency (50%) mastery scores require practice! Replay <strong className="text-white">Chapter 7: Speed Up the Investigation</strong> and <strong className="text-white">Chapter 8: Protect the Settlement System</strong> to ensure full preparation for SEBI Grade A IT questions.
        </p>
      </div>
    </div>
  );
}
