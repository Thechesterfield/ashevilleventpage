#!/bin/bash
set -e

# Variables
PROJECT_DIR="/Users/chester/Repo/ashevilleventpage"
ZIP_PATH="$HOME/Downloads/AshevilleEventPulse (2).zip"
RENAMED_ZIP="$HOME/Downloads/ashevilleventpage.zip"
TEMP_DIR="/tmp/ashevilleventpage-temp"
BACKUP_DIR="/tmp/deployment-backup"

echo "Creating backup of deployment files..."
mkdir -p "$BACKUP_DIR"
cd "$PROJECT_DIR"

# Backup critical deployment files
cp -r .git "$BACKUP_DIR/" 2>/dev/null || echo "No .git directory found"
cp -r .vercel "$BACKUP_DIR/" 2>/dev/null || echo "No .vercel directory found"
cp vercel.json "$BACKUP_DIR/" 2>/dev/null || echo "No vercel.json found"
cp package.json "$BACKUP_DIR/" 2>/dev/null || echo "No package.json found"
cp package-lock.json "$BACKUP_DIR/" 2>/dev/null || echo "No package-lock.json found"

echo "Pulling latest changes from remote..."
git pull origin main 2>/dev/null || echo "Could not pull from remote"

echo "Cleaning project directory (preserving deployment files)..."
# Remove everything except deployment files
find . -maxdepth 1 -not -name "." -not -name ".git" -not -name ".vercel" -not -name "vercel.json" -exec rm -rf {} +

echo "Renaming downloaded ZIP..."
mv "$ZIP_PATH" "$RENAMED_ZIP"

echo "Unzipping new content..."
unzip -q "$RENAMED_ZIP" -d "$TEMP_DIR"

echo "Moving new files (excluding deployment files)..."
# Move everything except deployment files that would conflict
cd "$TEMP_DIR"/AshevilleEventPulse
for item in *; do
    if [[ "$item" != ".git" && "$item" != ".vercel" && "$item" != "vercel.json" ]]; then
        mv "$item" "$PROJECT_DIR"/
    fi
done

# Handle dotfiles carefully
for item in .*; do
    if [[ "$item" != "." && "$item" != ".." && "$item" != ".git" && "$item" != ".vercel" ]]; then
        mv "$item" "$PROJECT_DIR"/ 2>/dev/null || true
    fi
done

echo "Creating API serverless functions..."
# Create API directory structure
mkdir -p "$PROJECT_DIR"/api/admin
mkdir -p "$PROJECT_DIR"/api/events

# Create the serverless API functions
cat > "$PROJECT_DIR"/api/events.ts << 'APIEOF'
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
APIEOF

cat > "$PROJECT_DIR"/api/admin/update-events.ts << 'APIEOF'
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
APIEOF

cat > "$PROJECT_DIR"/api/events/featured.ts << 'APIEOF'
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
APIEOF

cat > "$PROJECT_DIR"/api/events/this-week.ts << 'APIEOF'
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
APIEOF

cat > "$PROJECT_DIR"/api/filters.ts << 'APIEOF'
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
APIEOF

cat > "$PROJECT_DIR"/api/venues.ts << 'APIEOF'
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
APIEOF

echo "API functions created successfully!"

echo "Restoring deployment configuration..."
cd "$PROJECT_DIR"
# Restore deployment files if they were accidentally overwritten
if [[ ! -d .git && -d "$BACKUP_DIR/.git" ]]; then
    cp -r "$BACKUP_DIR/.git" .
fi
if [[ ! -d .vercel && -d "$BACKUP_DIR/.vercel" ]]; then
    cp -r "$BACKUP_DIR/.vercel" .
fi
if [[ ! -f vercel.json && -f "$BACKUP_DIR/vercel.json" ]]; then
    cp "$BACKUP_DIR/vercel.json" .
fi

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Cleaning up temp files..."
rm -rf "$TEMP_DIR" "$RENAMED_ZIP" "$BACKUP_DIR"

echo "Deployment ready! You can now run:"
echo "  vercel --prod"
echo "Or commit and push changes:"
echo "  git add ."
echo "  git commit -m 'Update from Replit'"
echo "  git push"

echo "Done."