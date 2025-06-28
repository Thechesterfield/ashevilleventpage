#!/bin/bash
set -e

# Create API directory structure
mkdir -p api/admin
mkdir -p api/events

# Create main events endpoint
cat > api/events.ts << 'EOF'
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../server/database';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const events = await storage.getEventsWithVenue();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
}
EOF

# Create venues endpoint
cat > api/venues.ts << 'EOF'
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
EOF

# Create filters endpoint
cat > api/filters.ts << 'EOF'
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
EOF

# Create featured events endpoint
cat > api/events/featured.ts << 'EOF'
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
EOF

# Create this week events endpoint
cat > api/events/this-week.ts << 'EOF'
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
EOF

# Create update events endpoint
cat > api/admin/update-events.ts << 'EOF'
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
EOF

echo "API files created successfully!"
echo "Run the following commands to deploy:"
echo "  git add api/"
echo "  git commit -m 'Add serverless API functions'"
echo "  git push origin main"