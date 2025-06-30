import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, desc, asc, and, gte, lte, like, or, sql } from 'drizzle-orm';
import { venues, events, artists, eventArtists } from '@shared/schema';
import type { IStorage } from './storage';
import type {
  Venue,
  Event,
  Artist,
  EventArtist,
  InsertVenue,
  InsertEvent,
  InsertArtist,
  InsertEventArtist,
  EventWithVenue,
  VenueWithEvents
} from '@shared/schema';

const connectionString = process.env.DATABASE_URL!;
const sql_client = neon(connectionString);
const db = drizzle(sql_client);

export class DatabaseStorage implements IStorage {
  // Venue methods
  async getVenue(id: number): Promise<Venue | undefined> {
    const result = await db.select().from(venues).where(eq(venues.id, id)).limit(1);
    return result[0];
  }

  async getVenueByName(name: string): Promise<Venue | undefined> {
    const result = await db.select().from(venues).where(eq(venues.name, name)).limit(1);
    return result[0];
  }

  async getAllVenues(): Promise<Venue[]> {
    return await db.select().from(venues).orderBy(asc(venues.name));
  }

  async getVenuesWithEvents(): Promise<VenueWithEvents[]> {
    const venueList = await this.getAllVenues();
    const venuesWithEvents: VenueWithEvents[] = [];

    for (const venue of venueList) {
      const upcomingEvents = await this.getEventsByVenue(venue.id);
      venuesWithEvents.push({
        ...venue,
        upcomingEvents,
        eventCount: upcomingEvents.length
      });
    }

    return venuesWithEvents;
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const result = await db.insert(venues).values(venue).returning();
    return result[0];
  }

  // Event methods
  async getEvent(id: number): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return result[0];
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.startDate));
  }

  async getEventsByVenue(venueId: number): Promise<Event[]> {
    return await db.select()
      .from(events)
      .where(eq(events.venueId, venueId))
      .orderBy(desc(events.startDate));
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return await db.select()
      .from(events)
      .where(and(
        gte(events.startDate, startDate),
        lte(events.startDate, endDate)
      ))
      .orderBy(desc(events.startDate));
  }

  async getUpcomingEvents(limit?: number): Promise<Event[]> {
    const now = new Date();
    
    if (limit) {
      return await db.select()
        .from(events)
        .where(gte(events.startDate, now))
        .orderBy(desc(events.startDate))
        .limit(limit);
    }

    return await db.select()
      .from(events)
      .where(gte(events.startDate, now))
      .orderBy(desc(events.startDate));
  }

  async getFeaturedEvents(): Promise<Event[]> {
    return await db.select()
      .from(events)
      .where(eq(events.isFeatured, true))
      .orderBy(desc(events.startDate));
  }

  async getEventsThisWeek(): Promise<EventWithVenue[]> {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
    weekEnd.setHours(23, 59, 59, 999);

    const eventsList = await db.select({
      event: events,
      venue: venues
    })
    .from(events)
    .innerJoin(venues, eq(events.venueId, venues.id))
    .where(and(
      gte(events.startDate, weekStart),
      lte(events.startDate, weekEnd)
    ))
    .orderBy(desc(events.startDate));

    return eventsList.map(row => ({
      ...row.event,
      venue: row.venue
    }));
  }

  async getEventsByGenre(genre: string): Promise<Event[]> {
    return await db.select()
      .from(events)
      .where(eq(events.genre, genre))
      .orderBy(desc(events.startDate));
  }

  async searchEvents(query: string): Promise<EventWithVenue[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    
    const eventsList = await db.select({
      event: events,
      venue: venues
    })
    .from(events)
    .innerJoin(venues, eq(events.venueId, venues.id))
    .where(or(
      like(sql`LOWER(${events.title})`, searchTerm),
      like(sql`LOWER(${events.description})`, searchTerm),
      like(sql`LOWER(${events.genre})`, searchTerm),
      like(sql`LOWER(${events.artistInfo})`, searchTerm)
    ))
    .orderBy(desc(events.startDate));

    return eventsList.map(row => ({
      ...row.event,
      venue: row.venue
    }));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const result = await db.update(events)
      .set(event)
      .where(eq(events.id, id))
      .returning();
    return result[0];
  }

  async getEventsWithVenue(): Promise<EventWithVenue[]> {
    const eventsList = await db.select({
      event: events,
      venue: venues
    })
    .from(events)
    .innerJoin(venues, eq(events.venueId, venues.id))
    .orderBy(desc(events.startDate));

    return eventsList.map(row => ({
      ...row.event,
      venue: row.venue
    }));
  }

  // Artist methods
  async getArtist(id: number): Promise<Artist | undefined> {
    const result = await db.select().from(artists).where(eq(artists.id, id)).limit(1);
    return result[0];
  }

  async getAllArtists(): Promise<Artist[]> {
    return await db.select().from(artists).orderBy(asc(artists.name));
  }

  async createArtist(artist: InsertArtist): Promise<Artist> {
    const result = await db.insert(artists).values(artist).returning();
    return result[0];
  }

  async getArtistsByEvent(eventId: number): Promise<Artist[]> {
    const result = await db.select({
      artist: artists
    })
    .from(eventArtists)
    .innerJoin(artists, eq(eventArtists.artistId, artists.id))
    .where(eq(eventArtists.eventId, eventId));

    return result.map(row => row.artist);
  }

  // Event-Artist relationship methods
  async addArtistToEvent(eventArtist: InsertEventArtist): Promise<EventArtist> {
    const result = await db.insert(eventArtists).values(eventArtist).returning();
    return result[0];
  }

  async removeArtistFromEvent(eventId: number, artistId: number): Promise<boolean> {
    const result = await db.delete(eventArtists)
      .where(and(
        eq(eventArtists.eventId, eventId),
        eq(eventArtists.artistId, artistId)
      ));
    
    return result.rowCount > 0;
  }

  // Cleanup methods
  async clearAllEvents(): Promise<void> {
    await db.delete(events);
  }

  async clearOldEvents(daysOld: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    await db.delete(events).where(lte(events.startDate, cutoffDate));
  }
}