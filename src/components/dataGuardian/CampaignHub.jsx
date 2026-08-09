import React from "react";
import { CHAPTERS, MISSIONS, CHARACTERS } from "../../lib/dataGuardian/missions";

export default function CampaignHub({ gameState, onSelectMission }) {
  const completedMissions = new Set(gameState.completedMissions || ["m1"]);

  return (
    <div className="space-y-6">
      {/* Lead Banner */}
      <div className="flex items-center gap-4 bg-gradient-to-r from-slate-900 via-surface-elevated to-slate-900 p-5 rounded-2xl border border-white/10 shadow-md">
        <span className="text-4xl bg-white/5 p-3 rounded-xl border border-white/10 shrink-0">
          📐
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Anika Rao's Command Brief</h2>
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md">
              Senior Database Architect
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            "Agent, Bharat Securities Exchange needs your technical expertise. Work through the 8 DBMS operational chapters below. Solve each mission to restore integrity, optimize speed, and earn your Data Guardian certification."
          </p>
        </div>
      </div>

      {/* Chapter Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CHAPTERS.map((ch) => {
          const mission = MISSIONS.find((m) => m.chapterId === ch.id);
          const isUnlocked = ch.id === 1 || completedMissions.has(`m${ch.id}`);
          const isCompleted = completedMissions.has(`m${ch.id + 1}`);
          const leadChar = CHARACTERS[ch.lead];
          const score = gameState.missionScores[`m${ch.id}`] || null;

          return (
            <div
              key={ch.id}
              className={`relative flex flex-col justify-between rounded-2xl p-6 border transition-all ${
                isUnlocked
                  ? "bg-surface-elevated/90 border-blue-500/30 shadow-lg hover:border-blue-400/80 hover:-translate-y-0.5"
                  : "bg-surface/50 border-white/5 opacity-60"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{ch.icon}</span>
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                      {ch.subtitle}
                    </span>
                  </div>
                  {score && (
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Score: {score}%
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{ch.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{ch.brief}</p>

                {/* Topics Tag List */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {ch.topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10 px-2 py-0.5 rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{leadChar.avatar}</span>
                  <span className="text-[11px] font-mono text-slate-400">{leadChar.name}</span>
                </div>

                {isUnlocked ? (
                  <button
                    onClick={() => onSelectMission(mission.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>{score ? "Replay Mission" : "Start Mission"}</span>
                    <span>→</span>
                  </button>
                ) : (
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <span>🔒</span> Complete Ch {ch.id - 1} First
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
