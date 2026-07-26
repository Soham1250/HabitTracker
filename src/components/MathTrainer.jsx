import { useState, useEffect, useRef } from "react";

// Helper functions for question generation
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function MathTrainer() {
  const [category, setCategory] = useState("tables"); // "tables" | "squares" | "cubes" | "mixed"
  const [selectedTable, setSelectedTable] = useState("all"); // "all" or specific number "1".."30"
  const [includeReverse, setIncludeReverse] = useState(false); // Square Roots / Cube Roots toggle

  const [timingMode, setTimingMode] = useState("untimed"); // "untimed" | "timed"
  const [isGameActive, setIsGameActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);

  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null); // { status: "correct" | "incorrect", text: string }
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showReference, setShowReference] = useState(false);
  const [refTab, setRefTab] = useState("tables"); // "tables" | "squares" | "cubes"
  const [refSearch, setRefSearch] = useState("");

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Generate a random math question based on settings
  const generateQuestion = (cat = category, tbl = selectedTable, rev = includeReverse, lastQuestion = null) => {
    let activeCat = cat;
    if (cat === "mixed") {
      const cats = ["tables", "squares", "cubes"];
      activeCat = cats[Math.floor(Math.random() * cats.length)];
    }

    let promptObj = null;
    let attempts = 0;

    do {
      if (activeCat === "tables") {
        const num1 = tbl === "all" ? getRandomInt(1, 30) : parseInt(tbl, 10);
        const num2 = getRandomInt(1, 10); // Standard multiplication up to 10
        promptObj = {
          question: `${num1} × ${num2}`,
          answer: `${num1 * num2}`,
          type: "tables",
          label: `Multiplication Table (${num1})`,
        };
      } else if (activeCat === "squares") {
        const isReverseQuestion = rev && Math.random() > 0.5;
        const n = getRandomInt(1, 50);
        const sq = n * n;

        if (isReverseQuestion) {
          promptObj = {
            question: `Square Root of ${sq}`,
            answer: `${n}`,
            type: "square_root",
            label: "Find the root",
          };
        } else {
          promptObj = {
            question: `Square of ${n}`,
            answer: `${sq}`,
            type: "square",
            label: "Calculate square",
          };
        }
      } else if (activeCat === "cubes") {
        const isReverseQuestion = rev && Math.random() > 0.5;
        const n = getRandomInt(1, 20);
        const cb = n * n * n;

        if (isReverseQuestion) {
          promptObj = {
            question: `Cube Root of ${cb}`,
            answer: `${n}`,
            type: "cube_root",
            label: "Find the root",
          };
        } else {
          promptObj = {
            question: `Cube of ${n}`,
            answer: `${cb}`,
            type: "cube",
            label: "Calculate cube",
          };
        }
      }
      attempts++;
    } while (
      lastQuestion &&
      lastQuestion.question === promptObj?.question &&
      attempts < 10
    );

    return promptObj;
  };

  // Reset practice round or initialize
  const resetPractice = (cat = category, tbl = selectedTable, rev = includeReverse, timing = timingMode) => {
    setFeedback(null);
    setUserAnswer("");
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setTimeLeft(60);

    const firstQuestion = generateQuestion(cat, tbl, rev);
    setCurrentPrompt(firstQuestion);

    if (timing === "timed") {
      setIsGameActive(false); // Wait for user to click Start
    } else {
      setIsGameActive(true);
    }
  };

  // On settings change
  useEffect(() => {
    resetPractice(category, selectedTable, includeReverse, timingMode);
  }, [category, selectedTable, includeReverse, timingMode]);

  // Handle timer countdown for speed test
  useEffect(() => {
    if (timingMode === "timed" && isGameActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsGameActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [timingMode, isGameActive]);

  // Auto-focus input field
  useEffect(() => {
    if (isGameActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentPrompt, isGameActive]);

  const startTimedGame = () => {
    resetPractice(category, selectedTable, includeReverse, "timed");
    setIsGameActive(true);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isGameActive || !currentPrompt || !userAnswer.trim()) return;

    const formattedAnswer = userAnswer.trim();
    const isCorrect = formattedAnswer === currentPrompt.answer;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      setFeedback({
        status: "correct",
        text: `Correct! ${currentPrompt.question} = ${currentPrompt.answer}`,
      });
    } else {
      setStreak(0);
      setScore((prev) => ({ correct: prev.correct, total: prev.total + 1 }));
      setFeedback({
        status: "incorrect",
        text: `Incorrect! ${currentPrompt.question} = ${currentPrompt.answer}`,
      });
    }

    setUserAnswer("");
    const nextQ = generateQuestion(category, selectedTable, includeReverse, currentPrompt);
    setCurrentPrompt(nextQ);
  };

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header controls & Category selectors */}
      <div className="bg-surface-elevated p-4 rounded-xl border border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold font-mono text-white tracking-wide">
              Math & Numbers Skills Trainer
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Master Multiplication Tables (1-30), Squares (1-50), and Cubes (1-20)
            </p>
          </div>

          <button
            onClick={() => setShowReference(!showReference)}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700/60 text-xs font-mono text-slate-300 transition-all flex items-center gap-1.5"
          >
            <span>{showReference ? "Hide Reference" : "📘 Reference Chart"}</span>
          </button>
        </div>

        {/* Interactive Reference Sheet Modal */}
        {showReference && (
          <div className="p-4 rounded-xl bg-slate-900/95 border border-slate-800 animate-fade-in space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex bg-slate-950 p-1 rounded-lg border border-white/5 gap-1">
                <button
                  onClick={() => setRefTab("tables")}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    refTab === "tables"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Tables (1-30)
                </button>
                <button
                  onClick={() => setRefTab("squares")}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    refTab === "squares"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Squares (1-50)
                </button>
                <button
                  onClick={() => setRefTab("cubes")}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    refTab === "cubes"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Cubes (1-20)
                </button>
              </div>

              <input
                type="text"
                value={refSearch}
                onChange={(e) => setRefSearch(e.target.value)}
                placeholder="Search number (e.g. 17 or 24)..."
                className="px-3 py-1 bg-slate-950 border border-white/10 rounded text-xs font-mono text-white focus:outline-none focus:border-emerald-500 w-full sm:w-52"
              />
            </div>

            {/* Reference Table Content */}
            <div className="max-h-72 overflow-y-auto pr-1">
              {refTab === "tables" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Array.from({ length: 30 }, (_, i) => i + 1)
                    .filter((tbl) => !refSearch || `${tbl}`.includes(refSearch.trim()))
                    .map((tbl) => (
                      <div
                        key={tbl}
                        className="p-3 rounded-lg bg-slate-800/60 border border-white/5 font-mono text-xs space-y-1"
                      >
                        <div className="font-bold text-emerald-400 border-b border-white/10 pb-1 mb-1">
                          Table of {tbl}
                        </div>
                        {Array.from({ length: 10 }, (_, j) => j + 1).map((multiplier) => (
                          <div key={multiplier} className="flex justify-between text-slate-300">
                            <span>{tbl} × {multiplier}</span>
                            <span className="font-bold text-white">{tbl * multiplier}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              )}

              {refTab === "squares" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {Array.from({ length: 50 }, (_, i) => i + 1)
                    .filter((n) => !refSearch || `${n}`.includes(refSearch.trim()) || `${n * n}`.includes(refSearch.trim()))
                    .map((n) => (
                      <div
                        key={n}
                        className="p-2 rounded bg-slate-800/60 border border-white/5 font-mono text-xs text-center flex flex-col justify-center"
                      >
                        <span className="text-slate-400 text-[10px]">Square of {n}</span>
                        <span className="font-bold text-emerald-400 text-sm mt-0.5">{n * n}</span>
                      </div>
                    ))}
                </div>
              )}

              {refTab === "cubes" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {Array.from({ length: 20 }, (_, i) => i + 1)
                    .filter((n) => !refSearch || `${n}`.includes(refSearch.trim()) || `${n * n * n}`.includes(refSearch.trim()))
                    .map((n) => (
                      <div
                        key={n}
                        className="p-2.5 rounded bg-slate-800/60 border border-white/5 font-mono text-xs text-center flex flex-col justify-center"
                      >
                        <span className="text-slate-400 text-[10px]">Cube of {n}</span>
                        <span className="font-bold text-purple-400 text-sm mt-0.5">{n * n * n}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-white/5">
          {/* Category Selector */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="flex bg-slate-900/80 p-1 rounded-lg border border-white/5 gap-1">
              <button
                onClick={() => setCategory("tables")}
                className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${
                  category === "tables"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Tables
              </button>
              <button
                onClick={() => setCategory("squares")}
                className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${
                  category === "squares"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Squares
              </button>
              <button
                onClick={() => setCategory("cubes")}
                className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${
                  category === "cubes"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Cubes
              </button>
              <button
                onClick={() => setCategory("mixed")}
                className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${
                  category === "mixed"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Mixed
              </button>
            </div>
          </div>

          {/* Context Options (Table Filter or Root Toggle) */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              {category === "tables" ? "Filter Table" : "Options"}
            </label>
            {category === "tables" ? (
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/5 text-xs font-mono text-emerald-400 p-1.5 rounded-lg focus:outline-none"
              >
                <option value="all">All Tables (1 to 30)</option>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={`${n}`}>
                    Table of {n}
                  </option>
                ))}
              </select>
            ) : (category === "squares" || category === "cubes") ? (
              <button
                onClick={() => setIncludeReverse(!includeReverse)}
                className={`w-full py-1.5 px-3 rounded-lg border text-xs font-mono transition-all flex items-center justify-between ${
                  includeReverse
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold"
                    : "bg-slate-900/80 text-slate-400 border-white/5 hover:text-white"
                }`}
              >
                <span>Include Roots (√ / ∛)</span>
                <span>{includeReverse ? "ON" : "OFF"}</span>
              </button>
            ) : (
              <div className="py-1.5 text-xs font-mono text-slate-500">All topics enabled</div>
            )}
          </div>

          {/* Timing Mode Selector */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Session Type
            </label>
            <div className="flex bg-slate-900/80 p-1 rounded-lg border border-white/5 gap-1">
              <button
                onClick={() => setTimingMode("untimed")}
                className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${
                  timingMode === "untimed"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Untimed
              </button>
              <button
                onClick={() => setTimingMode("timed")}
                className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${
                  timingMode === "timed"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                60s Speed Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-surface-elevated p-3 rounded-xl border border-white/5 text-center">
          <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Correct
          </span>
          <span className="text-xl font-bold font-mono text-emerald-400">
            {score.correct}
          </span>
        </div>

        <div className="bg-surface-elevated p-3 rounded-xl border border-white/5 text-center">
          <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Accuracy
          </span>
          <span className="text-xl font-bold font-mono text-blue-400">
            {accuracy}%
          </span>
        </div>

        <div className="bg-surface-elevated p-3 rounded-xl border border-white/5 text-center">
          <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Current Streak
          </span>
          <span className="text-xl font-bold font-mono text-amber-400">
            🔥 {streak}
          </span>
        </div>

        <div className="bg-surface-elevated p-3 rounded-xl border border-white/5 text-center">
          <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            {timingMode === "timed" ? "Time Left" : "Total Solved"}
          </span>
          <span
            className={`text-xl font-bold font-mono ${
              timingMode === "timed" && timeLeft <= 10
                ? "text-red-400 animate-pulse"
                : "text-purple-400"
            }`}
          >
            {timingMode === "timed" ? `${timeLeft}s` : score.total}
          </span>
        </div>
      </div>

      {/* Main Game Card */}
      <div className="bg-surface-elevated p-6 md:p-10 rounded-2xl border border-white/10 text-center space-y-6 shadow-xl relative overflow-hidden">
        {timingMode === "timed" && !isGameActive ? (
          /* Speed Test Start / Finish Screen */
          <div className="py-6 space-y-5 animate-fade-in">
            {timeLeft === 0 ? (
              <>
                <div className="inline-block p-3 rounded-full bg-amber-500/10 text-amber-400 mb-2">
                  <span className="text-2xl font-mono">⏰ Time's Up!</span>
                </div>
                <h3 className="text-2xl font-bold text-white font-mono">
                  Final Score: {score.correct} Correct
                </h3>
                <p className="text-sm font-mono text-slate-400">
                  Accuracy: {accuracy}% ({score.correct}/{score.total}) | Max Streak: {bestStreak}
                </p>
                <button
                  onClick={startTimedGame}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold font-mono uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Try Speed Test Again
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white font-mono">
                  Ready for 60-Second Speed Test?
                </h3>
                <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
                  Test your mathematical calculation speed under time pressure. Answer as many questions as possible in 60 seconds!
                </p>
                <button
                  onClick={startTimedGame}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold font-mono uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Start Speed Test
                </button>
              </>
            )}
          </div>
        ) : (
          /* Active Question Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">
                {currentPrompt?.label}
              </span>
              <div className="text-5xl md:text-7xl font-extrabold font-mono text-emerald-400 tracking-wider py-4">
                {currentPrompt?.question}
              </div>
            </div>

            {/* Answer Input */}
            <div className="max-w-xs mx-auto">
              <input
                ref={inputRef}
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter answer..."
                autoFocus
                className="w-full px-4 py-3 bg-slate-950/80 border-2 border-white/20 focus:border-emerald-500 text-center font-mono text-2xl text-white rounded-xl outline-none transition-all placeholder:text-slate-600 tracking-widest shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-sm uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20"
              >
                Submit Answer ↵
              </button>
              <button
                type="button"
                onClick={() => resetPractice(category, selectedTable, includeReverse, timingMode)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Reset
              </button>
            </div>

            {/* Feedback notification */}
            {feedback && (
              <div
                className={`py-2 px-4 rounded-lg font-mono text-xs max-w-sm mx-auto transition-all animate-fade-in ${
                  feedback.status === "correct"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {feedback.text}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
