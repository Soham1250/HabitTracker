import React, { useState } from "react";

export default function NormalizationPuzzle({ mission, onValidate }) {
  const [selectedNormalForm, setSelectedNormalForm] = useState("1NF");
  const [phoneUpdateVal, setPhoneUpdateVal] = useState("9999999999");
  const [anomalyMode, setAnomalyMode] = useState("unnormalized"); // "unnormalized" | "3nf"
  const [updatedRowsCount, setUpdatedRowsCount] = useState(0);

  const handleSimulateUpdate = () => {
    if (anomalyMode === "unnormalized") {
      setUpdatedRowsCount(150); // Redundant updates across 150 trade rows
    } else {
      setUpdatedRowsCount(1); // Clean 1 row update in normalized Investor table
    }
  };

  const handleValidateNormalization = () => {
    if (selectedNormalForm === "3NF") {
      onValidate(
        true,
        "Normalization Complete! Decomposing TradeRecord into Investor, Broker, Security, Trade, and TradeItem satisfies 3NF and eliminates Update, Insert, and Deletion anomalies.",
        100
      );
    } else {
      onValidate(
        false,
        "Select 3NF: 1NF and 2NF schemas still leave transitive dependencies (trade_id -> investor_id -> investor_name), causing update anomalies.",
        40
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Functional Dependencies Brief */}
      <div className="bg-surface-elevated p-5 rounded-2xl border border-white/10">
        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
          Identified Functional Dependencies (FDs)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-black/40 p-3 rounded-xl border border-amber-500/20 text-amber-300">
            FD1: investor_id → investor_name, investor_phone
          </div>
          <div className="bg-black/40 p-3 rounded-xl border border-amber-500/20 text-amber-300">
            FD2: broker_id → broker_name
          </div>
          <div className="bg-black/40 p-3 rounded-xl border border-amber-500/20 text-amber-300">
            FD3: security_id → symbol
          </div>
          <div className="bg-black/40 p-3 rounded-xl border border-amber-500/20 text-amber-300">
            FD4: (trade_id, security_id) → quantity
          </div>
        </div>
      </div>

      {/* Anomaly Simulator */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-blue-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <span>⚡</span> Anomaly Simulator // Live Update Test
          </h3>
          <div className="flex bg-black/50 p-1 rounded-lg border border-white/10 text-xs font-mono">
            <button
              onClick={() => setAnomalyMode("unnormalized")}
              className={`px-3 py-1 rounded ${
                anomalyMode === "unnormalized" ? "bg-red-500/30 text-red-300 font-bold" : "text-slate-400"
              }`}
            >
              Unnormalized (1 Table)
            </button>
            <button
              onClick={() => setAnomalyMode("3nf")}
              className={`px-3 py-1 rounded ${
                anomalyMode === "3nf" ? "bg-emerald-500/30 text-emerald-300 font-bold" : "text-slate-400"
              }`}
            >
              Normalized (3NF)
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/10">
          <div className="flex-1">
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Update Asha Rao's Phone Number:
            </label>
            <input
              type="text"
              value={phoneUpdateVal}
              onChange={(e) => setPhoneUpdateVal(e.target.value)}
              className="w-full bg-surface-elevated text-white border border-white/20 rounded-lg p-2 font-mono text-xs focus:outline-none"
            />
          </div>
          <button
            onClick={handleSimulateUpdate}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl shadow transition-all shrink-0"
          >
            Execute UPDATE
          </button>
        </div>

        {updatedRowsCount > 0 && (
          <div
            className={`mt-4 p-3 rounded-xl border text-xs font-mono ${
              anomalyMode === "unnormalized"
                ? "bg-red-500/10 border-red-500/30 text-red-300"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}
          >
            {anomalyMode === "unnormalized"
              ? `⚠️ UPDATE ANOMALY! System updated Asha Rao's phone number across ${updatedRowsCount} duplicate trade rows! High risk of data inconsistency.`
              : `✅ CLEAN UPDATE! Asha Rao's phone number updated in exactly ${updatedRowsCount} row in the normalized Investor table.`}
          </div>
        )}
      </div>

      {/* Target Normal Form Selection */}
      <div className="bg-surface p-5 rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
            Select Target Normal Form:
          </label>
          <div className="flex gap-3">
            {["1NF", "2NF", "3NF"].map((nf) => (
              <button
                key={nf}
                onClick={() => setSelectedNormalForm(nf)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                  selectedNormalForm === nf
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-surface-elevated text-slate-400 border border-white/10"
                }`}
              >
                {nf}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleValidateNormalization}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition-all"
        >
          Validate 3NF Schema
        </button>
      </div>
    </div>
  );
}
