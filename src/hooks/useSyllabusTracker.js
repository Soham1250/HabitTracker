import { useMemo, useCallback } from "react";
import { QUANT_SYLLABUS, REASONING_SEQUENTIAL, IT_SYLLABUS } from "../lib/syllabus";

// Isolated storage key for Syllabus Tracker
export const SYLLABUS_STORAGE_KEY = "habit_tracker_syllabus_state";

export function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const defaultState = {
  topics: {}, // topicId -> { consecutiveDays: number, isMastered: boolean }
  streaks: {}, // topicId -> currentStreak (number)
  completedChapters: [], // [{ chapterId, title, completedAt: string }]
  lastUpdatedDate: getTodayKey(),
};

// Initialize default state for all sequential topics if not present
export function initializeTopics(state) {
  const newState = { ...(state || {}) };
  if (!newState.topics) newState.topics = {};
  if (!newState.streaks) newState.streaks = {};
  if (!newState.completedChapters) newState.completedChapters = [];
  
  const allSequential = [
    ...QUANT_SYLLABUS.flatMap(p => p.topics),
    ...REASONING_SEQUENTIAL.flatMap(p => p.topics),
    ...IT_SYLLABUS.flatMap(p => p.topics)
  ];
  
  allSequential.forEach(t => {
    if (!newState.topics[t.id]) {
      newState.topics[t.id] = { consecutiveDays: 0, isMastered: false };
    }
  });
  
  return newState;
}

export function mergeSyllabusStates(remoteState, localState) {
  let base = remoteState;
  if (!base || (!base.topics && !base.completedChapters)) {
    base = localState || defaultState;
  }
  const merged = initializeTopics(base);

  if (localState) {
    if (localState.completedChapters && Array.isArray(localState.completedChapters)) {
      const existingIds = new Set(merged.completedChapters.map(c => c.chapterId));
      localState.completedChapters.forEach(ch => {
        if (!existingIds.has(ch.chapterId)) {
          merged.completedChapters.push(ch);
        }
      });
    }
    if (localState.topics) {
      Object.keys(localState.topics).forEach(topicId => {
        const localTopic = localState.topics[topicId];
        const remoteTopic = merged.topics[topicId] || { consecutiveDays: 0, isMastered: false };
        merged.topics[topicId] = {
          consecutiveDays: Math.max(localTopic.consecutiveDays || 0, remoteTopic.consecutiveDays || 0),
          isMastered: localTopic.isMastered || remoteTopic.isMastered || false,
        };
      });
    }
    if (localState.streaks) {
      Object.keys(localState.streaks).forEach(topicId => {
        const localStreak = localState.streaks[topicId] || 0;
        const remoteStreak = merged.streaks[topicId] || 0;
        merged.streaks[topicId] = Math.max(localStreak, remoteStreak);
      });
    }
  }

  return merged;
}

export function useSyllabusTracker(syllabusState, updateSyllabusState) {
  const state = useMemo(() => {
    return initializeTopics(syllabusState || defaultState);
  }, [syllabusState]);

  // Mark a successful day for a sequential topic
  const incrementTopicDay = useCallback((topicId, title) => {
    const topicData = state.topics[topicId] || { consecutiveDays: 0, isMastered: false };
    
    // If already mastered, do nothing
    if (topicData.isMastered) return;

    let newConsecutiveDays = topicData.consecutiveDays + 1;
    let isMastered = false;
    const newCompletedChapters = [...(state.completedChapters || [])];

    if (newConsecutiveDays >= 3) {
      isMastered = true;
      if (!newCompletedChapters.some(c => c.chapterId === topicId)) {
        newCompletedChapters.unshift({
          chapterId: topicId,
          title: title,
          completedAt: new Date().toISOString(),
        });
      }
    }

    const nextSyllabusState = {
      ...state,
      topics: {
        ...state.topics,
        [topicId]: {
          consecutiveDays: newConsecutiveDays,
          isMastered,
        }
      },
      completedChapters: newCompletedChapters,
      lastUpdatedDate: getTodayKey(),
    };

    if (updateSyllabusState) {
      updateSyllabusState(nextSyllabusState);
    }
  }, [state, updateSyllabusState]);

  // Reset progress for a topic (if they fail the 90% Vanguard Metric)
  const resetTopicDay = useCallback((topicId) => {
    const topicData = state.topics[topicId];
    if (!topicData || topicData.isMastered) return;

    const nextSyllabusState = {
      ...state,
      topics: {
        ...state.topics,
        [topicId]: { ...topicData, consecutiveDays: 0 }
      }
    };

    if (updateSyllabusState) {
      updateSyllabusState(nextSyllabusState);
    }
  }, [state, updateSyllabusState]);

  // Increment continuous loop streak
  const incrementContinuousStreak = useCallback((topicId) => {
    const currentStreak = (state.streaks && state.streaks[topicId]) || 0;
    const nextSyllabusState = {
      ...state,
      streaks: {
        ...state.streaks,
        [topicId]: currentStreak + 1
      }
    };

    if (updateSyllabusState) {
      updateSyllabusState(nextSyllabusState);
    }
  }, [state, updateSyllabusState]);

  // Decrement or reset continuous loop streak
  const resetContinuousStreak = useCallback((topicId) => {
    const nextSyllabusState = {
      ...state,
      streaks: {
        ...state.streaks,
        [topicId]: 0
      }
    };

    if (updateSyllabusState) {
      updateSyllabusState(nextSyllabusState);
    }
  }, [state, updateSyllabusState]);

  return {
    state,
    isLoading: false,
    incrementTopicDay,
    resetTopicDay,
    incrementContinuousStreak,
    resetContinuousStreak
  };
}
