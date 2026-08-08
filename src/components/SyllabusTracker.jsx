import { QUANT_SYLLABUS, REASONING_SEQUENTIAL, REASONING_CONTINUOUS, IT_SYLLABUS } from "../lib/syllabus";

const COLOR_MAPS = {
  amber: {
    masteredBg: "bg-amber-500/10 border-amber-500/30",
    masteredText: "text-amber-400 font-medium",
    badge: "bg-amber-500/20 text-amber-500 border-amber-500/30",
    dot: "bg-amber-500 border-amber-500",
    btn: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20",
  },
  cyan: {
    masteredBg: "bg-cyan-500/10 border-cyan-500/30",
    masteredText: "text-cyan-400 font-medium",
    badge: "bg-cyan-500/20 text-cyan-500 border-cyan-500/30",
    dot: "bg-cyan-500 border-cyan-500",
    btn: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 border-cyan-500/20",
  },
  emerald: {
    masteredBg: "bg-emerald-500/10 border-emerald-500/30",
    masteredText: "text-emerald-400 font-medium",
    badge: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
    dot: "bg-emerald-500 border-emerald-500",
    btn: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20",
  },
};

function SequentialTopic({ topic, topicState, onIncrement, onReset, accentColor = "amber" }) {
  const { consecutiveDays, isMastered } = topicState || { consecutiveDays: 0, isMastered: false };
  const colors = COLOR_MAPS[accentColor] || COLOR_MAPS.amber;

  return (
    <div className={`p-4 rounded-xl border transition-all ${isMastered ? colors.masteredBg : 'bg-surface/50 border-white/5 hover:border-white/10'}`}>
      <div className="flex items-center justify-between">
        <h4 className={`text-sm ${isMastered ? colors.masteredText : 'text-slate-300'}`}>
          {topic.title}
        </h4>
        
        {isMastered ? (
          <div className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded border ${colors.badge}`}>
            Mastered
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div 
                  key={i} 
                  className={`w-2.5 h-2.5 rounded-full border ${i < consecutiveDays ? colors.dot : 'border-slate-700 bg-transparent'}`}
                />
              ))}
            </div>
            <button 
              onClick={() => onReset(topic.id)}
              className="ml-2 w-6 h-6 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-xs"
              title="Reset Streak (Failed Metric)"
            >
              ✗
            </button>
            <button 
              onClick={() => onIncrement(topic.id, topic.title)}
              className={`w-6 h-6 rounded border flex items-center justify-center text-xs ${colors.btn}`}
              title="Add Day (Hit Vanguard Metric)"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ContinuousTopic({ topic, currentStreak, onIncrement, onReset }) {
  return (
    <div className="p-4 rounded-xl bg-surface/50 border border-white/5 hover:border-white/10 flex items-center justify-between">
      <h4 className="text-sm text-slate-300">{topic.title}</h4>
      <div className="flex items-center gap-3">
        <div className="text-xs font-mono text-cyan-400 tracking-wider">
          🔥 {currentStreak} Days
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onReset(topic.id)}
            className="w-6 h-6 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-xs"
          >
            0
          </button>
          <button 
            onClick={() => onIncrement(topic.id)}
            className="w-6 h-6 rounded bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 border border-cyan-500/20 flex items-center justify-center text-xs"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SyllabusTracker({ syllabusState, actions }) {
  const { topics, streaks } = syllabusState;
  const { incrementTopicDay, resetTopicDay, incrementContinuousStreak, resetContinuousStreak } = actions;

  const renderSequentialPhase = (phaseData, accentColor = "amber") => (
    <div key={phaseData.phase} className="mb-8">
      <div className="mb-3">
        <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">{phaseData.phase}</h3>
        <p className="text-[10px] text-slate-600 mt-1">{phaseData.description}</p>
      </div>
      <div className="flex flex-col gap-2">
        {phaseData.topics.map(topic => (
          <SequentialTopic 
            key={topic.id} 
            topic={topic} 
            topicState={topics[topic.id]} 
            onIncrement={incrementTopicDay}
            onReset={resetTopicDay}
            accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="mt-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quantitative Aptitude */}
        <div className="bg-surface-elevated p-6 rounded-2xl border border-white/5">
          <h2 className="text-sm font-mono text-amber-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-subtle"></span>
            Quant (Daksh Track)
          </h2>
          
          {QUANT_SYLLABUS.map(p => renderSequentialPhase(p, "amber"))}
        </div>

        {/* Middle Column: Reasoning Ability */}
        <div className="bg-surface-elevated p-6 rounded-2xl border border-white/5">
          <h2 className="text-sm font-mono text-cyan-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse-subtle"></span>
            Reasoning (Champions)
          </h2>

          <div className="mb-8">
            <div className="mb-3">
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Engine 1: Continuous Diet</h3>
              <p className="text-[10px] text-slate-600 mt-1">4 Sets Daily. Strictly Prelims/Moderate level.</p>
            </div>
            <div className="flex flex-col gap-2">
              {REASONING_CONTINUOUS.map(topic => (
                <ContinuousTopic 
                  key={topic.id} 
                  topic={topic}
                  currentStreak={streaks[topic.id] || 0}
                  onIncrement={incrementContinuousStreak}
                  onReset={resetContinuousStreak}
                />
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-white/5 my-8"></div>

          <div className="mb-4">
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Engine 2: Sequential Track</h3>
          </div>
          {REASONING_SEQUENTIAL.map(p => renderSequentialPhase(p, "cyan"))}

        </div>

        {/* Right Column: IT Domain */}
        <div className="bg-surface-elevated p-6 rounded-2xl border border-white/5">
          <h2 className="text-sm font-mono text-emerald-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-subtle"></span>
            IT Domain (Specialist Track)
          </h2>

          {IT_SYLLABUS.map(p => renderSequentialPhase(p, "emerald"))}
        </div>

      </div>
    </div>
  );
}
