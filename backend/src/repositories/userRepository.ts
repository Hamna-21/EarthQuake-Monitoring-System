import { User } from '../types/user';
import { getDb, memoryUsers, saveLocalDb } from '../database/mongodb';

export async function findUserByEmail(email: string): Promise<User | null> {
  const normalizedEmail = email.toLowerCase().trim();
  const db = await getDb();
  if (db) {
    const user = await db.collection<User>('users').findOne({ email: normalizedEmail });
    return user;
  } else {
    const user = memoryUsers.find(u => u.email === normalizedEmail);
    return user || null;
  }
}

export async function createUser(user: User): Promise<User> {
  user.email = user.email.toLowerCase().trim();
  const db = await getDb();
  if (db) {
    await db.collection<User>('users').insertOne(user);
    return user;
  } else {
    memoryUsers.push(user);
    saveLocalDb();
    return user;
  }
}

export async function updateUser(email: string, updates: Partial<User>): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  const db = await getDb();
  if (db) {
    await db.collection<User>('users').updateOne({ email: normalizedEmail }, { $set: updates });
  } else {
    const index = memoryUsers.findIndex(u => u.email === normalizedEmail);
    if (index !== -1) {
      memoryUsers[index] = { ...memoryUsers[index], ...updates };
      saveLocalDb();
    }
  }
}
