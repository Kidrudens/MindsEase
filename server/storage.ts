import { 
  users, entries,
  type User, type InsertUser,
  type Entry, type InsertEntry
} from "@shared/schema";
import { db } from "./db";
import { eq, and, between, desc } from "drizzle-orm";
import { format } from "date-fns";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Entry operations
  getEntry(id: number): Promise<Entry | undefined>;
  getEntriesByUserId(userId: number): Promise<Entry[]>;
  getEntriesByDate(userId: number, date: Date): Promise<Entry[]>;
  createEntry(entry: InsertEntry): Promise<Entry>;
  updateEntry(id: number, entry: Partial<InsertEntry>): Promise<Entry | undefined>;
  deleteEntry(id: number): Promise<boolean>;
  
  // Get entries for a date range
  getEntriesInDateRange(userId: number, startDate: Date, endDate: Date): Promise<Entry[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Entry operations
  async getEntry(id: number): Promise<Entry | undefined> {
    const result = await db.select().from(entries).where(eq(entries.id, id));
    return result[0];
  }

  async getEntriesByUserId(userId: number): Promise<Entry[]> {
    return db
      .select()
      .from(entries)
      .where(eq(entries.userId, userId))
      .orderBy(desc(entries.date));
  }

  async getEntriesByDate(userId: number, date: Date): Promise<Entry[]> {
    // Format date to match the database format (YYYY-MM-DD)
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    return db
      .select()
      .from(entries)
      .where(
        and(
          eq(entries.userId, userId),
          eq(entries.date, formattedDate)
        )
      );
  }

  async createEntry(insertEntry: InsertEntry): Promise<Entry> {
    // Convert Date objects to ISO strings for database compatibility
    const formattedEntry = {
      ...insertEntry,
      date: format(insertEntry.date, 'yyyy-MM-dd')
    };
    
    const result = await db.insert(entries).values(formattedEntry).returning();
    return result[0];
  }

  async updateEntry(id: number, entryUpdate: Partial<InsertEntry>): Promise<Entry | undefined> {
    // Format date if it exists in the update
    const formattedUpdate = entryUpdate.date
      ? { ...entryUpdate, date: format(entryUpdate.date, 'yyyy-MM-dd') }
      : entryUpdate;
    
    const result = await db
      .update(entries)
      .set(formattedUpdate)
      .where(eq(entries.id, id))
      .returning();
    
    return result[0];
  }

  async deleteEntry(id: number): Promise<boolean> {
    const result = await db
      .delete(entries)
      .where(eq(entries.id, id))
      .returning({ id: entries.id });
    
    return result.length > 0;
  }

  async getEntriesInDateRange(userId: number, startDate: Date, endDate: Date): Promise<Entry[]> {
    // Format dates for database compatibility
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');
    
    return db
      .select()
      .from(entries)
      .where(
        and(
          eq(entries.userId, userId),
          between(entries.date, formattedStartDate, formattedEndDate)
        )
      )
      .orderBy(desc(entries.date));
  }
}

// Create a singleton instance - temporarily using MemStorage due to database connectivity issues
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private entries: Map<number, Entry>;
  private userCurrentId: number;
  private entryCurrentId: number;

  constructor() {
    this.users = new Map();
    this.entries = new Map();
    this.userCurrentId = 1;
    this.entryCurrentId = 1;
    
    // Create default test user
    this.users.set(1, { id: 1, username: "testuser", password: "password" });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Entry operations
  async getEntry(id: number): Promise<Entry | undefined> {
    return this.entries.get(id);
  }

  async getEntriesByUserId(userId: number): Promise<Entry[]> {
    return Array.from(this.entries.values())
      .filter((entry) => entry.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getEntriesByDate(userId: number, date: Date): Promise<Entry[]> {
    const dateString = date.toISOString().split('T')[0];
    
    return Array.from(this.entries.values())
      .filter((entry) => {
        const entryDateString = new Date(entry.date).toISOString().split('T')[0];
        return entry.userId === userId && entryDateString === dateString;
      });
  }

  async createEntry(insertEntry: InsertEntry): Promise<Entry> {
    const id = this.entryCurrentId++;
    const now = new Date();
    const entry: Entry = { 
      ...insertEntry, 
      id, 
      createdAt: now
    };
    
    this.entries.set(id, entry);
    return entry;
  }

  async updateEntry(id: number, entryUpdate: Partial<InsertEntry>): Promise<Entry | undefined> {
    const existingEntry = this.entries.get(id);
    
    if (!existingEntry) {
      return undefined;
    }
    
    const updatedEntry: Entry = {
      ...existingEntry,
      ...entryUpdate,
    };
    
    this.entries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteEntry(id: number): Promise<boolean> {
    return this.entries.delete(id);
  }

  async getEntriesInDateRange(userId: number, startDate: Date, endDate: Date): Promise<Entry[]> {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    
    return Array.from(this.entries.values())
      .filter((entry) => {
        const entryTime = new Date(entry.date).getTime();
        return entry.userId === userId && entryTime >= startTime && entryTime <= endTime;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

export const storage = new MemStorage();
