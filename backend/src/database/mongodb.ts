import { MongoClient, Db } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { User } from '../types/user';

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
let mongoConnectPromise: Promise<Db | null> | null = null;
export const JSON_DB_PATH = path.join(process.cwd(), 'db.json');
let lastMongoFailureAt = 0;
const MONGO_RETRY_COOLDOWN_MS = 30_000;
let missingUriLogged = false;

// Keep a lightweight local store available when MongoDB is not configured or temporarily unreachable.
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

/** Handles the get db operation and returns its normalized result. */
export async function getDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    if (!missingUriLogged) {
      console.warn('MongoDB unavailable: MONGODB_URI is not configured; using local user storage.');
      missingUriLogged = true;
    }
    return null;
  }

  if (mongoDb) return mongoDb;
  if (Date.now() - lastMongoFailureAt < MONGO_RETRY_COOLDOWN_MS) return null;

  if (mongoConnectPromise) return mongoConnectPromise;
  mongoConnectPromise = connectMongo(uri).finally(() => { mongoConnectPromise = null; });
  return mongoConnectPromise;
}

// Establish one shared MongoDB connection and throttle retries after a failed connection attempt.
async function connectMongo(uri: string): Promise<Db | null> {
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.warn('MongoDB unavailable: MONGODB_URI must use mongodb:// or mongodb+srv://.');
    lastMongoFailureAt = Date.now();
    return null;
  }

  const client = new MongoClient(uri, {
    family: 4,
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
    maxPoolSize: 10,
    minPoolSize: 0,
  });

  try {
    console.log('MongoDB connecting...');
    await client.connect();
    await client.db().command({ ping: 1 });
    mongoClient = client;
    mongoDb = client.db();
    client.on('error', () => {
      if (mongoClient !== client) return;
      mongoClient = null;
      mongoDb = null;
      lastMongoFailureAt = Date.now();
      console.warn('MongoDB unavailable; will retry after cooldown.');
    });
    console.log('MongoDB connected');
    return mongoDb;
  } catch {
    lastMongoFailureAt = Date.now();
    await client.close().catch(() => undefined);
    console.warn('MongoDB unavailable; using local user storage for this request window.');
    return null;
  }
}

/** Handles the save local db operation and returns its normalized result. */
export function saveLocalDb(): void {
  try {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(memoryUsers, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db.json', err);
  }
}
