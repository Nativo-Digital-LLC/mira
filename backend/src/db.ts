import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Resolve DB path: prefer DATA_DIR env var (for Docker volumes), fallback to local data/
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'ups.db');
const db = new Database(DB_PATH);

// ── Schema ────────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS history (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    bcharge   REAL    NOT NULL,
    loadpct   REAL    NOT NULL,
    linev     REAL    NOT NULL,
    battv     REAL    NOT NULL,
    timeleft  REAL    NOT NULL,
    status    TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp   INTEGER NOT NULL,
    type        TEXT    NOT NULL,
    severity    TEXT    NOT NULL CHECK(severity IN ('info','warning','critical')),
    description TEXT    NOT NULL,
    value       TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_history_timestamp ON history(timestamp);
  CREATE INDEX IF NOT EXISTS idx_events_timestamp  ON events(timestamp);
`);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface HistoryEntry {
  id?: number;
  timestamp: number;
  bcharge: number;
  loadpct: number;
  linev: number;
  battv: number;
  timeleft: number;
  status: string;
}

export type EventSeverity = 'info' | 'warning' | 'critical';

export interface UPSEvent {
  id: number;
  timestamp: number;
  type: string;
  severity: EventSeverity;
  description: string;
  value?: string;
}

// ── Prepared statements ───────────────────────────────────────────────────────

const insertHistory = db.prepare<Omit<HistoryEntry, 'id'>>(`
  INSERT INTO history (timestamp, bcharge, loadpct, linev, battv, timeleft, status)
  VALUES (@timestamp, @bcharge, @loadpct, @linev, @battv, @timeleft, @status)
`);

const insertEvent = db.prepare<Omit<UPSEvent, 'id'>>(`
  INSERT INTO events (timestamp, type, severity, description, value)
  VALUES (@timestamp, @type, @severity, @description, @value)
`);

// ── Public API ────────────────────────────────────────────────────────────────

/** Save a new history snapshot */
export function saveHistory(entry: Omit<HistoryEntry, 'id'>): void {
  insertHistory.run(entry);
}

/** Returns history entries newer than `sinceMs` (epoch ms), limited to `limit` rows */
export function getHistory(sinceMs = 0, limit = 1440): HistoryEntry[] {
  return db.prepare<[number, number], HistoryEntry>(
    `SELECT * FROM history WHERE timestamp >= ? ORDER BY timestamp ASC LIMIT ?`
  ).all(sinceMs, limit) as HistoryEntry[];
}

/** Returns all history (last 24 h = 1440 entries) */
export function getAllHistory(): HistoryEntry[] {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  return getHistory(cutoff, 1440);
}

/** Save a new event and return its auto-incremented id */
export function saveEvent(event: Omit<UPSEvent, 'id'>): UPSEvent {
  const info = insertEvent.run(event);
  return { ...event, id: Number(info.lastInsertRowid) };
}

/** Returns the latest `limit` events, newest-first */
export function getEvents(limit = 200): UPSEvent[] {
  return db.prepare<[number], UPSEvent>(
    `SELECT * FROM events ORDER BY timestamp DESC LIMIT ?`
  ).all(limit) as UPSEvent[];
}

/** Find the last event of a given type (for dedup logic) */
export function getLastEventOfType(type: string): UPSEvent | undefined {
  return db.prepare<[string], UPSEvent>(
    `SELECT * FROM events WHERE type = ? ORDER BY timestamp DESC LIMIT 1`
  ).get(type) as UPSEvent | undefined;
}

/** Prune history older than 24 hours and events beyond the last 200 */
export function pruneOld(): void {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  db.prepare(`DELETE FROM history WHERE timestamp < ?`).run(cutoff);
  db.prepare(`
    DELETE FROM events WHERE id NOT IN (
      SELECT id FROM events ORDER BY timestamp DESC LIMIT 200
    )
  `).run();
}

console.log(`[SQLite] Database opened at ${DB_PATH}`);

export default db;
