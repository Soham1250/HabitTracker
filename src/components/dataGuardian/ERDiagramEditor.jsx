import React, { useState } from "react";

export default function ERDiagramEditor({ mission, onValidate }) {
  const [cardinality, setCardinality] = useState(mission.startingSchema?.relationships[0]?.cardinality || "1:1");
  const [participation, setParticipation] = useState(mission.startingSchema?.relationships[0]?.participation || "total");
  const [fkTable, setFkTable] = useState(mission.startingSchema?.relationships[0]?.foreignKeyLocation || "Investor");
  const [localFeedback, setLocalFeedback] = useState(null);

  const handleRunValidation = () => {
    const req = mission.requiredSolution;
    let isValid = true;
    let feedback = "";

    if (req.cardinality && cardinality !== req.cardinality) {
      isValid = false;
      feedback = `Incorrect Cardinality: Setting ${cardinality} restricts the database! In sample data, Investor I102 placed 2 orders. The relationship must be 1:N (One Investor to Many Orders).`;
    } else if (req.foreignKeyTable && fkTable !== req.foreignKeyTable) {
      isValid = false;
      feedback = `Incorrect Foreign Key Location: Storing foreign key in ${fkTable} creates redundant NULLs! In a 1:N relationship, foreign key investor_id MUST be stored in the Order relation (the MANY side).`;
    } else {
      feedback = "Perfect ER Model! The 1:N cardinality with foreign key investor_id in Order correctly allows multiple orders per investor without data redundancy.";
    }

    setLocalFeedback({ isValid, message: feedback });
    onValidate(isValid, feedback, isValid ? 100 : 40);
  };

  return (
    <div className="space-y-6">
      {/* Visual ER Diagram Canvas */}
      <div className="bg-surface-elevated p-6 rounded-2xl border border-white/10 relative overflow-hidden shadow-inner">
        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-6">
          Interactive ER Canvas // Relationship Architect
        </h3>

        {/* Entities Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative z-10">
          {/* Entity 1: Investor */}
          <div className="w-56 bg-slate-900 border-2 border-blue-500 rounded-xl p-4 shadow-lg text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
              Entity [1]
            </div>
            <h4 className="text-base font-bold text-white mt-1">Investor</h4>
            <div className="mt-3 text-left space-y-1 text-xs font-mono bg-black/40 p-2 rounded-lg text-slate-300">
              <p className="text-amber-400 font-semibold">🔑 investor_id (PK)</p>
              <p>🔹 name</p>
              <p>🔹 phone</p>
              {fkTable === "Investor" && (
                <p className="text-rose-400 font-bold bg-rose-500/10 p-1 rounded border border-rose-500/20">
                  ⚠️ order_id (FK - Flawed)
                </p>
              )}
            </div>
          </div>

          {/* Connector Line with Cardinality Diamond */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-16 bg-indigo-950/80 border-2 border-indigo-500 transform rotate-45 flex items-center justify-center shadow-md my-2">
              <span className="transform -rotate-45 text-xs font-mono font-bold text-indigo-300">
                places
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400 bg-black/50 px-3 py-1 rounded-full border border-amber-500/30">
              <span>{cardinality}</span>
              <span>•</span>
              <span className="capitalize">{participation}</span>
            </div>
          </div>

          {/* Entity 2: Order */}
          <div className="w-56 bg-slate-900 border-2 border-indigo-500 rounded-xl p-4 shadow-lg text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
              Entity [N]
            </div>
            <h4 className="text-base font-bold text-white mt-1">Order</h4>
            <div className="mt-3 text-left space-y-1 text-xs font-mono bg-black/40 p-2 rounded-lg text-slate-300">
              <p className="text-amber-400 font-semibold">🔑 order_id (PK)</p>
              {fkTable === "Order" ? (
                <p className="text-emerald-400 font-bold bg-emerald-500/10 p-1 rounded border border-emerald-500/20">
                  🔗 investor_id (FK)
                </p>
              ) : (
                <p className="text-slate-500 line-through">🔗 investor_id (FK)</p>
              )}
              <p>🔹 order_date</p>
              <p>🔹 quantity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface p-5 rounded-xl border border-white/10">
        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
            Cardinality Ratio:
          </label>
          <select
            value={cardinality}
            onChange={(e) => {
              setCardinality(e.target.value);
              setLocalFeedback(null);
            }}
            className="w-full bg-surface-elevated text-white border border-white/20 rounded-lg p-2.5 font-mono text-xs focus:border-blue-500 outline-none"
          >
            <option value="1:1">1:1 (One Investor to One Order)</option>
            <option value="1:N">1:N (One Investor to Many Orders)</option>
            <option value="M:N">M:N (Many Investors to Many Orders)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
            Participation Constraint:
          </label>
          <select
            value={participation}
            onChange={(e) => {
              setParticipation(e.target.value);
              setLocalFeedback(null);
            }}
            className="w-full bg-surface-elevated text-white border border-white/20 rounded-lg p-2.5 font-mono text-xs focus:border-blue-500 outline-none"
          >
            <option value="total">Total Participation (Double Line)</option>
            <option value="partial">Partial Participation (Single Line)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
            Foreign Key Location:
          </label>
          <select
            value={fkTable}
            onChange={(e) => {
              setFkTable(e.target.value);
              setLocalFeedback(null);
            }}
            className="w-full bg-surface-elevated text-white border border-white/20 rounded-lg p-2.5 font-mono text-xs focus:border-blue-500 outline-none"
          >
            <option value="Investor">Store investor_id in Investor</option>
            <option value="Order">Store investor_id in Order (Many side)</option>
          </select>
        </div>
      </div>

      {/* Local Feedback Banner */}
      {localFeedback && (
        <div
          className={`p-4 rounded-xl border font-mono text-xs animate-fade-in ${
            localFeedback.isValid
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-200"
              : "bg-red-500/10 border-red-500/40 text-red-200"
          }`}
        >
          <div className="flex items-center gap-2 font-bold uppercase mb-1">
            <span>{localFeedback.isValid ? "✅ Schema Validated!" : "❌ Validation Failed"}</span>
          </div>
          <p className="leading-relaxed">{localFeedback.message}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleRunValidation}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span>Run Schema Simulation & Validate</span>
          <span>⚡</span>
        </button>
      </div>
    </div>
  );
}
