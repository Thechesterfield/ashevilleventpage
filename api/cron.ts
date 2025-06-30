import type { VercelRequest, VercelResponse } from '@vercel/node';
import { VenueScraper } from '../server/scrapers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify this is a Vercel Cron request
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Starting scheduled event scraping...');
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