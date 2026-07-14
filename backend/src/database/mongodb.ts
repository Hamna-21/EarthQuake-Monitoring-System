import { MongoClient, Db } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { User } from '../types/user';

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
export const JSON_DB_PATH = path.join(process.cwd(), 'db.json');

// Memory DB fallback
export let memoryUsers: User[] = [];
if (fs.existsSync(JSON_DB_PATH)) {
  try {
    memoryUsers = JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf-8'));
    // Convert date strings back to Date objects
    memoryUsers.forEach(u => {
      if (u.createdAt) u.createdAt = new Date(u.createdAt);
    });
  } catch (err) {
    console.error('Failed to parse db.json, starting fresh', err);
    memoryUsers = [];
  }
}

export async function getDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }
  
  if (mongoDb) return mongoDb;
  
  try {
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    console.log('Successfully connected to MongoDB!');
    mongoDb = mongoClient.db();
    return mongoDb;
  } catch (err) {
    console.error('Failed to connect to MongoDB, using local fallback', err);
    return null;
  }
}

export function saveLocalDb(): void {
  try {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(memoryUsers, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db.json', err);
  }
}
