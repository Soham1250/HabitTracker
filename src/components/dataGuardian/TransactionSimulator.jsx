import React, { useState } from "react";
import { ConcurrencyEngine } from "../../lib/dataGuardian/concurrencyEngine";

export default function TransactionSimulator({ mission, onValidate }) {
  const [selectedResolution, setSelectedResolution] = useState("abort_t2");
  const [deadlockState, setDeadlockState] = useState(null);
  const concurrency = new ConcurrencyEngine();

  const handleDetectDeadlock = () => {
    // Wait-For Graph edges: T1 -> T2 and T2 -> T1
    const edges = [
      { from: "T1", to: "T2" },
      { from: "T2", to: "T1" }
    ];
    const res = concurrency.detectDeadlockCycle(edges);
    setDeadlockState(res);

    onValidate(
      true,
      "Deadlock Resolved! Detected circular wait condition (T1 → T2 → T1) in Wait-For Graph. Aborting younger transaction T2 released Exclusive Lock on Account_B, allowing T1 to complete safely.",
      100
    );
  };

  return (
    <div className="space-y-6">
      {/* Transaction Timeline Simulator */}
      <div className="bg-surface-elevated p-6 rounded-2xl border border-white/10 space-y-6">
        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest">
          Concurrent Transaction Execution Timeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* T1 */}
          <div className="bg-slate-900 p-4 rounded-xl border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-bold text-blue-400">Transaction T1</span>
              <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px]">Active</span>
            </div>
            <p className="text-slate-300">1. X-LOCK(Account_A) <span className="text-emerald-400">✓ Granted</span></p>
            <p className="text-slate-300">2. READ(Account_A)</p>
            <p className="text-amber-400 font-bold">3. REQUEST X-LOCK(Account_B) ──► WAITING (Held by T2)</p>
          </div>

          {/* T2 */}
          <div className="bg-slate-900 p-4 rounded-xl border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-bold text-purple-400">Transaction T2</span>
              <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-[10px]">Active</span>
            </div>
            <p className="text-slate-300">1. X-LOCK(Account_B) <span className="text-emerald-400">✓ Granted</span></p>
            <p className="text-slate-300">2. READ(Account_B)</p>
            <p className="text-amber-400 font-bold">3. REQUEST X-LOCK(Account_A) ──► WAITING (Held by T1)</p>
          </div>
        </div>

        {/* Wait-For Graph Canvas */}
        <div className="bg-black/50 p-5 rounded-xl border border-red-500/30 text-center space-y-3">
          <h4 className="text-xs font-mono text-red-400 uppercase font-bold flex items-center justify-center gap-2">
            <span>🚨</span> Wait-For Graph (WFG) Cycle Detected
          </h4>

          <div className="flex items-center justify-center gap-6 font-mono text-sm">
            <div className="w-14 h-14 bg-blue-600/30 border-2 border-blue-400 text-white rounded-full flex items-center justify-center font-bold">
              T1
            </div>
            <div className="flex flex-col text-red-400 text-xs">
              <span>────── Waits For ──────►</span>
              <span>◄────── Waits For ──────</span>
            </div>
            <div className="w-14 h-14 bg-purple-600/30 border-2 border-purple-400 text-white rounded-full flex items-center justify-center font-bold">
              T2
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Panel */}
      <div className="bg-surface p-5 rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
            Deadlock Recovery Strategy:
          </label>
          <select
            value={selectedResolution}
            onChange={(e) => setSelectedResolution(e.target.value)}
            className="bg-surface-elevated text-white border border-white/20 rounded-lg p-2.5 font-mono text-xs focus:outline-none"
          >
            <option value="abort_t2">Victim Selection: Abort T2 & Issue ROLLBACK</option>
            <option value="lock_ordering">Apply Global Lock Ordering Rule (Lock A before B)</option>
          </select>
        </div>

        <button
          onClick={handleDetectDeadlock}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition-all"
        >
          Resolve Deadlock & Complete Mission
        </button>
      </div>
    </div>
  );
}
