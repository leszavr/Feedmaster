import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import mockData from "../client/src/data/mock-admin-data.json";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin API routes - serving mock data
  app.get("/api/admin/dashboard", (req, res) => {
    res.json(mockData.dashboard);
  });

  app.get("/api/admin/users", (req, res) => {
    res.json(mockData.users);
  });

  app.get("/api/admin/bots", (req, res) => {
    res.json(mockData.bots);
  });

  app.get("/api/admin/activity", (req, res) => {
    res.json(mockData.activity);
  });

  app.get("/api/admin/billing", (req, res) => {
    res.json(mockData.billing);
  });

  app.get("/api/admin/system", (req, res) => {
    res.json(mockData.system);
  });

  app.get("/api/admin/support", (req, res) => {
    res.json(mockData.support);
  });

  app.get("/api/admin/settings", (req, res) => {
    res.json(mockData.settings);
  });

  // TODO: Implement actual CRUD operations for admin panel
  // POST routes for creating/updating data
  // PUT routes for user actions (suspend, block, etc.)
  // DELETE routes for removing data

  const httpServer = createServer(app);
  return httpServer;
}
