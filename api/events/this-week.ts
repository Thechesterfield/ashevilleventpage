import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/database';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const events = await storage.getEventsThisWeek();
    res.json(events);
  } catch (error) {
    console.error('Error fetching this week events:', error);
    res.status(500).json({ message: 'Failed to fetch this week events' });
  }
}