import { useQuery } from "@tanstack/react-query";
import { EventCard } from "./event-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import type { EventWithVenue } from "@shared/schema";

export function EventsThisWeek() {
  const { data: eventsThisWeek, isLoading } = useQuery<EventWithVenue[]>({
    queryKey: ["/api/events/this-week"],
  });

  const { data: featuredEvents } = useQuery<EventWithVenue[]>({
    queryKey: ["/api/events/featured"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-forest mb-4">Events This Week</h2>
            <p className="text-lg text-charcoal max-w-2xl mx-auto">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  const featuredEvent = featuredEvents?.[0];
  const regularEvents = eventsThisWeek?.filter(event => !event.isFeatured) || [];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-forest mb-4">Events This Week</h2>
          <p className="text-lg text-charcoal max-w-2xl mx-auto">Don't miss out on the hottest shows happening right now in Asheville</p>
        </div>
        
        {/* Featured Event */}
        {featuredEvent && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-forest to-sage rounded-2xl overflow-hidden shadow-2xl">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredEvent.imageUrl || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'} 
                    alt={featuredEvent.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 text-white">
                  <div className="flex items-center mb-4">
                    <span className="bg-sunset text-white px-3 py-1 rounded-full text-sm font-semibold">Featured</span>
                    <span className="ml-3 text-sm opacity-75">
                      {new Date(featuredEvent.startDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold mb-2">{featuredEvent.title}</h3>
                  {featuredEvent.description && (
                    <p className="text-lg mb-4">{featuredEvent.description}</p>
                  )}
                  <div className="flex items-center mb-4">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    <span>{featuredEvent.venue.name}</span>
                  </div>
                  <div className="flex items-center mb-6">
                    <i className="fas fa-clock mr-2"></i>
                    <span>
                      {featuredEvent.startTime} • {featuredEvent.ageRestriction}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-sunset">
                      {featuredEvent.price}
                    </span>
                    <Button 
                      variant="outline"
                      className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-forest"
                      onClick={() => featuredEvent.ticketUrl && window.open(featuredEvent.ticketUrl, '_blank')}
                    >
                      {featuredEvent.isSoldOut ? 'Sold Out' : 'Get Tickets'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Event Grid */}
        {regularEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularEvents.slice(0, 6).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">No events scheduled for this week.</p>
            <p className="text-gray-500">Check back soon for updates!</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/events">
            <Button className="bg-sunset hover:bg-orange-600 text-white px-8 py-3 font-semibold inline-flex items-center">
              View All Events
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
