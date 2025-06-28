import type { VercelRequest, VercelResponse } from '@vercel/node';
import { VenueScraper } from '../../server/scrapers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const scraper = new VenueScraper();
    console.log(`[${new Date().toISOString()}] Starting event update via API...`);
    
    await scraper.scrapeAllVenues();
    
    console.log(`[${new Date().toISOString()}] Event update completed successfully`);
    res.json({ message: 'Event update triggered successfully' });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error during event update:`, error);
    res.status(500).json({ message: 'Failed to trigger event update' });
  }
}