import React, { useState } from "react";
import DataGuardianApp from "./DataGuardianApp";

export default function MasterITHub() {
  const [selectedGame, setSelectedGame] = useState(null); // null | "data-guardian"

  if (selectedGame === "data-guardian") {
    return <DataGuardianApp onBackToHub={() => setSelectedGame(null)} />;
  }

  const subjectGames = [
    {
      id: "data-guardian",
      title: "SEBI Data Guardian",
      subject: "Database Management Systems (DBMS) & SQL",
      status: "PLAYABLE",
      badge: "SEBI Grade A IT Core",
      color: "from-blue-600 via-indigo-600 to-purple-700",
      borderColor: "border-blue-500/40 hover:border-blue-400",
      glowColor: "shadow-blue-500/10 hover:shadow-blue-500/25",
      icon: "🗄️",
      description: "Investigate market anomalies, build ER schemas, normalize trade relations, run live SQL queries, optimize B+ tree indexes, and prevent transaction deadlocks.",
      topics: ["ER Diagrams & Cardinality", "Functional Dependencies & 3NF", "SQL Joins & Subqueries", "B+ Tree Indexing", "ACID & Concurrency Locks"],
      chaptersCount: 8,
      examQuestionsCount: 8,
      estimatedTime: "2-3 Hours Campaign"
    },
    {
      id: "algo-surveillance",
      title: "Algorithm Surveillance Cell",
      subject: "Data Structures & Algorithms",
      status: "COMING SOON",
      badge: "Subject Module 2",
      color: "from-slate-800 to-slate-900",
      borderColor: "border-slate-800",
      glowColor: "",
      icon: "🌳",
      description: "Detect spoofing patterns using Binary Search Trees, Heaps, Graph algorithms, Dynamic Programming, and Time/Space complexity profiling.",
      topics: ["Trees & Graphs", "Sorting & Searching", "Dynamic Programming", "Algorithm Optimization"],
      chaptersCount: 6,
      estimatedTime: "Coming Q3 2026"
    },
    {
      id: "net-ops",
      title: "Network Operations Desk",
      subject: "Computer Networks & Protocols",
      status: "COMING SOON",
      badge: "Subject Module 3",
      color: "from-slate-800 to-slate-900",
      borderColor: "border-slate-800",
      glowColor: "",
      icon: "🌐",
      description: "Secure high-frequency market order routing across TCP/IP, OSI layers, routing protocols, subnets, packet filters, and TLS encryption.",
      topics: ["TCP/IP & OSI Layers", "Subnetting & Routing", "DNS & HTTP/S", "Network Security"],
      chaptersCount: 6,
      estimatedTime: "Coming Q3 2026"
    },
    {
      id: "os-kernel",
      title: "OS Kernel Lab",
      subject: "Operating Systems & Concurrency",
      status: "COMING SOON",
      badge: "Subject Module 4",
      color: "from-slate-800 to-slate-900",
      borderColor: "border-slate-800",
      glowColor: "",
      icon: "⚙️",
      description: "Prevent exchange order matching delays by managing CPU process scheduling, page replacement memory algorithms, semaphores, and inter-process communication.",
      topics: ["CPU Scheduling", "Virtual Memory & Paging", "Semaphores & Mutex", "File Systems"],
      chaptersCount: 5,
      estimatedTime: "Coming Q4 2026"
    },
    {
      id: "cyber-vanguard",
      title: "Cyber Defense Vanguard",
      subject: "Information & Cybersecurity",
      status: "COMING SOON",
      badge: "Subject Module 5",
      color: "from-slate-800 to-slate-900",
      borderColor: "border-slate-800",
      glowColor: "",
      icon: "🛡️",
      description: "Shield market data against SQL Injection, XSS, MITM attacks, and cryptographic vulnerabilities using RSA, AES, and digital signatures.",
      topics: ["Web Application Security", "Cryptography (RSA/AES)", "Authentication Protocols", "Malware Analysis"],
      chaptersCount: 5,
      estimatedTime: "Coming Q4 2026"
    },
    {
      id: "code-debugger",
      title: "Market Code Debugger",
      subject: "Programming Concepts & Logic Flow",
      status: "COMING SOON",
      badge: "Subject Module 6",
      color: "from-slate-800 to-slate-900",
      borderColor: "border-slate-800",
      glowColor: "",
      icon: "⌨️",
      description: "Debug regulatory automated trade matching code, trace dry-run loops, inspect memory pointers, and fix syntax and logic vulnerabilities.",
      topics: ["OOP Principles", "Control Flow & Recursion", "Dry Run Code Tracing", "Exception Handling"],
      chaptersCount: 6,
      estimatedTime: "Coming Q4 2026"
    }
  ];

  return (
    <div className="animate-fade-in text-slate-200">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/20 p-6 md:p-8 mb-8 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-mono font-medium tracking-wider uppercase">
                SEBI Grade A IT Officer Academy
              </span>
              <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Learning Engine
              </span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Master IT <span className="text-indigo-400 font-mono text-xl md:text-2xl font-semibold">// Subject Simulator Hub</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-3xl leading-relaxed">
              Interactive gamified learning modules designed specifically for the official SEBI Grade A Information Technology examination syllabus. Learn concepts by building, querying, and debugging market systems.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-surface-elevated/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shrink-0">
            <div className="text-center px-3 border-r border-white/10">
              <p className="text-2xl font-mono font-bold text-indigo-400">1/6</p>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Playable Modules</p>
            </div>
            <div className="text-center px-3">
              <p className="text-2xl font-mono font-bold text-emerald-400">8</p>
              <p className="text-[10px] font-mono text-slate-400 uppercase">DBMS Chapters</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Games Grid */}
      <div className="mb-6">
        <h2 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          Select Subject Learning Module
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectGames.map((game) => {
            const isPlayable = game.status === "PLAYABLE";
            return (
              <div
                key={game.id}
                className={`relative flex flex-col justify-between rounded-2xl bg-surface-elevated/90 border ${
                  isPlayable
                    ? `${game.borderColor} ${game.glowColor} shadow-lg transition-all duration-300 hover:-translate-y-1`
                    : "border-white/5 opacity-75"
                } p-6 overflow-hidden`}
              >
                {/* Background decorative gradient */}
                <div
                  className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${game.color} opacity-20 rounded-bl-full pointer-events-none`}
                />

                <div>
                  {/* Card Top Row */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-3xl">{game.icon}</span>
                    <span
                      className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        isPlayable
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {game.status}
                    </span>
                  </div>

                  {/* Title & Subject */}
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-xs font-mono text-indigo-400 font-medium mb-3">
                    {game.subject}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {game.description}
                  </p>

                  {/* Syllabus Topics Pill List */}
                  <div className="mb-6">
                    <p className="text-[10px] font-mono text-slate-500 uppercase mb-2">Key Topics Covered:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {game.topics.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10 px-2 py-0.5 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                  <span className="text-xs font-mono text-slate-500">
                    {game.estimatedTime}
                  </span>

                  {isPlayable ? (
                    <button
                      onClick={() => setSelectedGame(game.id)}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                    >
                      <span>Launch Mission</span>
                      <span>→</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 bg-slate-800 text-slate-500 font-mono text-xs rounded-xl border border-slate-700/50 cursor-not-allowed"
                    >
                      Under Development
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
