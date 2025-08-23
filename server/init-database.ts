import { storage } from './storage';
import type { InsertVenue, InsertEvent } from '@shared/schema';

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

    // Add sample events
    const existingEvents = await storage.getAllEvents();
    if (existingEvents.length === 0) {
      console.log('Adding sample events...');
      
      const sampleEvents: InsertEvent[] = [
        {
          title: "Band Of Horses",
          description: "with Secret Guest",
          venueId: 1, // The Orange Peel
          startDate: new Date("2025-01-29T20:00:00"),
          startTime: "8:00 PM",
          price: "SOLD OUT",
          ticketUrl: "https://www.etix.com/ticket/p/70327687/band-of-horses-asheville-the-orange-peel",
          genre: "Rock",
          ageRestriction: "Ages 18+",
          isFeatured: true,
          isSoldOut: true,
          imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
          artistInfo: "Secret Guest",
          status: "upcoming"
        },
        {
          title: "Stephen Kellogg + Pat McGee",
          description: "Folk acoustic performance",
          venueId: 2, // The Grey Eagle
          startDate: new Date("2025-01-28T20:00:00"),
          startTime: "8:00 PM",
          price: "$35.90 to $46.20",
          ticketUrl: "https://www.etix.com/ticket/p/97973010/stephen-kellogg-pat-mcgee-asheville-grey-eagle-music-hall",
          genre: "Folk",
          ageRestriction: "All Ages",
          isFeatured: false,
          isSoldOut: false,
          imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
          artistInfo: null,
          status: "upcoming"
        },
        {
          title: "Trial by Fire (Tribute to Journey)",
          description: "Journey tribute band",
          venueId: 1, // The Orange Peel
          startDate: new Date("2025-01-27T20:00:00"),
          startTime: "8:00 PM",
          price: "$25.00",
          ticketUrl: "https://www.etix.com/ticket/p/97901428/trial-by-fire-tribute-to-journey-asheville-the-orange-peel",
          genre: "Rock",
          ageRestriction: "Ages 18+",
          isFeatured: false,
          isSoldOut: false,
          imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
          artistInfo: null,
          status: "upcoming"
        },
        {
          title: "Steel Pulse - 50th Anniversary Tour",
          description: "Legendary reggae band anniversary tour",
          venueId: 3, // Asheville Music Hall
          startDate: new Date("2025-02-02T19:00:00"),
          startTime: "7:00 PM",
          price: "$45.00",
          ticketUrl: "https://www.etix.com/ticket/p/98433509/steel-pulse-50th-anniversary-tour",
          genre: "Reggae",
          ageRestriction: "All Ages",
          isFeatured: true,
          isSoldOut: false,
          imageUrl: "https://images.unsplash.com/photo-1519683109079-d5f539e1542f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
          artistInfo: null,
          status: "upcoming"
        },
        {
          title: "Dustbowl Revival",
          description: "Americana and folk revival",
          venueId: 3, // Asheville Music Hall
          startDate: new Date("2025-01-27T20:00:00"),
          startTime: "8:00 PM",
          price: "$30.00",
          ticketUrl: "https://www.etix.com/ticket/p/57521239/dustbowl-revival-asheville-asheville-music-hall",
          genre: "Americana",
          ageRestriction: "Ages 21+",
          isFeatured: false,
          isSoldOut: false,
          imageUrl: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
          artistInfo: null,
          status: "upcoming"
        },
        {
          title: "Scott Hall Band",
          description: "Local acoustic performance",
          venueId: 4, // One World Brewing
          startDate: new Date("2025-01-27T19:00:00"),
          startTime: "7:00 PM",
          price: "$15.00",
          ticketUrl: "https://oneworldbrewing.com/event/scott-hall-band/",
          genre: "Local",
          ageRestriction: "All Ages",
          isFeatured: false,
          isSoldOut: false,
          imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
          artistInfo: null,
          status: "upcoming"
        }
      ];

      for (const event of sampleEvents) {
        await storage.createEvent(event);
        console.log(`Created event: ${event.title}`);
      }
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}