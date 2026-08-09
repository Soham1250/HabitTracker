import React, { useState } from "react";
import { StorageEngine } from "../../lib/dataGuardian/storageEngine";

export default function IndexVisualizer({ mission, onValidate }) {
  const [targetKey, setTargetKey] = useState(550);
  const [traversedPath, setTraversedPath] = useState([]);
  const storage = new StorageEngine(1000000, 100);

  const heapCost = storage.getHeapScanCost();
  const bTreeCost = storage.getBPlusTreeIndexCost(300);

  const handleRunTraversal = () => {
    const path = storage.traverseNodePath(targetKey, mission.treeData);
    setTraversedPath(path);

    onValidate(
      true,
      `B+ Tree Range Scan Successful! Traversed 3 tree level nodes + 2 leaf block linked pointers = 5 total block reads vs 10,000 heap block scans!`,
      100
    );
  };

  return (
    <div className="space-y-6">
      {/* Cost Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-mono font-bold text-red-400 uppercase">
              Heap File Full Table Scan
            </h4>
            <span className="text-xs font-mono bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
              Slow
            </span>
          </div>
          <p className="text-2xl font-mono font-extrabold text-white">
            {heapCost.blockAccesses.toLocaleString()} <span className="text-xs text-slate-400 font-normal">Block Reads</span>
          </p>
          <p className="text-xs text-slate-400 mt-2">{heapCost.explanation}</p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase">
              B+ Tree Index Range Scan
            </h4>
            <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
              Optimal
            </span>
          </div>
          <p className="text-2xl font-mono font-extrabold text-white">
            {bTreeCost.blockAccesses} <span className="text-xs text-slate-400 font-normal">Block Reads</span>
          </p>
          <p className="text-xs text-slate-400 mt-2">{bTreeCost.explanation}</p>
        </div>
      </div>

      {/* Visual B+ Tree Canvas */}
      <div className="bg-surface-elevated p-6 rounded-2xl border border-white/10 text-center space-y-6">
        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest">
          Visual B+ Tree Index Node Traversal Canvas
        </h3>

        {/* Root Level */}
        <div className="flex justify-center">
          <div className="bg-blue-600 text-white font-mono text-xs px-6 py-3 rounded-xl shadow-lg border border-blue-400">
            ROOT NODE [ Key: 500 ]
          </div>
        </div>

        {/* Connector Arrow */}
        <div className="text-slate-500 font-mono text-xs">
          │ (Key &gt;= 500) ──► Go Right
        </div>

        {/* Internal Level */}
        <div className="flex justify-center gap-8">
          <div className="bg-indigo-900 border border-indigo-400 text-indigo-200 font-mono text-xs px-5 py-2.5 rounded-xl shadow">
            INTERNAL NODE [ Key: 750 ]
          </div>
        </div>

        {/* Leaf Nodes Linked List */}
        <div className="flex justify-center items-center gap-4 pt-2">
          <div className="bg-slate-900 border border-slate-700 text-slate-400 font-mono text-xs p-3 rounded-lg">
            Leaf [1-249]
          </div>
          <span className="text-slate-600 font-mono">↔</span>
          <div className="bg-slate-900 border border-slate-700 text-slate-400 font-mono text-xs p-3 rounded-lg">
            Leaf [250-499]
          </div>
          <span className="text-slate-600 font-mono">↔</span>
          <div className="bg-emerald-600 text-white font-mono text-xs p-3 rounded-lg shadow-lg border border-emerald-400 font-bold">
            Target Leaf [500-749]
          </div>
          <span className="text-slate-600 font-mono">↔</span>
          <div className="bg-emerald-600 text-white font-mono text-xs p-3 rounded-lg shadow-lg border border-emerald-400 font-bold">
            Target Leaf [750-1000]
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleRunTraversal}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition-all"
        >
          Run B+ Tree Traversal Test
        </button>
      </div>
    </div>
  );
}
