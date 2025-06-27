import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertVenueSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Venue routes
  app.get("/api/venues", async (req, res) => {
    try {
      const venues = await storage.getAllVenues();
      res.json(venues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venues" });
    }
  });

  app.get("/api/venues/with-events", async (req, res) => {
    try {
      const venuesWithEvents = await storage.getVenuesWithEvents();
      res.json(venuesWithEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venues with events" });
    }
  });

  app.get("/api/venues/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const venue = await storage.getVenue(id);
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }
      res.json(venue);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venue" });
    }
  });

  app.get("/api/venues/:id/events", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const events = await storage.getEventsByVenue(id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venue events" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const { genre, venue, startDate, endDate, search } = req.query;
      
      let events;
      
      if (search) {
        events = await storage.searchEvents(search as string);
      } else if (startDate && endDate) {
        const allEvents = await storage.getEventsByDateRange(
          new Date(startDate as string),
          new Date(endDate as string)
        );
        events = await Promise.all(allEvents.map(async event => {
          const venueData = await storage.getVenue(event.venueId);
          return { ...event, venue: venueData! };
        }));
      } else {
        events = await storage.getEventsWithVenue();
      }

      // Apply filters
      if (genre && genre !== 'all') {
        events = events.filter(event => 
          event.genre?.toLowerCase() === (genre as string).toLowerCase()
        );
      }

      if (venue && venue !== 'all') {
        events = events.filter(event => 
          event.venue.name.toLowerCase().includes((venue as string).toLowerCase())
        );
      }

      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/this-week", async (req, res) => {
    try {
      const events = await storage.getEventsThisWeek();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch this week's events" });
    }
  });

  app.get("/api/events/upcoming", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const events = await storage.getUpcomingEvents(limit);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming events" });
    }
  });

  app.get("/api/events/featured", async (req, res) => {
    try {
      const events = await storage.getFeaturedEvents();
      const eventsWithVenue = await Promise.all(events.map(async event => {
        const venue = await storage.getVenue(event.venueId);
        return { ...event, venue: venue! };
      }));
      res.json(eventsWithVenue);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured events" });
    }
  });

  app.get("/api/events/calendar/:year/:month", async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const events = await storage.getEventsByDateRange(startDate, endDate);
      const eventsWithVenue = await Promise.all(events.map(async event => {
        const venue = await storage.getVenue(event.venueId);
        return { ...event, venue: venue! };
      }));
      
      res.json(eventsWithVenue);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calendar events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      const venue = await storage.getVenue(event.venueId);
      const eventWithVenue = { ...event, venue: venue! };
      
      res.json(eventWithVenue);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  // Search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query required" });
      }
      
      const events = await storage.searchEvents(q as string);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Filter options endpoint
  app.get("/api/filters", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      const venues = await storage.getAllVenues();
      
      const genres = [...new Set(events.map(event => event.genre).filter(Boolean))];
      const venueNames = venues.map(venue => venue.name);
      
      res.json({
        genres,
        venues: venueNames
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch filter options" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
