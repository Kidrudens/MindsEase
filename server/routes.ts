import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEntrySchema, insertUserSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes prefix
  const apiRouter = app.route("/api");

  // GET current user (placeholder for auth)
  app.get("/api/user", async (req, res) => {
    // In a real app, this would use session/auth
    // For now, use a placeholder user
    const user = await storage.getUserByUsername("testuser");
    
    if (!user) {
      // Create a test user if it doesn't exist
      const newUser = await storage.createUser({
        username: "testuser",
        password: "password" // In a real app, this would be hashed
      });
      return res.json(newUser);
    }
    
    return res.json(user);
  });

  // Get all entries for a user
  app.get("/api/entries", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }
    
    const entries = await storage.getEntriesByUserId(userId);
    return res.json(entries);
  });

  // Get entries for a specific date
  app.get("/api/entries/date/:date", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    const dateParam = req.params.date;
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }
    
    try {
      const date = new Date(dateParam);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      
      const entries = await storage.getEntriesByDate(userId, date);
      return res.json(entries);
    } catch (error) {
      return res.status(400).json({ message: "Invalid date format" });
    }
  });

  // Get entries within a date range
  app.get("/api/entries/range", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date");
      }
      
      const entries = await storage.getEntriesInDateRange(userId, start, end);
      return res.json(entries);
    } catch (error) {
      return res.status(400).json({ message: "Invalid date format" });
    }
  });

  // Get a single entry by ID
  app.get("/api/entries/:id", async (req, res) => {
    const entryId = parseInt(req.params.id);
    
    if (isNaN(entryId)) {
      return res.status(400).json({ message: "Valid entry ID is required" });
    }
    
    const entry = await storage.getEntry(entryId);
    
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    
    return res.json(entry);
  });

  // Create a new entry
  app.post("/api/entries", async (req, res) => {
    try {
      const validatedEntry = insertEntrySchema.parse(req.body);
      const entry = await storage.createEntry(validatedEntry);
      return res.status(201).json(entry);
    } catch (error) {
      if (error instanceof Error) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(400).json({ message: "Invalid entry data" });
    }
  });

  // Update an existing entry
  app.put("/api/entries/:id", async (req, res) => {
    const entryId = parseInt(req.params.id);
    
    if (isNaN(entryId)) {
      return res.status(400).json({ message: "Valid entry ID is required" });
    }
    
    // Partial validation - only validate fields that are present
    try {
      const validFields = Object.keys(req.body).reduce((acc, key) => {
        acc[key] = insertEntrySchema.shape[key];
        return acc;
      }, {});
      
      const partialSchema = insertEntrySchema.partial();
      const validatedUpdate = partialSchema.parse(req.body);
      
      const updatedEntry = await storage.updateEntry(entryId, validatedUpdate);
      
      if (!updatedEntry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      
      return res.json(updatedEntry);
    } catch (error) {
      if (error instanceof Error) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(400).json({ message: "Invalid entry data" });
    }
  });

  // Delete an entry
  app.delete("/api/entries/:id", async (req, res) => {
    const entryId = parseInt(req.params.id);
    
    if (isNaN(entryId)) {
      return res.status(400).json({ message: "Valid entry ID is required" });
    }
    
    const deleted = await storage.deleteEntry(entryId);
    
    if (!deleted) {
      return res.status(404).json({ message: "Entry not found" });
    }
    
    return res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
