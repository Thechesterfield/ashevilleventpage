import axios from 'axios';
import * as cheerio from 'cheerio';
import { storage } from './storage';
import type { InsertEvent, InsertVenue } from '@shared/schema';

interface ScrapedEvent {
  title: string;
  description?: string;
  date: string;
  time?: string;
  price?: string;
  ticketUrl?: string;
  genre?: string;
  ageRestriction?: string;
  imageUrl?: string;
  artistInfo?: string;
}

export class VenueScraper {
  private async fetchPage(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
      throw error;
    }
  }

  private parseDate(dateStr: string): Date {
    // Handle various date formats from different venues
    const cleanDate = dateStr.replace(/[^\w\s,]/g, '').trim();
    
    // Try common formats
    const patterns = [
      /(\w+),?\s+(\w+)\s+(\d{1,2})/i, // "Fri, June 27" or "Friday June 27"
      /(\w+)\s+(\d{1,2}),?\s+(\d{4})/i, // "June 27, 2025"
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/i, // "6/27/2025"
    ];

    for (const pattern of patterns) {
      const match = cleanDate.match(pattern);
      if (match) {
        try {
          return new Date(cleanDate);
        } catch {
          continue;
        }
      }
    }

    // Fallback to current year if no year specified
    const currentYear = new Date().getFullYear();
    return new Date(`${cleanDate} ${currentYear}`);
  }

  async scrapeOrangePeel(): Promise<ScrapedEvent[]> {
    console.log('Scraping The Orange Peel...');
    const events: ScrapedEvent[] = [];
    
    try {
      const html = await this.fetchPage('https://theorangepeel.net/events/');
      const $ = cheerio.load(html);
      
      $('.event-item, .tribe-events-calendar-list__event').each((_, element) => {
        const $event = $(element);
        
        const title = $event.find('.event-title, .tribe-events-calendar-list__event-title a').text().trim();
        const dateText = $event.find('.event-date, .tribe-events-calendar-list__event-date-tag').text().trim();
        const description = $event.find('.event-description, .tribe-events-calendar-list__event-description').text().trim();
        const price = $event.find('.event-cost, .tribe-events-cost').text().trim();
        const ticketUrl = $event.find('a[href*="etix"], a[href*="ticket"]').attr('href');
        
        if (title && dateText) {
          events.push({
            title,
            description: description || undefined,
            date: dateText,
            price: price || undefined,
            ticketUrl: ticketUrl || undefined,
            genre: 'Music',
            ageRestriction: 'Ages 18+'
          });
        }
      });
    } catch (error) {
      console.error('Error scraping Orange Peel:', error);
    }
    
    return events;
  }

  async scrapeGreyEagle(): Promise<ScrapedEvent[]> {
    console.log('Scraping The Grey Eagle...');
    const events: ScrapedEvent[] = [];
    
    try {
      const html = await this.fetchPage('https://www.thegreyeagle.com/calendar/');
      const $ = cheerio.load(html);
      
      $('.event-item, .tribe-events-calendar-list__event').each((_, element) => {
        const $event = $(element);
        
        const title = $event.find('h3 a, .event-title a').text().trim();
        const dateText = $event.find('.event-date, .tribe-events-calendar-list__event-date-tag').text().trim();
        const description = $event.find('.event-description').text().trim();
        const price = $event.find('.event-cost').text().trim();
        const ticketUrl = $event.find('a[href*="etix"], a[href*="ticket"]').attr('href');
        
        if (title && dateText) {
          events.push({
            title,
            description: description || undefined,
            date: dateText,
            price: price || undefined,
            ticketUrl: ticketUrl || undefined,
            genre: 'Music'
          });
        }
      });
    } catch (error) {
      console.error('Error scraping Grey Eagle:', error);
    }
    
    return events;
  }

  async scrapeAshevilleMusicHall(): Promise<ScrapedEvent[]> {
    console.log('Scraping Asheville Music Hall...');
    const events: ScrapedEvent[] = [];
    
    try {
      const html = await this.fetchPage('https://ashevillemusichall.com/all-shows/');
      const $ = cheerio.load(html);
      
      $('.event-item, .tribe-events-calendar-list__event').each((_, element) => {
        const $event = $(element);
        
        const title = $event.find('h3 a, .event-title a').text().trim();
        const dateText = $event.find('.event-date, .tribe-events-calendar-list__event-date-tag').text().trim();
        const description = $event.find('.event-description').text().trim();
        const ticketUrl = $event.find('a[href*="etix"], a[href*="ticket"]').attr('href');
        
        if (title && dateText) {
          events.push({
            title,
            description: description || undefined,
            date: dateText,
            ticketUrl: ticketUrl || undefined,
            genre: 'Music'
          });
        }
      });
    } catch (error) {
      console.error('Error scraping Asheville Music Hall:', error);
    }
    
    return events;
  }

  async scrapeOneWorldBrewing(): Promise<ScrapedEvent[]> {
    console.log('Scraping One World Brewing...');
    const events: ScrapedEvent[] = [];
    
    try {
      const html = await this.fetchPage('https://oneworldbrewing.com/events/');
      const $ = cheerio.load(html);
      
      $('.event-item, .tribe-events-calendar-list__event').each((_, element) => {
        const $event = $(element);
        
        const title = $event.find('h3 a, .event-title a').text().trim();
        const dateText = $event.find('.event-date, .tribe-events-calendar-list__event-date-tag').text().trim();
        const description = $event.find('.event-description').text().trim();
        
        if (title && dateText) {
          events.push({
            title,
            description: description || undefined,
            date: dateText,
            genre: 'Live Music'
          });
        }
      });
    } catch (error) {
      console.error('Error scraping One World Brewing:', error);
    }
    
    return events;
  }

  private async saveEventsToDatabase(events: ScrapedEvent[], venueName: string): Promise<void> {
    const venue = await storage.getVenueByName(venueName);
    if (!venue) {
      console.error(`Venue not found: ${venueName}`);
      return;
    }

    for (const scrapedEvent of events) {
      try {
        const eventDate = this.parseDate(scrapedEvent.date);
        
        // Check if event already exists to avoid duplicates
        const existingEvents = await storage.getEventsByVenue(venue.id);
        const isDuplicate = existingEvents.some(existing => 
          existing.title === scrapedEvent.title && 
          Math.abs(new Date(existing.startDate).getTime() - eventDate.getTime()) < 24 * 60 * 60 * 1000
        );

        if (!isDuplicate) {
          const newEvent: InsertEvent = {
            title: scrapedEvent.title,
            description: scrapedEvent.description || null,
            venueId: venue.id,
            startDate: eventDate,
            endDate: null,
            startTime: scrapedEvent.time || null,
            endTime: null,
            price: scrapedEvent.price || null,
            ticketUrl: scrapedEvent.ticketUrl || null,
            genre: scrapedEvent.genre || null,
            ageRestriction: scrapedEvent.ageRestriction || null,
            isFeatured: false,
            isSoldOut: scrapedEvent.price?.toLowerCase().includes('sold out') || false,
            imageUrl: scrapedEvent.imageUrl || null,
            artistInfo: scrapedEvent.artistInfo || null,
            status: 'upcoming'
          };

          await storage.createEvent(newEvent);
          console.log(`Added event: ${scrapedEvent.title} at ${venueName}`);
        }
      } catch (error) {
        console.error(`Error saving event ${scrapedEvent.title}:`, error);
      }
    }
  }

  async scrapeAllVenues(): Promise<void> {
    console.log('Starting venue scraping...');
    
    try {
      // Scrape each venue
      const [orangePeelEvents, greyEagleEvents, musicHallEvents, oneWorldEvents] = await Promise.allSettled([
        this.scrapeOrangePeel(),
        this.scrapeGreyEagle(),
        this.scrapeAshevilleMusicHall(),
        this.scrapeOneWorldBrewing()
      ]);

      // Save events to database
      if (orangePeelEvents.status === 'fulfilled') {
        await this.saveEventsToDatabase(orangePeelEvents.value, 'The Orange Peel');
      }
      
      if (greyEagleEvents.status === 'fulfilled') {
        await this.saveEventsToDatabase(greyEagleEvents.value, 'The Grey Eagle');
      }
      
      if (musicHallEvents.status === 'fulfilled') {
        await this.saveEventsToDatabase(musicHallEvents.value, 'Asheville Music Hall');
      }
      
      if (oneWorldEvents.status === 'fulfilled') {
        await this.saveEventsToDatabase(oneWorldEvents.value, 'One World Brewing');
      }

      console.log('Venue scraping completed successfully');
    } catch (error) {
      console.error('Error during venue scraping:', error);
    }
  }
}