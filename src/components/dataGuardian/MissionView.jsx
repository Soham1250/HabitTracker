import React, { useState } from "react";
import { MISSIONS, CHARACTERS } from "../../lib/dataGuardian/missions";
import ERDiagramEditor from "./ERDiagramEditor";
import SqlSandboxEditor from "./SqlSandboxEditor";
import NormalizationPuzzle from "./NormalizationPuzzle";
import IndexVisualizer from "./IndexVisualizer";
import TransactionSimulator from "./TransactionSimulator";

export default function MissionView({ missionId, onBack, onComplete }) {
  const mission = MISSIONS.find((m) => m.id === missionId) || MISSIONS[0];
  const leadChar = CHARACTERS[mission.lead];

  const [currentHintLevel, setCurrentHintLevel] = useState(0);
  const [showHintDrawer, setShowHintDrawer] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showExamModal, setShowExamModal] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Classification mission state for Mission 1
  const [classifiedCards, setClassifiedCards] = useState({
    Entities: [],
    Attributes: [],
    "Derived Attributes": []
  });

  const handleValidate = (isValid, message, baseScore) => {
    // Deduct points slightly for hint usage
    const hintDeduction = currentHintLevel * 5;
    const finalScore = Math.max(20, baseScore - hintDeduction);

    setFeedback({
      isValid,
      message,
      score: finalScore
    });

    if (isValid) {
      setShowExamModal(true);
    }
  };

  const handleClassificationSubmit = () => {
    // Check if cards are sorted cleanly
    const isSuccess = classifiedCards.Entities.length >= 3;
    handleValidate(
      isSuccess,
      isSuccess
        ? "Excellent! Classified Investor, Broker, Trade, Security as Entities; investor_id, phone, broker_code as Attributes; and trade_value as Derived Attribute."
        : "Some cards are misplaced. Remember: Nouns/Objects are Entities, properties are Attributes, and calculated values are Derived Attributes.",
      isSuccess ? 100 : 40
    );
  };

  const handleExamSubmit = () => {
    setExamSubmitted(true);
    setTimeout(() => {
      onComplete(feedback?.score || 85);
      onBack();
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      {/* Mission Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-surface-elevated p-5 rounded-2xl border border-white/10 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg border border-white/10 font-mono text-xs flex items-center gap-1.5 transition-all"
          >
            <span>←</span>
            <span>Back to Campaign</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{mission.title}</h2>
              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
                {mission.difficulty}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Topics: {mission.topics.join(" • ")}
            </p>
          </div>
        </div>

        {/* Hint Drawer Toggle */}
        <button
          onClick={() => setShowHintDrawer(!showHintDrawer)}
          className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl font-mono text-xs flex items-center gap-2 transition-all shadow"
        >
          <span>💡 Progressive Hints</span>
          <span className="bg-amber-500/30 px-2 py-0.5 rounded-full font-bold text-[10px]">
            {currentHintLevel}/{mission.hints.length}
          </span>
        </button>
      </div>

      {/* Progressive Hint Drawer */}
      {showHintDrawer && (
        <div className="bg-gradient-to-r from-amber-950/40 via-surface-elevated to-amber-950/40 p-5 rounded-2xl border border-amber-500/30 animate-fade-in space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
              <span>💡</span> Progressive Guidance System (Hint Level {currentHintLevel > 0 ? currentHintLevel : 1})
            </h4>
            {currentHintLevel < mission.hints.length - 1 && (
              <button
                onClick={() => setCurrentHintLevel((prev) => prev + 1)}
                className="text-[11px] font-mono bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-lg"
              >
                Next Hint Level (+5% Deduction)
              </button>
            )}
          </div>

          <p className="text-xs text-amber-100/90 leading-relaxed font-mono bg-black/40 p-3 rounded-xl border border-amber-500/20">
            {mission.hints[currentHintLevel]}
          </p>
        </div>
      )}

      {/* Story & Dialogue Banner */}
      <div className="flex items-start gap-4 bg-gradient-to-r from-slate-900 via-surface-elevated to-slate-900 p-5 rounded-2xl border border-white/10">
        <span className="text-3xl bg-white/5 p-2.5 rounded-xl border border-white/10 shrink-0">
          {leadChar.avatar}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">{leadChar.name}</h3>
            <span className="text-[10px] font-mono text-indigo-400 font-medium">
              // {leadChar.role}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{mission.story}</p>
        </div>
      </div>

      {/* Dynamic Mission Playground */}
      <div className="bg-surface-elevated/70 p-6 rounded-2xl border border-white/10">
        {mission.type === "classification" ? (
          <div className="space-y-6">
            <p className="text-xs font-mono text-slate-400">
              Drag or assign raw cards below into Entities, Attributes, or Derived Attributes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Entities", "Attributes", "Derived Attributes"].map((bucket) => (
                <div key={bucket} className="bg-slate-900 p-4 rounded-xl border border-white/10">
                  <h4 className="text-xs font-mono font-bold text-blue-400 uppercase mb-3">
                    {bucket} ({classifiedCards[bucket].length})
                  </h4>
                  <div className="space-y-2 min-h-[120px]">
                    {classifiedCards[bucket].map((card) => (
                      <div
                        key={card.id}
                        className="bg-surface p-2.5 rounded-lg border border-white/10 text-xs font-mono flex items-center justify-between"
                      >
                        <span>{card.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
              {mission.initialCards.map((card) => (
                <div key={card.id} className="flex items-center gap-1.5 bg-black/50 p-2 rounded-lg border border-white/10 text-xs font-mono">
                  <span>{card.label}</span>
                  <button
                    onClick={() =>
                      setClassifiedCards((prev) => ({
                        ...prev,
                        Entities: [...prev.Entities, card]
                      }))
                    }
                    className="text-[10px] bg-blue-600 px-2 py-0.5 rounded text-white font-bold"
                  >
                    + Entity
                  </button>
                  <button
                    onClick={() =>
                      setClassifiedCards((prev) => ({
                        ...prev,
                        Attributes: [...prev.Attributes, card]
                      }))
                    }
                    className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded text-white font-bold"
                  >
                    + Attr
                  </button>
                  <button
                    onClick={() =>
                      setClassifiedCards((prev) => ({
                        ...prev,
                        "Derived Attributes": [...prev["Derived Attributes"], card]
                      }))
                    }
                    className="text-[10px] bg-amber-600 px-2 py-0.5 rounded text-white font-bold"
                  >
                    + Derived
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleClassificationSubmit}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition-all"
            >
              Submit Classification & Validate
            </button>
          </div>
        ) : mission.type === "er_modeling" ? (
          <ERDiagramEditor mission={mission} onValidate={handleValidate} />
        ) : mission.type === "sql_editor" ? (
          <SqlSandboxEditor mission={mission} onValidate={handleValidate} />
        ) : mission.type === "normalization" ? (
          <NormalizationPuzzle mission={mission} onValidate={handleValidate} />
        ) : mission.type === "indexing" ? (
          <IndexVisualizer mission={mission} onValidate={handleValidate} />
        ) : (
          <TransactionSimulator mission={mission} onValidate={handleValidate} />
        )}
      </div>

      {/* Validation Feedback Modal */}
      {feedback && (
        <div
          className={`p-5 rounded-2xl border text-xs font-mono animate-fade-in ${
            feedback.isValid
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-200"
              : "bg-red-500/10 border-red-500/40 text-red-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              {feedback.isValid ? "✅ Validation Passed!" : "❌ Validation Failed"}
            </span>
            <span className="font-bold text-sm bg-black/40 px-3 py-1 rounded-full border border-white/10">
              Mission Score: {feedback.score}%
            </span>
          </div>
          <p className="leading-relaxed">{feedback.message}</p>
        </div>
      )}

      {/* SEBI Exam Follow-Up Modal */}
      {showExamModal && mission.examFollowUp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface-elevated max-w-xl w-full p-6 rounded-2xl border border-indigo-500/30 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚖️</span>
                <h3 className="text-base font-bold text-white">SEBI IT Exam Follow-Up Question</h3>
              </div>
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full">
                The Auditor
              </span>
            </div>

            <p className="text-xs font-mono text-slate-200 leading-relaxed">
              {mission.examFollowUp.question}
            </p>

            <div className="space-y-2 font-mono text-xs">
              {mission.examFollowUp.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedAnswer === idx
                      ? "bg-indigo-600 border-indigo-400 text-white font-bold"
                      : "bg-surface border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {examSubmitted && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono rounded-xl">
                {selectedAnswer === mission.examFollowUp.correctAnswer
                  ? "✅ Correct! " + mission.examFollowUp.explanation
                  : "❌ Incorrect. " + mission.examFollowUp.explanation}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                disabled={selectedAnswer === null}
                onClick={handleExamSubmit}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-mono text-xs font-bold rounded-xl shadow transition-all"
              >
                Submit Exam Answer & Unlock Next Mission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
