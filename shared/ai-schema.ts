import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Smart Guardian Mode tracking
export const guardianSessions = pgTable("guardian_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sessionType: text("session_type").notNull(), // 'smart_guardian', 'safe_route', 'threat_monitor'
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  isActive: boolean("is_active").default(true),
  settings: text("settings"), // JSON string for session configuration
});

// Live threat radar incidents
export const liveThreats = pgTable("live_threats", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(), // 'police_feed', 'news_api', 'community'
  type: text("type").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  severity: text("severity").notNull(), // 'low', 'medium', 'high', 'critical'
  confidence: real("confidence").notNull(), // AI confidence score 0-1
  isVerified: boolean("is_verified").default(false),
  verificationCount: integer("verification_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  rawData: text("raw_data"), // Original source data
});

// Safe route data and crowd-sourced feedback
export const routeSegments = pgTable("route_segments", {
  id: serial("id").primaryKey(),
  startLatitude: text("start_latitude").notNull(),
  startLongitude: text("start_longitude").notNull(),
  endLatitude: text("end_latitude").notNull(),
  endLongitude: text("end_longitude").notNull(),
  safetyScore: real("safety_score").notNull(), // 0-100
  crowdTags: text("crowd_tags").array(), // ['safe', 'unsafe', 'avoid', 'well_lit', 'police_patrol']
  lastUpdated: timestamp("last_updated").defaultNow(),
  incidentCount: integer("incident_count").default(0),
});

// Community threat confirmations
export const threatConfirmations = pgTable("threat_confirmations", {
  id: serial("id").primaryKey(),
  threatId: integer("threat_id").notNull(),
  userId: integer("user_id"),
  confirmationType: text("confirmation_type").notNull(), // 'still_active', 'safe_now', 'false_alarm'
  location: text("location"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Guardian mode alerts and triggers
export const guardianAlerts = pgTable("guardian_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sessionId: integer("session_id"),
  triggerType: text("trigger_type").notNull(), // 'voice_keyword', 'motion_anomaly', 'shake_detection', 'panic_word'
  confidence: real("confidence").notNull(),
  audioData: text("audio_data"), // Encrypted audio snippet
  motionData: text("motion_data"), // Motion sensor data JSON
  location: text("location"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertGuardianSessionSchema = createInsertSchema(guardianSessions).omit({ id: true, startTime: true });
export const insertLiveThreatSchema = createInsertSchema(liveThreats).omit({ id: true, createdAt: true });
export const insertRouteSegmentSchema = createInsertSchema(routeSegments).omit({ id: true, lastUpdated: true });
export const insertThreatConfirmationSchema = createInsertSchema(threatConfirmations).omit({ id: true, createdAt: true });
export const insertGuardianAlertSchema = createInsertSchema(guardianAlerts).omit({ id: true, createdAt: true });

// Types
export type GuardianSession = typeof guardianSessions.$inferSelect;
export type InsertGuardianSession = z.infer<typeof insertGuardianSessionSchema>;
export type LiveThreat = typeof liveThreats.$inferSelect;
export type InsertLiveThreat = z.infer<typeof insertLiveThreatSchema>;
export type RouteSegment = typeof routeSegments.$inferSelect;
export type InsertRouteSegment = z.infer<typeof insertRouteSegmentSchema>;
export type ThreatConfirmation = typeof threatConfirmations.$inferSelect;
export type InsertThreatConfirmation = z.infer<typeof insertThreatConfirmationSchema>;
export type GuardianAlert = typeof guardianAlerts.$inferSelect;
export type InsertGuardianAlert = z.infer<typeof insertGuardianAlertSchema>;