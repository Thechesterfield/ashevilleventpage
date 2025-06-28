import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/database';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const events = await storage.getFeaturedEvents();
    const eventsWithVenue = await Promise.all(events.map(async event => {
      const venue = await storage.getVenue(event.venueId);
      return { ...event, venue: venue! };
    }));
    res.json(eventsWithVenue);
  } catch (error) {
    console.error('Error fetching featured events:', error);
    res.status(500).json({ message: 'Failed to fetch featured events' });
  }
}