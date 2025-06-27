import { venues, events, artists, eventArtists, type Venue, type Event, type Artist, type EventArtist, type InsertVenue, type InsertEvent, type InsertArtist, type InsertEventArtist, type EventWithVenue, type VenueWithEvents } from "@shared/schema";

export interface IStorage {
  // Venue methods
  getVenue(id: number): Promise<Venue | undefined>;
  getVenueByName(name: string): Promise<Venue | undefined>;
  getAllVenues(): Promise<Venue[]>;
  getVenuesWithEvents(): Promise<VenueWithEvents[]>;
  createVenue(venue: InsertVenue): Promise<Venue>;

  // Event methods
  getEvent(id: number): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  getEventsByVenue(venueId: number): Promise<Event[]>;
  getEventsByDateRange(startDate: Date, endDate: Date): Promise<Event[]>;
  getUpcomingEvents(limit?: number): Promise<Event[]>;
  getFeaturedEvents(): Promise<Event[]>;
  getEventsThisWeek(): Promise<EventWithVenue[]>;
  getEventsByGenre(genre: string): Promise<Event[]>;
  searchEvents(query: string): Promise<EventWithVenue[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  getEventsWithVenue(): Promise<EventWithVenue[]>;

  // Artist methods
  getArtist(id: number): Promise<Artist | undefined>;
  getAllArtists(): Promise<Artist[]>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  getArtistsByEvent(eventId: number): Promise<Artist[]>;

  // Event-Artist relationship methods
  addArtistToEvent(eventArtist: InsertEventArtist): Promise<EventArtist>;
  removeArtistFromEvent(eventId: number, artistId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private venues: Map<number, Venue> = new Map();
  private events: Map<number, Event> = new Map();
  private artists: Map<number, Artist> = new Map();
  private eventArtists: Map<number, EventArtist> = new Map();
  
  private venueIdCounter = 1;
  private eventIdCounter = 1;
  private artistIdCounter = 1;
  private eventArtistIdCounter = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize venues with real data
    const venueData: InsertVenue[] = [
      {
        name: "The Orange Peel",
        address: "101 Biltmore Ave, Asheville, NC 28801",
        website: "https://theorangepeel.net",
        description: "Asheville's premier music venue",
        capacity: 1000,
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
      },
      {
        name: "The Grey Eagle",
        address: "185 Clingman Ave, Asheville, NC 28801",
        website: "https://www.thegreyeagle.com",
        description: "Live music venue and event space",
        capacity: 500,
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
      },
      {
        name: "Asheville Music Hall",
        address: "31 Patton Ave, Asheville, NC 28801",
        website: "https://ashevillemusichall.com",
        description: "Modern music hall featuring diverse acts",
        capacity: 600,
        imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
      },
      {
        name: "One World Brewing",
        address: "Multiple Locations, Asheville, NC",
        website: "https://oneworldbrewing.com",
        description: "Brewery and live music venue",
        capacity: 200,
        imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
      }
    ];

    venueData.forEach(venue => {
      this.createVenueSync(venue);
    });

    // Initialize events with real data from scraped content
    const eventData: InsertEvent[] = [
      {
        title: "Band Of Horses",
        description: "with Secret Guest",
        venueId: 1, // The Orange Peel
        startDate: new Date("2025-06-29T20:00:00"),
        startTime: "8:00 PM",
        price: "SOLD OUT",
        ticketUrl: "https://www.etix.com/ticket/p/70327687/band-of-horses-asheville-the-orange-peel",
        genre: "Rock",
        ageRestriction: "Ages 18+",
        isFeatured: true,
        isSoldOut: true,
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        artistInfo: "Secret Guest"
      },
      {
        title: "Stephen Kellogg + Pat McGee",
        description: "Folk acoustic performance",
        venueId: 2, // The Grey Eagle
        startDate: new Date("2025-06-28T20:00:00"),
        startTime: "8:00 PM",
        price: "$35.90 to $46.20",
        ticketUrl: "https://www.etix.com/ticket/p/97973010/stephen-kellogg-pat-mcgee-asheville-grey-eagle-music-hall",
        genre: "Folk",
        ageRestriction: "All Ages",
        isFeatured: false,
        isSoldOut: false,
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
      },
      {
        title: "Trial by Fire (Tribute to Journey)",
        description: "Journey tribute band",
        venueId: 1, // The Orange Peel
        startDate: new Date("2025-06-27T20:00:00"),
        startTime: "8:00 PM",
        price: "$25.00",
        ticketUrl: "https://www.etix.com/ticket/p/97901428/trial-by-fire-tribute-to-journey-asheville-the-orange-peel",
        genre: "Rock",
        ageRestriction: "Ages 18+",
        isFeatured: false,
        isSoldOut: false,
        imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
      },
      {
        title: "Steel Pulse - 50th Anniversary Tour",
        description: "Legendary reggae band anniversary tour",
        venueId: 3, // French Broad Brewery (using Asheville Music Hall as proxy)
        startDate: new Date("2025-07-02T19:00:00"),
        startTime: "7:00 PM",
        price: "$45.00",
        ticketUrl: "https://www.etix.com/ticket/p/98433509/steel-pulse-50th-anniversary-tour-asheville-french-broad-river-brewery-outdoor-stage",
        genre: "Reggae",
        ageRestriction: "All Ages",
        isFeatured: true,
        isSoldOut: false,
        imageUrl: "https://images.unsplash.com/photo-1519683109079-d5f539e1542f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
      },
      {
        title: "Dustbowl Revival",
        description: "Americana and folk revival",
        venueId: 3, // Asheville Music Hall
        startDate: new Date("2025-06-27T20:00:00"),
        startTime: "8:00 PM",
        price: "$30.00",
        ticketUrl: "https://www.etix.com/ticket/p/57521239/dustbowl-revival-asheville-asheville-music-hall",
        genre: "Americana",
        ageRestriction: "Ages 21+",
        isFeatured: false,
        isSoldOut: false,
        imageUrl: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
      },
      {
        title: "Scott Hall Band",
        description: "Local acoustic performance",
        venueId: 4, // One World Brewing
        startDate: new Date("2025-06-27T19:00:00"),
        startTime: "7:00 PM",
        price: "$15.00",
        ticketUrl: "https://oneworldbrewing.com/event/scott-hall-band-2025-06-27/",
        genre: "Local",
        ageRestriction: "All Ages",
        isFeatured: false,
        isSoldOut: false,
        imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
      },
      {
        title: "Geektastic Land Of The Sky Burlesque Festival",
        description: "Adult entertainment showcase",
        venueId: 2, // The Grey Eagle
        startDate: new Date("2025-06-27T20:00:00"),
        startTime: "8:00 PM",
        price: "$35.90",
        ticketUrl: "https://www.etix.com/ticket/p/95131084/geektasticland-of-the-sky-burlesque-festival-asheville-grey-eagle-music-hall-special-events",
        genre: "Special Events",
        ageRestriction: "Ages 18+",
        isFeatured: false,
        isSoldOut: false,
        imageUrl: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
      }
    ];

    eventData.forEach(event => {
      this.createEventSync(event);
    });
  }

  private createVenueSync(venue: InsertVenue): Venue {
    const id = this.venueIdCounter++;
    const newVenue: Venue = { ...venue, id };
    this.venues.set(id, newVenue);
    return newVenue;
  }

  private createEventSync(event: InsertEvent): Event {
    const id = this.eventIdCounter++;
    const newEvent: Event = { ...event, id };
    this.events.set(id, newEvent);
    return newEvent;
  }

  // Venue methods
  async getVenue(id: number): Promise<Venue | undefined> {
    return this.venues.get(id);
  }

  async getVenueByName(name: string): Promise<Venue | undefined> {
    return Array.from(this.venues.values()).find(venue => venue.name === name);
  }

  async getAllVenues(): Promise<Venue[]> {
    return Array.from(this.venues.values());
  }

  async getVenuesWithEvents(): Promise<VenueWithEvents[]> {
    const venues = await this.getAllVenues();
    return Promise.all(venues.map(async venue => {
      const upcomingEvents = await this.getEventsByVenue(venue.id);
      return {
        ...venue,
        upcomingEvents: upcomingEvents.filter(event => new Date(event.startDate) > new Date()),
        eventCount: upcomingEvents.length
      };
    }));
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    return this.createVenueSync(venue);
  }

  // Event methods
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEventsByVenue(venueId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.venueId === venueId);
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  async getUpcomingEvents(limit?: number): Promise<Event[]> {
    const now = new Date();
    const upcomingEvents = Array.from(this.events.values())
      .filter(event => new Date(event.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    return limit ? upcomingEvents.slice(0, limit) : upcomingEvents;
  }

  async getFeaturedEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.isFeatured);
  }

  async getEventsThisWeek(): Promise<EventWithVenue[]> {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const eventsThisWeek = await this.getEventsByDateRange(now, weekFromNow);
    
    return Promise.all(eventsThisWeek.map(async event => {
      const venue = await this.getVenue(event.venueId);
      return {
        ...event,
        venue: venue!
      };
    }));
  }

  async getEventsByGenre(genre: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => 
      event.genre?.toLowerCase() === genre.toLowerCase()
    );
  }

