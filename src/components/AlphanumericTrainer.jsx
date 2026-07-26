import { useState, useEffect, useRef } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getLetterForNumber = (num) => ALPHABET[num - 1];
const getNumberForLetter = (letter) => ALPHABET.indexOf(letter.toUpperCase()) + 1;

export default function AlphanumericTrainer() {
  const [mode, setMode] = useState("numToAlpha"); // "numToAlpha" | "alphaToNum" | "mixed"
  const [timingMode, setTimingMode] = useState("untimed"); // "untimed" | "timed"
  const [isGameActive, setIsGameActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);

  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null); // { status: "correct" | "incorrect", text: string }
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showReference, setShowReference] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Generate a random question based on current mode
  const generateQuestion = (currentMode = mode, lastQuestion = null) => {
    let questionType = currentMode;
    if (currentMode === "mixed") {
      questionType = Math.random() > 0.5 ? "numToAlpha" : "alphaToNum";
    }

    let promptObj = null;
    let attempts = 0;

    do {
      if (questionType === "numToAlpha") {
        const num = Math.floor(Math.random() * 26) + 1;
        promptObj = {
          question: `${num}`,
          answer: getLetterForNumber(num),
          type: "numToAlpha",
          label: "What letter corresponds to this number?",
        };
      } else {
        const letter = ALPHABET[Math.floor(Math.random() * 26)];
        promptObj = {
          question: letter,
          answer: `${getNumberForLetter(letter)}`,
          type: "alphaToNum",
          label: "What number corresponds to this letter?",
        };
      }
      attempts++;
    } while (
      lastQuestion &&
      lastQuestion.question === promptObj.question &&
      attempts < 10
    );

    return promptObj;
  };

  // Start new practice round or initialize
  const resetPractice = (newMode = mode, newTimingMode = timingMode) => {
    setFeedback(null);
    setUserAnswer("");
    setScore({ correct: 0, total: 0 });
    setTimeLeft(60);

    const firstQuestion = generateQuestion(newMode);
    setCurrentPrompt(firstQuestion);

    if (newTimingMode === "timed") {
      setIsGameActive(false); // Wait for explicit Start click in timed mode
    } else {
      setIsGameActive(true);
    }
  };

  // On initial mount or mode switch
  useEffect(() => {
    resetPractice(mode, timingMode);
  }, [mode, timingMode]);

  // Handle timer countdown
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

  // Focus input when game starts or prompt changes
  useEffect(() => {
    if (isGameActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentPrompt, isGameActive]);

  const startTimedGame = () => {
    resetPractice(mode, "timed");
    setIsGameActive(true);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isGameActive || !currentPrompt || !userAnswer.trim()) return;

    const formattedAnswer = userAnswer.trim().toUpperCase();
    const isCorrect = formattedAnswer === currentPrompt.answer.toUpperCase();

    if (isCorrect) {
      setScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      setFeedback({
        status: "correct",
        text: `Correct! ${currentPrompt.question} = ${currentPrompt.answer}`,
      });
    } else {
      setScore((prev) => ({ correct: prev.correct, total: prev.total + 1 }));
      setFeedback({
        status: "incorrect",
        text: `Incorrect! ${currentPrompt.question} = ${currentPrompt.answer}`,
      });
    }

    setUserAnswer("");
    const nextQ = generateQuestion(mode, currentPrompt);
    setCurrentPrompt(nextQ);
  };

  const accuracy =
    score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header controls & Mode selectors */}
      <div className="bg-surface-elevated p-4 rounded-xl border border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold font-mono text-white tracking-wide">
              Alphanumeric Skills Trainer
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Master position-to-letter (1-26 ↔ A-Z) instant recall
            </p>
          </div>

          <button
            onClick={() => setShowReference(!showReference)}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700/60 text-xs font-mono text-slate-300 transition-all"
          >
            {showReference ? "Hide Reference" : "A-Z Reference"}
          </button>
        </div>

        {/* Quick Reference Table Modal/Drawer */}
        {showReference && (
          <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 animate-fade-in">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
              Alphabet Position Reference Chart
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
              {ALPHABET.map((char, index) => (
                <div
                  key={char}
                  className="flex flex-col items-center justify-center p-2 rounded bg-slate-800/80 border border-white/5 text-center"
                >
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {char}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/5">
          {/* Practice Mode Selector */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Practice Mode
            </label>
            <div className="flex bg-slate-900/80 p-1 rounded-lg border border-white/5 gap-1">
              <button
                onClick={() => setMode("numToAlpha")}
                className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${
                  mode === "numToAlpha"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                1-26 → A-Z
              </button>
              <button
                onClick={() => setMode("alphaToNum")}
                className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${
                  mode === "alphaToNum"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                A-Z → 1-26
              </button>
              <button
                onClick={() => setMode("mixed")}
                className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${
                  mode === "mixed"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Mixed
              </button>
            </div>
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
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Untimed Practice
              </button>
              <button
                onClick={() => setTimingMode("timed")}
                className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${
                  timingMode === "timed"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
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
      <div className="grid grid-cols-3 gap-3">
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
            {timingMode === "timed" ? "Time Remaining" : "Total Answered"}
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

      {/* Game Card */}
      <div className="bg-surface-elevated p-6 md:p-10 rounded-2xl border border-white/10 text-center space-y-6 shadow-xl relative overflow-hidden">
        {timingMode === "timed" && !isGameActive ? (
          /* Speed test start/end screen */
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
                  Accuracy: {accuracy}% ({score.correct}/{score.total})
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
                  Test your instant recall under pressure. Get as many correct
                  answers as possible before the clock hits zero!
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
          /* Active Question Card */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">
                {currentPrompt?.label}
              </span>
              <div className="text-6xl md:text-7xl font-extrabold font-mono text-emerald-400 tracking-wider py-4">
                {currentPrompt?.question}
              </div>
            </div>

            {/* Input Field */}
            <div className="max-w-xs mx-auto">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={
                  currentPrompt?.type === "numToAlpha"
                    ? "Enter letter (A-Z)"
                    : "Enter number (1-26)"
                }
                autoFocus
                className="w-full px-4 py-3 bg-slate-950/80 border-2 border-white/20 focus:border-emerald-500 text-center font-mono text-2xl text-white rounded-xl outline-none transition-all placeholder:text-slate-600 uppercase tracking-widest shadow-inner"
              />
            </div>

            {/* Action buttons */}
            <div className="flex justify-center items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-sm uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20"
              >
                Submit Answer ↵
              </button>
              <button
                type="button"
                onClick={() => resetPractice(mode, timingMode)}
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
