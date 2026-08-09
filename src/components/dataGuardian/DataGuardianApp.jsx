import React, { useState, useEffect } from "react";
import CampaignHub from "./CampaignHub";
import MissionView from "./MissionView";
import ExamModeView from "./ExamModeView";
import MasteryDashboard from "./MasteryDashboard";
import { CHARACTERS } from "../../lib/dataGuardian/missions";

export default function DataGuardianApp({ onBackToHub }) {
  const [activeTab, setActiveTab] = useState("campaign"); // "campaign" | "exam" | "mastery"
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  
  // Persistent gameState in localStorage
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem("sebi_data_guardian_state");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      completedMissions: ["m1"], // m1 unlocked by default
      missionScores: { m1: 85 },
      unlockedChapters: [1],
      examHistory: [],
      conceptMastery: {
        "ER Modeling": 75,
        "Keys & Constraints": 80,
        "Normalization": 60,
        "Relational Algebra": 55,
        "SQL Joins": 85,
        "Subqueries": 60,
        "Indexing": 50,
        "Transactions": 70,
        "Concurrency": 50
      }
    };
  });

  useEffect(() => {
    localStorage.setItem("sebi_data_guardian_state", JSON.stringify(gameState));
  }, [gameState]);

  const handleMissionComplete = (missionId, score) => {
    setGameState((prev) => {
      const updatedScores = { ...prev.missionScores, [missionId]: Math.max(score, prev.missionScores[missionId] || 0) };
      const completed = new Set(prev.completedMissions);
      completed.add(missionId);

      // Unlock next mission
      const numId = parseInt(missionId.replace("m", ""), 10);
      const nextId = `m${numId + 1}`;
      completed.add(nextId);

      const unlockedChapters = new Set(prev.unlockedChapters);
      unlockedChapters.add(numId + 1);

      return {
        ...prev,
        completedMissions: Array.from(completed),
        missionScores: updatedScores,
        unlockedChapters: Array.from(unlockedChapters)
      };
    });
  };

  if (selectedMissionId) {
    return (
      <MissionView
        missionId={selectedMissionId}
        onBack={() => setSelectedMissionId(null)}
        onComplete={(score) => {
          handleMissionComplete(selectedMissionId, score);
        }}
      />
    );
  }

  return (
    <div className="animate-fade-in text-slate-200">
      {/* Top Header & Back to Hub Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHub}
            className="px-3 py-2 bg-surface-elevated hover:bg-white/10 text-slate-300 rounded-lg border border-white/10 font-mono text-xs flex items-center gap-1.5 transition-all"
          >
            <span>←</span>
            <span>Master IT Hub</span>
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <span>🗄️</span> SEBI Data Guardian
            </h1>
            <p className="text-xs font-mono text-slate-400">
              DBMS & SQL Interactive Mission Engine
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-surface-elevated p-1 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab("campaign")}
            className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === "campaign"
                ? "bg-blue-600 text-white font-semibold shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Campaign Mode
          </button>
          <button
            onClick={() => setActiveTab("exam")}
            className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === "exam"
                ? "bg-indigo-600 text-white font-semibold shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            SEBI Exam Practice
          </button>
          <button
            onClick={() => setActiveTab("mastery")}
            className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === "mastery"
                ? "bg-purple-600 text-white font-semibold shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Mastery Analytics
          </button>
        </div>
      </div>

      {/* Main Tab Render */}
      {activeTab === "campaign" ? (
        <CampaignHub
          gameState={gameState}
          onSelectMission={(id) => setSelectedMissionId(id)}
        />
      ) : activeTab === "exam" ? (
        <ExamModeView gameState={gameState} setGameState={setGameState} />
      ) : (
        <MasteryDashboard gameState={gameState} />
      )}
    </div>
  );
}
