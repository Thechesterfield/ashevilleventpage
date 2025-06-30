import { useQuery } from "@tanstack/react-query";
import { NavigationHeader } from "@/components/navigation-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ExternalLink, Users } from "lucide-react";
import type { VenueWithEvents } from "@shared/schema";

export default function Venues() {
  const { data: venues, isLoading } = useQuery<VenueWithEvents[]>({
    queryKey: ["/api/venues/with-events"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-forest to-sage text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Venues</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Explore Asheville's premier music venues and entertainment destinations
            </p>
          </div>
        </div>
      </section>

      {/* Venues Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Loading venues...</p>
            </div>
          ) : venues && venues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {venues.map((venue) => (
                <Card key={venue.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 hover-lift">
                  <div className="relative">
                    <img 
                      src={venue.imageUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300'} 
                      alt={venue.name}
                      className="w-full h-48 object-cover"
                    />
                    {venue.capacity && (
                      <Badge className="absolute top-4 right-4 bg-forest text-white">
                        <Users className="w-3 h-3 mr-1" />
                        {venue.capacity}
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-display font-bold text-2xl mb-3 text-charcoal">{venue.name}</h3>
                    
                    <div className="flex items-start text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2 mt-1 text-sage flex-shrink-0" />
                      <span className="text-sm">{venue.address}</span>
                    </div>
                    
                    {venue.description && (
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {venue.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sage font-semibold">
                        {venue.eventCount || 0} upcoming events
                      </span>
                      {venue.capacity && (
                        <span className="text-sm text-gray-500">
                          Capacity: {venue.capacity}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-forest hover:bg-sage text-white"
                        onClick={() => {
                          // Navigate to venue events
                          window.location.href = `/events?venue=${encodeURIComponent(venue.name)}`;
                        }}
                      >
                        View Events
                      </Button>
                      {venue.website && (
                        <Button 
                          variant="outline"
                          className="border-sunset text-sunset hover:bg-sunset hover:text-white"
                          onClick={() => window.open(venue.website, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-charcoal mb-4">No venues found</h3>
              <p className="text-gray-600">We're working on adding more venues to our directory.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
