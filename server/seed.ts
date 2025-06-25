import { db } from "./db";
import { safeZones } from "@shared/schema";

const sampleSafeZones = [
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
  },
  {
    name: "Shivajinagar Police Station",
    type: "police",
    address: "Shivajinagar, Pune",
    latitude: "18.5308",
    longitude: "73.8506",
    phone: "+91-20-25533000",
    isActive: true
  },
  {
    name: "Jehangir Hospital",
    type: "hospital",
    address: "Sassoon Road, Near Pune Railway Station",
    latitude: "18.5200",
    longitude: "73.8553",
    phone: "+91-20-66455000",
    isActive: true
  },
  {
    name: "Mahila Mandal NGO",
    type: "ngo",
    address: "JM Road, Pune",
    latitude: "18.5158",
    longitude: "73.8283",
    phone: "+91-20-25443000",
    isActive: true
  }
];

export async function seedDatabase() {
  try {
    console.log("Seeding database with sample data...");
    
    // Check if safe zones already exist
    const existingSafeZones = await db.select().from(safeZones).limit(1);
    
    if (existingSafeZones.length === 0) {
      await db.insert(safeZones).values(sampleSafeZones);
      console.log("✓ Safe zones seeded successfully");
    } else {
      console.log("✓ Safe zones already exist");
    }
    
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}