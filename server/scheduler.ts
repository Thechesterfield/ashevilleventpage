import cron from 'node-cron';
import { VenueScraper } from './scrapers';
import { storage } from './storage';

export class EventScheduler {
  private scraper: VenueScraper;
  private isRunning: boolean = false;

  constructor() {
    this.scraper = new VenueScraper();
  }

  async updateEvents(): Promise<void> {
    if (this.isRunning) {
      console.log('Event update already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    console.log(`[${new Date().toISOString()}] Starting daily event update...`);

    try {
      // Clean up old events (older than 30 days)
      await this.cleanupOldEvents();
      
      // Scrape all venues for new events
      await this.scraper.scrapeAllVenues();
      
      console.log(`[${new Date().toISOString()}] Daily event update completed successfully`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error during daily event update:`, error);
    } finally {
      this.isRunning = false;
    }
  }

  private async cleanupOldEvents(): Promise<void> {
    console.log('Cleaning up old events...');
    
    try {
      const allEvents = await storage.getAllEvents();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const eventsToUpdate = allEvents.filter(event => 
        new Date(event.startDate) < thirtyDaysAgo && event.status !== 'past'
      );

      for (const event of eventsToUpdate) {
        await storage.updateEvent(event.id, { status: 'past' });
      }

      console.log(`Updated ${eventsToUpdate.length} events to past status`);
    } catch (error) {
      console.error('Error cleaning up old events:', error);
    }
  }

  startScheduler(): void {
    console.log('Starting event update scheduler...');
    
    // Run daily at 6:00 AM
    cron.schedule('0 6 * * *', async () => {
      await this.updateEvents();
    });

    // Also run every 6 hours for more frequent updates
    cron.schedule('0 */6 * * *', async () => {
      await this.updateEvents();
    });

    console.log('Event scheduler started - updates will run daily at 6:00 AM and every 6 hours');
    
    // Run initial update on startup (but not immediately, wait 30 seconds)
    setTimeout(async () => {
      console.log('Running initial event update...');
      await this.updateEvents();
    }, 30000);
  }

  stopScheduler(): void {
    console.log('Event scheduler stopped');
  }

  // Manual trigger for testing or immediate updates
  async triggerUpdate(): Promise<void> {
    console.log('Manually triggering event update...');
    await this.updateEvents();
  }

  getStatus(): { isRunning: boolean; nextRun: string | null } {
    return {
      isRunning: this.isRunning,
      nextRun: 'Scheduled for daily at 6:00 AM and every 6 hours'
    };
  }
}

export const eventScheduler = new EventScheduler();