  async searchEvents(query: string): Promise<EventWithVenue[]> {
    const lowerQuery = query.toLowerCase();
    const matchingEvents = Array.from(this.events.values()).filter(event =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description?.toLowerCase().includes(lowerQuery) ||
      event.genre?.toLowerCase().includes(lowerQuery) ||
      event.artistInfo?.toLowerCase().includes(lowerQuery)
    );

    return Promise.all(matchingEvents.map(async event => {
      const venue = await this.getVenue(event.venueId);
      return {
        ...event,
        venue: venue!
      };
    }));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    return this.createEventSync(event);
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return undefined;
    
    const updatedEvent = { ...existingEvent, ...event };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async getEventsWithVenue(): Promise<EventWithVenue[]> {
    const events = await this.getAllEvents();
    return Promise.all(events.map(async event => {
      const venue = await this.getVenue(event.venueId);
      return {
        ...event,
        venue: venue!
      };
    }));
  }

  // Artist methods
  async getArtist(id: number): Promise<Artist | undefined> {
    return this.artists.get(id);
  }

  async getAllArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values());
  }

  async createArtist(artist: InsertArtist): Promise<Artist> {
    const id = this.artistIdCounter++;
    const newArtist: Artist = { ...artist, id };
    this.artists.set(id, newArtist);
    return newArtist;
  }

  async getArtistsByEvent(eventId: number): Promise<Artist[]> {
    const eventArtistRelations = Array.from(this.eventArtists.values())
      .filter(relation => relation.eventId === eventId);
    
    return Promise.all(eventArtistRelations.map(async relation => {
      const artist = await this.getArtist(relation.artistId);
      return artist!;
    }));
  }

  // Event-Artist relationship methods
  async addArtistToEvent(eventArtist: InsertEventArtist): Promise<EventArtist> {
    const id = this.eventArtistIdCounter++;
    const newEventArtist: EventArtist = { ...eventArtist, id };
    this.eventArtists.set(id, newEventArtist);
    return newEventArtist;
  }

  async removeArtistFromEvent(eventId: number, artistId: number): Promise<boolean> {
    const relationEntry = Array.from(this.eventArtists.entries())
      .find(([_, relation]) => relation.eventId === eventId && relation.artistId === artistId);
    
    if (relationEntry) {
      this.eventArtists.delete(relationEntry[0]);
      return true;
    }
    return false;
  }
}

export const storage = new MemStorage();
