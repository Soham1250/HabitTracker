/**
 * Storage layer for Habit Tracker.
 * Primary: MongoDB (via Express API) for cross-platform sync.
 * Fallback: localStorage as offline cache.
 * Includes JSON backup export/import.
 */

const STORAGE_KEY = "habit-tracker-data";
const API_BASE = "/api";

// ── Date Helpers ──────────────────────────────────────

/**
 * Returns today's date as "YYYY-MM-DD" in the user's local timezone.
 */
export function getTodayKey() {
  return formatDateKey(new Date());
}

/**
 * Formats a Date object as "YYYY-MM-DD".
 */
export function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ── Default State ─────────────────────────────────────

function getDefaultState() {
  return {
    streakCount: 0,
    lastCompletedDate: null,
    history: {},
    milestones: [],
  };
}

// ── MongoDB API Layer ─────────────────────────────────

/**
 * Fetches state from the MongoDB-backed API.
 * Falls back to localStorage if API is unreachable.
 */
export async function loadState() {
  try {
    const res = await fetch(`${API_BASE}/state`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const state = await res.json();
    // Cache in localStorage for offline fallback
    saveToLocalStorage(state);
    return normalizeState(state);
  } catch (err) {
    console.warn("MongoDB fetch failed, falling back to localStorage:", err.message);
    return loadFromLocalStorage();
  }
}

/**
 * Saves state to the MongoDB-backed API.
 * Also updates localStorage cache.
 */
export async function saveState(state) {
  // Always update localStorage cache immediately
  saveToLocalStorage(state);

  try {
    const res = await fetch(`${API_BASE}/state`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
  } catch (err) {
    console.warn("MongoDB save failed, data cached locally:", err.message);
  }
}

// ── localStorage Helpers (offline cache) ──────────────

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    return normalizeState(JSON.parse(raw));
  } catch {
    return getDefaultState();
  }
}

function saveToLocalStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}

function normalizeState(parsed) {
  return {
    streakCount: parsed.streakCount ?? 0,
    lastCompletedDate: parsed.lastCompletedDate ?? null,
    history: parsed.history ?? {},
    milestones: parsed.milestones ?? [],
  };
}

// ── Streak Reset Logic ────────────────────────────────

/**
 * Checks if the streak should be reset based on missed days.
 * - lastCompletedDate is today → streak is live
 * - lastCompletedDate is yesterday → streak survives
 * - Older → streak resets to 0
 */
export function checkMidnightReset(state) {
  if (!state.lastCompletedDate) {
    return { ...state, streakCount: 0 };
  }

  const today = getTodayKey();
  const yesterday = getYesterdayKey();

  if (state.lastCompletedDate === today) return state;
  if (state.lastCompletedDate === yesterday) return state;

  return { ...state, streakCount: 0 };
}

function getYesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDateKey(d);
}

// ── JSON Backup Export/Import ─────────────────────────

/**
 * Exports the current state as a JSON file download.
 */
export function exportBackup(state) {
  const jsonString = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonString], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  // Suppress beforeunload during download
  window.__exportingBackup = true;

  const a = document.createElement("a");
  const today = getTodayKey();
  a.href = url;
  a.download = `${today}.json`;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.__exportingBackup = false;
  }, 1000);
}

/**
 * Imports a backup JSON file and saves it to both MongoDB and localStorage.
 * Returns the new state if valid, or throws on invalid.
 */
export function importBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (
          typeof parsed.streakCount !== "number" ||
          typeof parsed.history !== "object"
        ) {
          reject(new Error("Invalid backup file format."));
          return;
        }
        const state = normalizeState(parsed);
        await saveState(state); // saves to both MongoDB + localStorage
        resolve(state);
      } catch {
        reject(new Error("Failed to parse backup file."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(file);
  });
}
