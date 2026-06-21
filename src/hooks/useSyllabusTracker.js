import { useState, useEffect, useCallback, useRef } from "react";
import { QUANT_SYLLABUS, REASONING_SEQUENTIAL } from "../lib/syllabus";

// Isolated storage key for Syllabus Tracker
const SYLLABUS_STORAGE_KEY = "habit_tracker_syllabus_state";

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const defaultState = {
  topics: {}, // topicId -> { consecutiveDays: number, isMastered: boolean }
  streaks: {}, // topicId -> currentStreak (number)
  completedChapters: [], // [{ chapterId, title, completedAt: string }]
  lastUpdatedDate: getTodayKey(),
};

// Initialize default state for all sequential topics if not present
function initializeTopics(state) {
  const newState = { ...state };
  if (!newState.topics) newState.topics = {};
  if (!newState.streaks) newState.streaks = {};
  if (!newState.completedChapters) newState.completedChapters = [];
  
  const allSequential = [
    ...QUANT_SYLLABUS.flatMap(p => p.topics),
    ...REASONING_SEQUENTIAL.flatMap(p => p.topics)
  ];
  
  allSequential.forEach(t => {
    if (!newState.topics[t.id]) {
      newState.topics[t.id] = { consecutiveDays: 0, isMastered: false };
    }
  });
  
  return newState;
}

export function useSyllabusTracker() {
  const [state, setState] = useState(defaultState);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SYLLABUS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState(initializeTopics(parsed));
      } else {
        setState(initializeTopics(defaultState));
      }
    } catch (err) {
      console.error("Failed to load syllabus state:", err);
      setState(initializeTopics(defaultState));
    } finally {
      setIsLoading(false);
      isInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (!isInitialized.current) return;
    localStorage.setItem(SYLLABUS_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Mark a successful day for a sequential topic
  const incrementTopicDay = useCallback((topicId, title) => {
    setState(prev => {
      const topicData = prev.topics[topicId] || { consecutiveDays: 0, isMastered: false };
      
      // If already mastered, do nothing
      if (topicData.isMastered) return prev;

      let newConsecutiveDays = topicData.consecutiveDays + 1;
      let isMastered = false;
      const newCompletedChapters = [...prev.completedChapters];

      if (newConsecutiveDays >= 3) {
        isMastered = true;
        // Check if we already logged it (safeguard)
        if (!newCompletedChapters.some(c => c.chapterId === topicId)) {
          newCompletedChapters.unshift({
            chapterId: topicId,
            title: title,
            completedAt: new Date().toISOString(),
          });
        }
      }

      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: {
            consecutiveDays: newConsecutiveDays,
            isMastered,
          }
        },
        completedChapters: newCompletedChapters,
        lastUpdatedDate: getTodayKey(),
      };
    });
  }, []);

  // Reset progress for a topic (if they fail the 90% Vanguard Metric)
  const resetTopicDay = useCallback((topicId) => {
    setState(prev => {
      const topicData = prev.topics[topicId];
      if (!topicData || topicData.isMastered) return prev;
      
      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: { ...topicData, consecutiveDays: 0 }
        }
      };
    });
  }, []);

  // Increment continuous loop streak
  const incrementContinuousStreak = useCallback((topicId) => {
    setState(prev => {
      const currentStreak = prev.streaks[topicId] || 0;
      return {
        ...prev,
        streaks: {
          ...prev.streaks,
          [topicId]: currentStreak + 1
        }
      };
    });
  }, []);

  // Decrement or reset continuous loop streak
  const resetContinuousStreak = useCallback((topicId) => {
    setState(prev => {
      return {
        ...prev,
        streaks: {
          ...prev.streaks,
          [topicId]: 0
        }
      };
    });
  }, []);

  return {
    state,
    isLoading,
    incrementTopicDay,
    resetTopicDay,
    incrementContinuousStreak,
    resetContinuousStreak
  };
}
