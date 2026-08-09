import React, { useState, useEffect } from "react";
import { SEBI_EXAM_QUESTIONS } from "../../lib/dataGuardian/examQuestions";

export default function ExamModeView({ gameState, setGameState }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minute timer
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreReport, setScoreReport] = useState(null);

  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const currentQ = SEBI_EXAM_QUESTIONS[currentQIndex];

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optIdx
    }));
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    SEBI_EXAM_QUESTIONS.forEach((q, idx) => {
      const userAns = selectedAnswers[idx];
      if (userAns === undefined) {
        unattemptedCount++;
      } else if (userAns === q.correctAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    // SEBI Grade A IT marking: +1 for correct, -0.25 for incorrect
    const finalMarks = Math.max(0, correctCount * 1.0 - wrongCount * 0.25);
    const percentage = Math.round((finalMarks / SEBI_EXAM_QUESTIONS.length) * 100);

    const report = {
      total: SEBI_EXAM_QUESTIONS.length,
      correctCount,
      wrongCount,
      unattemptedCount,
      finalMarks,
      percentage
    };

    setScoreReport(report);
    setIsSubmitted(true);

    // Save exam attempt in state
    setGameState((prev) => ({
      ...prev,
      examHistory: [
        ...(prev.examHistory || []),
        { date: new Date().toLocaleDateString(), marks: finalMarks, percentage }
      ]
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-surface-elevated p-5 rounded-2xl border border-indigo-500/30 shadow-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚖️</span> SEBI Grade A IT Exam Simulator
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Official Pattern: Timed DBMS & SQL Set • Marking: +1.0 Correct, -0.25 Negative
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="font-mono text-lg font-bold text-amber-400 bg-black/50 px-4 py-2 rounded-xl border border-amber-500/30">
            ⏳ {formatTime(timeLeft)}
          </div>
          {!isSubmitted && (
            <button
              onClick={handleSubmitExam}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold rounded-xl shadow transition-all"
            >
              Submit Exam
            </button>
          )}
        </div>
      </div>

      {/* Main Question Panel or Result Report */}
      {!isSubmitted ? (
        <div className="bg-surface-elevated p-6 rounded-2xl border border-white/10 space-y-6">
          {/* Question Counter Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
              Question {currentQIndex + 1} of {SEBI_EXAM_QUESTIONS.length}
            </span>
            <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-md">
              Topic: {currentQ.topic}
            </span>
          </div>

          {/* Question Text */}
          <p className="text-sm font-mono text-white leading-relaxed font-medium">
            {currentQ.question}
          </p>

          {/* Options */}
          <div className="space-y-3 font-mono text-xs">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQIndex] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-indigo-600 border-indigo-400 text-white font-bold shadow-lg"
                      : "bg-surface border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex((prev) => prev - 1)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-slate-300 font-mono text-xs rounded-xl border border-white/10"
            >
              ← Previous Question
            </button>

            <button
              disabled={currentQIndex === SEBI_EXAM_QUESTIONS.length - 1}
              onClick={() => setCurrentQIndex((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-mono text-xs font-bold rounded-xl shadow"
            >
              Next Question →
            </button>
          </div>
        </div>
      ) : (
        /* Score Report Screen */
        <div className="bg-surface-elevated p-8 rounded-2xl border border-indigo-500/30 space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">SEBI IT Exam Score Report</h3>
            <p className="text-4xl font-mono font-extrabold text-indigo-400 mt-2">
              {scoreReport?.finalMarks} / {scoreReport?.total} <span className="text-lg text-slate-400">({scoreReport?.percentage}%)</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 font-mono text-center text-xs">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-emerald-300">
              <p className="text-xl font-bold">{scoreReport?.correctCount}</p>
              <p className="uppercase text-[10px] mt-1 text-slate-400">Correct (+1.0)</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-300">
              <p className="text-xl font-bold">{scoreReport?.wrongCount}</p>
              <p className="uppercase text-[10px] mt-1 text-slate-400">Incorrect (-0.25)</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-amber-300">
              <p className="text-xl font-bold">{scoreReport?.unattemptedCount}</p>
              <p className="uppercase text-[10px] mt-1 text-slate-400">Unattempted</p>
            </div>
          </div>

          {/* Detailed Question Breakdown */}
          <div className="space-y-4 pt-4 border-t border-white/10 font-mono text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">Detailed Answer Key & Explanations:</h4>
            {SEBI_EXAM_QUESTIONS.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/30 text-slate-200"
                      : "bg-red-500/10 border-red-500/30 text-slate-200"
                  }`}
                >
                  <p className="font-bold text-white mb-2">Q{idx + 1}: {q.question}</p>
                  <p className="text-slate-400">Explanation: {q.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setSelectedAnswers({});
                setTimeLeft(600);
                setCurrentQIndex(0);
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg"
            >
              Re-attempt Practice Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
