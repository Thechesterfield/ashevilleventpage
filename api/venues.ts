import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../server/database';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const venues = await storage.getVenuesWithEvents();
    res.json(venues);
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).json({ message: 'Failed to fetch venues' });
  }
}