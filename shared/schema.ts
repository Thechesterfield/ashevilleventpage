import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  website: text("website"),
  description: text("description"),
  capacity: integer("capacity"),
  imageUrl: text("image_url"),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  venueId: integer("venue_id").references(() => venues.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  price: text("price"),
  ticketUrl: text("ticket_url"),
  genre: text("genre"),
  ageRestriction: text("age_restriction"),
  isFeatured: boolean("is_featured").default(false),
  isSoldOut: boolean("is_sold_out").default(false),
  imageUrl: text("image_url"),
  artistInfo: text("artist_info"),
  status: text("status").default("upcoming"), // upcoming, past, cancelled
});

export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  genre: text("genre"),
  description: text("description"),
  website: text("website"),
  imageUrl: text("image_url"),
});

export const eventArtists = pgTable("event_artists", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  artistId: integer("artist_id").references(() => artists.id).notNull(),
  isHeadliner: boolean("is_headliner").default(false),
});

export const insertVenueSchema = createInsertSchema(venues).omit({
  id: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export const insertArtistSchema = createInsertSchema(artists).omit({
  id: true,
});

export const insertEventArtistSchema = createInsertSchema(eventArtists).omit({
  id: true,
});

export type InsertVenue = z.infer<typeof insertVenueSchema>;
export type Venue = typeof venues.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Artist = typeof artists.$inferSelect;

export type InsertEventArtist = z.infer<typeof insertEventArtistSchema>;
export type EventArtist = typeof eventArtists.$inferSelect;

// Extended types for frontend display
export type EventWithVenue = Event & {
  venue: Venue;
  artists?: Artist[];
};

export type VenueWithEvents = Venue & {
  upcomingEvents?: Event[];
  eventCount?: number;
};
