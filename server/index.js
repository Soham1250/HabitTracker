import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// ── MongoDB Connection ────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "habit-tracker";
const COLLECTION = "state";

let db = null;

async function connectDB() {
  if (db) return db;
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(MONGODB_DB);
    console.log(`✓ Connected to MongoDB: ${MONGODB_DB}`);
    return db;
  } catch (err) {
    console.error("✗ MongoDB connection failed:", err.message);
    throw err;
  }
}

// ── Auth Middleware ──────────────────────────────────────
const USERNAME = process.env.userName?.trim();
const PASSWORD = process.env.pass?.trim();

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!USERNAME || !PASSWORD) {
    return res.status(500).json({ error: "Server auth not configured" });
  }
  if (username === USERNAME && password === PASSWORD) {
    // Generate token tying the session to the username
    const token = Buffer.from(username).toString("base64");
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const token = authHeader.split(" ")[1];
  const decodedUsername = Buffer.from(token, "base64").toString("ascii");

  if (decodedUsername === USERNAME) {
    req.user = decodedUsername;
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// ── API Routes ────────────────────────────────────────

/**
 * GET /api/state
 * Returns the current habit tracker state from MongoDB.
 */
app.get("/api/state", requireAuth, async (req, res) => {
  try {
    const database = await connectDB();
    const doc = await database.collection(COLLECTION).findOne({ _id: req.user });

    if (!doc) {
      // Return default state if no document exists
      return res.json({
        streakCount: 0,
        lastCompletedDate: null,
        history: {},
        milestones: [],
      });
    }

    // Remove MongoDB's _id field before sending
    const { _id, ...state } = doc;
    res.json(state);
  } catch (err) {
    console.error("GET /api/state error:", err.message);
    res.status(500).json({ error: "Failed to fetch state" });
  }
});

/**
 * PUT /api/state
 * Upserts the entire habit tracker state to MongoDB.
 */
app.put("/api/state", requireAuth, async (req, res) => {
  try {
    const state = req.body;

    // Validate basic structure
    if (typeof state.streakCount !== "number" || typeof state.history !== "object") {
      return res.status(400).json({ error: "Invalid state format" });
    }

    const database = await connectDB();
    await database.collection(COLLECTION).replaceOne(
      { _id: req.user },
      { _id: req.user, ...state },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("PUT /api/state error:", err.message);
    res.status(500).json({ error: "Failed to save state" });
  }
});

/**
 * DELETE /api/state
 * Resets the state in MongoDB (for clear data).
 */
app.delete("/api/state", requireAuth, async (req, res) => {
  try {
    const database = await connectDB();
    await database.collection(COLLECTION).deleteOne({ _id: req.user });
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/state error:", err.message);
    res.status(500).json({ error: "Failed to clear state" });
  }
});

// ── Health check ──────────────────────────────────────
app.get("/api/health", async (req, res) => {
  try {
    await connectDB();
    res.json({ status: "ok", db: "connected" });
  } catch {
    res.json({ status: "ok", db: "disconnected" });
  }
});

// ── Start Server ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n⚡ Habit Tracker API running on http://localhost:${PORT}`);
  console.log(`   Database: ${MONGODB_DB}`);
  console.log(`   Endpoints:`);
  console.log(`     GET    /api/state`);
  console.log(`     PUT    /api/state`);
  console.log(`     DELETE /api/state`);
  console.log(`     GET    /api/health\n`);
});
