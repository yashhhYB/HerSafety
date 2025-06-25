import { 
  users, emergencyContacts, incidents, sosAlerts, safeZones, userSettings,
  type User, type InsertUser, 
  type EmergencyContact, type InsertEmergencyContact,
  type Incident, type InsertIncident,
  type SosAlert, type InsertSosAlert,
  type SafeZone, type InsertSafeZone,
  type UserSettings, type InsertUserSettings
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Emergency contacts methods
  getEmergencyContacts(userId: number): Promise<EmergencyContact[]>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  updateEmergencyContact(id: number, contact: Partial<InsertEmergencyContact>): Promise<EmergencyContact | undefined>;
  deleteEmergencyContact(id: number): Promise<boolean>;
  
  // Incidents methods
  getIncidents(limit?: number): Promise<Incident[]>;
  getIncidentsByUser(userId: number): Promise<Incident[]>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  
  // SOS alerts methods
  getSosAlerts(userId: number): Promise<SosAlert[]>;
  createSosAlert(alert: InsertSosAlert): Promise<SosAlert>;
  updateSosAlertStatus(id: number, status: string): Promise<SosAlert | undefined>;
  
  // Safe zones methods
  getSafeZones(): Promise<SafeZone[]>;
  getSafeZonesByType(type: string): Promise<SafeZone[]>;
  createSafeZone(safeZone: InsertSafeZone): Promise<SafeZone>;
  
  // User settings methods
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private emergencyContacts: Map<number, EmergencyContact>;
  private incidents: Map<number, Incident>;
  private sosAlerts: Map<number, SosAlert>;
  private safeZones: Map<number, SafeZone>;
  private userSettings: Map<number, UserSettings>;
  private currentUserId: number;
  private currentContactId: number;
  private currentIncidentId: number;
  private currentSosId: number;
  private currentSafeZoneId: number;
  private currentSettingsId: number;

  constructor() {
    this.users = new Map();
    this.emergencyContacts = new Map();
    this.incidents = new Map();
    this.sosAlerts = new Map();
    this.safeZones = new Map();
    this.userSettings = new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentIncidentId = 1;
    this.currentSosId = 1;
    this.currentSafeZoneId = 1;
    this.currentSettingsId = 1;
    
    // Initialize with sample safe zones
    this.initializeSafeZones();
  }

  private initializeSafeZones() {
    const sampleSafeZones: InsertSafeZone[] = [
      {
        name: "Koregaon Park Police Station",
        type: "police",
        address: "North Main Road, Koregaon Park, Pune",
        latitude: "18.5314",
        longitude: "73.8927",
        phone: "+91-20-26013000",
        isActive: true
      },
      {
        name: "Ruby Hall Clinic",
        type: "hospital",
        address: "Sassoon Road, Pune",
        latitude: "18.5204",
        longitude: "73.8567",
        phone: "+91-20-66455000",
        isActive: true
      },
      {
        name: "Pune Women's Safety NGO",
        type: "ngo",
        address: "FC Road, Pune",
        latitude: "18.5074",
        longitude: "73.8077",
        phone: "+91-20-25433000",
        isActive: true
      }
    ];

    sampleSafeZones.forEach(zone => this.createSafeZone(zone));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      phone: insertUser.phone || null,
      email: insertUser.email || null
    };
    this.users.set(id, user);
    return user;
  }

  // Emergency contacts methods
  async getEmergencyContacts(userId: number): Promise<EmergencyContact[]> {
    return Array.from(this.emergencyContacts.values()).filter(contact => contact.userId === userId);
  }

  async createEmergencyContact(insertContact: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = this.currentContactId++;
    const contact: EmergencyContact = { 
      ...insertContact, 
      id,
      relationship: insertContact.relationship || null,
      isPrimary: insertContact.isPrimary || null
    };
    this.emergencyContacts.set(id, contact);
    return contact;
  }

  async updateEmergencyContact(id: number, updateData: Partial<InsertEmergencyContact>): Promise<EmergencyContact | undefined> {
    const contact = this.emergencyContacts.get(id);
    if (!contact) return undefined;
    
    const updated = { ...contact, ...updateData };
    this.emergencyContacts.set(id, updated);
    return updated;
  }

  async deleteEmergencyContact(id: number): Promise<boolean> {
    return this.emergencyContacts.delete(id);
  }

  // Incidents methods
  async getIncidents(limit = 10): Promise<Incident[]> {
    return Array.from(this.incidents.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getIncidentsByUser(userId: number): Promise<Incident[]> {
    return Array.from(this.incidents.values()).filter(incident => incident.userId === userId);
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const id = this.currentIncidentId++;
    const incident: Incident = { 
      ...insertIncident, 
      id, 
      createdAt: new Date(),
      userId: insertIncident.userId || null,
      description: insertIncident.description || null,
      latitude: insertIncident.latitude || null,
      longitude: insertIncident.longitude || null,
      isAnonymous: insertIncident.isAnonymous || null,
      status: insertIncident.status || null
    };
    this.incidents.set(id, incident);
    return incident;
  }

  // SOS alerts methods
  async getSosAlerts(userId: number): Promise<SosAlert[]> {
    return Array.from(this.sosAlerts.values()).filter(alert => alert.userId === userId);
  }

  async createSosAlert(insertAlert: InsertSosAlert): Promise<SosAlert> {
    const id = this.currentSosId++;
    const alert: SosAlert = { 
      ...insertAlert, 
      id, 
      createdAt: new Date(),
      status: insertAlert.status || null,
      latitude: insertAlert.latitude || null,
      longitude: insertAlert.longitude || null
    };
    this.sosAlerts.set(id, alert);
    return alert;
  }

  async updateSosAlertStatus(id: number, status: string): Promise<SosAlert | undefined> {
    const alert = this.sosAlerts.get(id);
    if (!alert) return undefined;
    
    const updated = { ...alert, status };
    this.sosAlerts.set(id, updated);
    return updated;
  }

  // Safe zones methods
  async getSafeZones(): Promise<SafeZone[]> {
    return Array.from(this.safeZones.values()).filter(zone => zone.isActive);
  }

  async getSafeZonesByType(type: string): Promise<SafeZone[]> {
    return Array.from(this.safeZones.values()).filter(zone => zone.type === type && zone.isActive);
  }

  async createSafeZone(insertSafeZone: InsertSafeZone): Promise<SafeZone> {
    const id = this.currentSafeZoneId++;
    const safeZone: SafeZone = { 
      ...insertSafeZone, 
      id,
      phone: insertSafeZone.phone || null,
      isActive: insertSafeZone.isActive || null
    };
    this.safeZones.set(id, safeZone);
    return safeZone;
  }

  // User settings methods
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(settings => settings.userId === userId);
  }

  async createUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const id = this.currentSettingsId++;
    const settings: UserSettings = { 
      ...insertSettings, 
      id,
      locationTracking: insertSettings.locationTracking || null,
      panicMode: insertSettings.panicMode || null,
      darkMode: insertSettings.darkMode || null,
      language: insertSettings.language || null
    };
    this.userSettings.set(id, settings);
    return settings;
  }

  async updateUserSettings(userId: number, updateData: Partial<InsertUserSettings>): Promise<UserSettings | undefined> {
    const settings = Array.from(this.userSettings.values()).find(s => s.userId === userId);
    if (!settings) return undefined;
    
    const updated = { ...settings, ...updateData };
    this.userSettings.set(settings.id, updated);
    return updated;
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getEmergencyContacts(userId: number): Promise<EmergencyContact[]> {
    return await db.select().from(emergencyContacts).where(eq(emergencyContacts.userId, userId));
  }

  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    const [newContact] = await db
      .insert(emergencyContacts)
      .values(contact)
      .returning();
    return newContact;
  }

  async updateEmergencyContact(id: number, contact: Partial<InsertEmergencyContact>): Promise<EmergencyContact | undefined> {
    const [updated] = await db
      .update(emergencyContacts)
      .set(contact)
      .where(eq(emergencyContacts.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteEmergencyContact(id: number): Promise<boolean> {
    const result = await db.delete(emergencyContacts).where(eq(emergencyContacts.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getIncidents(limit = 10): Promise<Incident[]> {
    return await db.select().from(incidents).orderBy(incidents.createdAt).limit(limit);
  }

  async getIncidentsByUser(userId: number): Promise<Incident[]> {
    return await db.select().from(incidents).where(eq(incidents.userId, userId));
  }

  async createIncident(incident: InsertIncident): Promise<Incident> {
    const [newIncident] = await db
      .insert(incidents)
      .values(incident)
      .returning();
    return newIncident;
  }

  async getSosAlerts(userId: number): Promise<SosAlert[]> {
    return await db.select().from(sosAlerts).where(eq(sosAlerts.userId, userId));
  }

  async createSosAlert(alert: InsertSosAlert): Promise<SosAlert> {
    const [newAlert] = await db
      .insert(sosAlerts)
      .values(alert)
      .returning();
    return newAlert;
  }

  async updateSosAlertStatus(id: number, status: string): Promise<SosAlert | undefined> {
    const [updated] = await db
      .update(sosAlerts)
      .set({ status })
      .where(eq(sosAlerts.id, id))
      .returning();
    return updated || undefined;
  }

  async getSafeZones(): Promise<SafeZone[]> {
    return await db.select().from(safeZones);
  }

  async getSafeZonesByType(type: string): Promise<SafeZone[]> {
    return await db.select().from(safeZones).where(eq(safeZones.type, type));
  }

  async createSafeZone(safeZone: InsertSafeZone): Promise<SafeZone> {
    const [newZone] = await db
      .insert(safeZones)
      .values(safeZone)
      .returning();
    return newZone;
  }

  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return settings || undefined;
  }

  async createUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const [newSettings] = await db
      .insert(userSettings)
      .values(settings)
      .returning();
    return newSettings;
  }

  async updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined> {
    const [updated] = await db
      .update(userSettings)
      .set(settings)
      .where(eq(userSettings.userId, userId))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
