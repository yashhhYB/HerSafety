import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertEmergencyContactSchema, 
  insertIncidentSchema, 
  insertSosAlertSchema,
  insertUserSettingsSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Emergency contacts routes
  app.get("/api/emergency-contacts/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const contacts = await storage.getEmergencyContacts(userId);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emergency contacts" });
    }
  });

  app.post("/api/emergency-contacts", async (req, res) => {
    try {
      const validatedData = insertEmergencyContactSchema.parse(req.body);
      const contact = await storage.createEmergencyContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      res.status(400).json({ message: "Invalid emergency contact data" });
    }
  });

  app.put("/api/emergency-contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contact = await storage.updateEmergencyContact(id, req.body);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: "Failed to update contact" });
    }
  });

  app.delete("/api/emergency-contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteEmergencyContact(id);
      if (!deleted) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  // Incidents routes
  app.get("/api/incidents", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const incidents = await storage.getIncidents(limit);
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch incidents" });
    }
  });

  app.get("/api/incidents/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const incidents = await storage.getIncidentsByUser(userId);
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user incidents" });
    }
  });

  app.post("/api/incidents", async (req, res) => {
    try {
      const validatedData = insertIncidentSchema.parse(req.body);
      const incident = await storage.createIncident(validatedData);
      res.status(201).json(incident);
    } catch (error) {
      res.status(400).json({ message: "Invalid incident data" });
    }
  });

  // SOS alerts routes
  app.get("/api/sos-alerts/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const alerts = await storage.getSosAlerts(userId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SOS alerts" });
    }
  });

  app.post("/api/sos-alerts", async (req, res) => {
    try {
      const validatedData = insertSosAlertSchema.parse(req.body);
      const alert = await storage.createSosAlert(validatedData);
      
      // TODO: Here you would integrate with Twilio API to send SMS alerts
      // For now, we'll just simulate the alert creation
      
      res.status(201).json({ 
        ...alert, 
        message: "SOS alert sent successfully to emergency contacts" 
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create SOS alert" });
    }
  });

  app.patch("/api/sos-alerts/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const alert = await storage.updateSosAlertStatus(id, status);
      if (!alert) {
        return res.status(404).json({ message: "SOS alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to update SOS alert status" });
    }
  });

  // Safe zones routes
  app.get("/api/safe-zones", async (req, res) => {
    try {
      const type = req.query.type as string;
      const safeZones = type 
        ? await storage.getSafeZonesByType(type)
        : await storage.getSafeZones();
      res.json(safeZones);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch safe zones" });
    }
  });

  // User settings routes
  app.get("/api/user-settings/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      let settings = await storage.getUserSettings(userId);
      
      // Create default settings if none exist
      if (!settings) {
        const defaultSettings = {
          userId,
          locationTracking: true,
          panicMode: false,
          darkMode: false,
          language: "english"
        };
        settings = await storage.createUserSettings(defaultSettings);
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user settings" });
    }
  });

  app.put("/api/user-settings/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const settings = await storage.updateUserSettings(userId, req.body);
      if (!settings) {
        return res.status(404).json({ message: "Settings not found" });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
