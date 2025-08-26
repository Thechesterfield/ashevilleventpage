import { storage } from './storage';
import type { InsertVenue } from '@shared/schema';

export async function initializeDatabase() {
  console.log('Initializing database with venues...');
  
  try {
    // Check if venues already exist
    const existingVenues = await storage.getAllVenues();
    if (existingVenues.length > 0) {
      console.log('Database already initialized with venues');
      return;
    }

    // Create the four main venues
    const venues: InsertVenue[] = [
      {
        name: 'The Orange Peel',
        address: '101 Biltmore Ave, Asheville, NC 28801',
        website: 'https://theorangepeel.net',
        description: 'Premier music venue in downtown Asheville featuring national and international touring acts.',
        capacity: 1050,
        imageUrl: null
      },
      {
        name: 'The Grey Eagle',
        address: '185 Clingman Ave, Asheville, NC 28801',
        website: 'https://www.thegreyeagle.com',
        description: 'Intimate music venue and tavern in the River Arts District.',
        capacity: 500,
        imageUrl: null
      },
      {
        name: 'Asheville Music Hall',
        address: '31 Patton Ave, Asheville, NC 28801',
        website: 'https://ashevillemusichall.com',
        description: 'Historic music venue in downtown Asheville hosting diverse musical acts.',
        capacity: 800,
        imageUrl: null
      },
      {
        name: 'One World Brewing',
        address: '10 Patton Ave, Asheville, NC 28801',
        website: 'https://oneworldbrewing.com',
        description: 'Brewery and music venue featuring local and touring artists.',
        capacity: 300,
        imageUrl: null
      }
    ];

    // Create venues in database
    for (const venue of venues) {
      await storage.createVenue(venue);
      console.log(`Created venue: ${venue.name}`);
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}