import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../server/database';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const events = await storage.getAllEvents();
    const venues = await storage.getAllVenues();
    
    const genres = Array.from(new Set(events.map(event => event.genre).filter(Boolean)));
    const venueNames = venues.map(venue => venue.name);
    
    res.json({
      genres,
      venues: venueNames
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ message: 'Failed to fetch filter options' });
  }
}