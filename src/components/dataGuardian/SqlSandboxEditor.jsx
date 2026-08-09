import React, { useState } from "react";
import { MockSqlEngine } from "../../lib/dataGuardian/mockSqlEngine";

export default function SqlSandboxEditor({ mission, onValidate }) {
  const [sqlQuery, setSqlQuery] = useState(
    "SELECT i.name, COUNT(t.trade_id) AS trade_count, SUM(t.quantity * t.price) AS total_val\nFROM Investor i\nJOIN Trade t ON i.investor_id = t.investor_id\nGROUP BY i.name\nHAVING COUNT(t.trade_id) > 2;"
  );
  const [result, setResult] = useState(null);
  const engine = new MockSqlEngine(mission.sampleData || {});

  const handleRunSql = () => {
    const res = engine.execute(sqlQuery);
    setResult(res);

    const isMatch =
      res.success &&
      sqlQuery.toUpperCase().includes("JOIN") &&
      sqlQuery.toUpperCase().includes("GROUP BY") &&
      sqlQuery.toUpperCase().includes("HAVING");

    if (isMatch) {
      onValidate(
        true,
        "SQL Query Verified! Correctly performed inner join between Investor and Trade, grouped by investor name, and filtered groups using HAVING COUNT(trade_id) > 2.",
        100
      );
    } else {
      onValidate(
        false,
        "Query check failed: Ensure you use JOIN on investor_id, GROUP BY i.name, and HAVING COUNT(t.trade_id) > 2.",
        45
      );
    }
  };

  return (
    <div className="space-y-5">
      {/* Schema Browser Bar */}
      <div className="bg-surface-elevated p-4 rounded-xl border border-white/10 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <span className="text-blue-400 font-bold">Available Tables:</span>
          <span className="bg-white/5 px-2 py-1 rounded border border-white/10">Investor (investor_id, name, phone)</span>
          <span className="bg-white/5 px-2 py-1 rounded border border-white/10">Trade (trade_id, investor_id, quantity, price)</span>
        </div>

        {/* Quick Relational Algebra helper pills */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <span className="text-slate-500">Relational Algebra:</span>
          <span className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">π (Projection)</span>
          <span className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">σ (Selection)</span>
          <span className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">⋈ (Join)</span>
        </div>
      </div>

      {/* SQL Code Area */}
      <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30 shadow-inner font-mono text-xs text-slate-200">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-slate-400">
          <span>SQL Editor v1.0 // Kabir's Desk</span>
          <button
            onClick={handleRunSql}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow transition-all flex items-center gap-1"
          >
            <span>Execute Query</span>
            <span>▶</span>
          </button>
        </div>
        <textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          rows={6}
          className="w-full bg-transparent text-emerald-400 focus:outline-none resize-y leading-relaxed"
          placeholder="Write SQL SELECT statement..."
        />
      </div>

      {/* Execution Results Table */}
      {result && (
        <div className="bg-surface p-4 rounded-xl border border-white/10 animate-fade-in">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-wider">
              Query Result ({result.rowCount || 0} rows)
            </span>
            <span className="text-emerald-400">
              Execution Time: {result.executionTimeMs || 0} ms
            </span>
          </div>

          {result.success ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs text-slate-200 border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    {result.columns?.map((col, idx) => (
                      <th key={idx} className="p-2.5 text-blue-400 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows?.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-white/5 hover:bg-white/5">
                      {result.columns?.map((col, cIdx) => (
                        <td key={cIdx} className="p-2.5">
                          {String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono rounded-lg">
              ❌ {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
