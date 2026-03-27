import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

interface BriefingData {
  date: string;
  priorityCard: {
    items: Array<{ text: string; completed: boolean }>;
  };
  quickStats: {
    meetings: number;
    actionItems: number;
    blockers: number;
    overdue: number;
  };
  brutalTruth: string;
  meetings: Array<{
    title: string;
    date: string;
    summary: string;
    actionItems: string[];
  }>;
  proposedTodos: Array<{
    text: string;
    priority: 'P1' | 'P2' | 'P3';
    source: string;
    approved?: boolean;
  }>;
}

interface PriorityItem {
  text: string;
  completed: boolean;
}

export class StorageService {
  private db: Database.Database;
  private workspacePath: string;

  constructor() {
    this.workspacePath = process.env.WORKSPACE_PATH || '/Users/nuver/Desktop/cadence-os';
    const dbPath = path.join(this.workspacePath, 'webapp', 'data', 'cadence-os.db');
    
    // Ensure data directory exists
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.initTables();
  }

  private initTables(): void {
    // Briefings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS briefings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        data TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Priority items table (editable independently)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS priority_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        position INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index on date for faster lookups
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_briefings_date ON briefings(date)
    `);
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_priority_items_date ON priority_items(date)
    `);
  }

  // Briefing methods
  saveBriefing(briefing: BriefingData): void {
    const today = this.getTodayDate();
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO briefings (date, data)
      VALUES (?, ?)
    `);
    stmt.run(today, JSON.stringify(briefing));

    // Also update priority items from briefing
    if (briefing.priorityCard?.items) {
      this.savePriorityItems(briefing.priorityCard.items);
    }
  }

  getLatestBriefing(): BriefingData | null {
    const today = this.getTodayDate();
    const stmt = this.db.prepare(`
      SELECT data FROM briefings WHERE date = ?
    `);
    const row = stmt.get(today) as { data: string } | undefined;
    
    if (row) {
      return JSON.parse(row.data) as BriefingData;
    }
    return null;
  }

  getBriefingByDate(date: string): BriefingData | null {
    const stmt = this.db.prepare(`
      SELECT data FROM briefings WHERE date = ?
    `);
    const row = stmt.get(date) as { data: string } | undefined;
    
    if (row) {
      return JSON.parse(row.data) as BriefingData;
    }
    return null;
  }

  // Priority items methods (editable independently)
  savePriorityItems(items: PriorityItem[]): void {
    const today = this.getTodayDate();
    
    // Delete existing items for today
    const deleteStmt = this.db.prepare(`DELETE FROM priority_items WHERE date = ?`);
    deleteStmt.run(today);

    // Insert new items
    const insertStmt = this.db.prepare(`
      INSERT INTO priority_items (date, text, completed, position)
      VALUES (?, ?, ?, ?)
    `);

    items.forEach((item, index) => {
      insertStmt.run(today, item.text, item.completed ? 1 : 0, index);
    });
  }

  getPriorityItems(): PriorityItem[] {
    const today = this.getTodayDate();
    const stmt = this.db.prepare(`
      SELECT text, completed FROM priority_items 
      WHERE date = ? 
      ORDER BY position ASC
    `);
    const rows = stmt.all(today) as Array<{ text: string; completed: number }>;
    
    return rows.map(row => ({
      text: row.text,
      completed: row.completed === 1,
    }));
  }

  updatePriorityItem(index: number, completed: boolean): void {
    const today = this.getTodayDate();
    const stmt = this.db.prepare(`
      UPDATE priority_items SET completed = ? 
      WHERE date = ? AND position = ?
    `);
    stmt.run(completed ? 1 : 0, today, index);
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  close(): void {
    this.db.close();
  }
}
