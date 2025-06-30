import type { VercelRequest, VercelResponse } from '@vercel/node';
import { VenueScraper } from '../server/scrapers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Manual event scraping triggered...');
    const scraper = new VenueScraper();
    await scraper.scrapeAllVenues();
    console.log('Event scraping completed successfully');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Event scraping completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Event scraping failed:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Event scraping failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}