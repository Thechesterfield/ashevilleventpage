import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { VenueWithEvents } from "@shared/schema";

export function VenueSpotlight() {
  const { data: venues, isLoading } = useQuery<VenueWithEvents[]>({
    queryKey: ["/api/venues/with-events"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-forest mb-4">Featured Venues</h2>
            <p className="text-lg text-charcoal max-w-2xl mx-auto">Loading venues...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-forest mb-4">Featured Venues</h2>
          <p className="text-lg text-charcoal max-w-2xl mx-auto">Asheville's premier music destinations</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {venues?.map((venue) => (
            <Card key={venue.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 hover-lift">
              <img 
                src={venue.imageUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300'} 
                alt={venue.name}
                className="w-full h-40 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="font-display font-bold text-xl mb-2 text-charcoal">{venue.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{venue.address}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sage">
                    {venue.eventCount || 0} upcoming shows
                  </span>
                  <Button 
                    variant="ghost"
                    className="text-sunset hover:text-orange-600 font-semibold p-0 h-auto"
                    onClick={() => venue.website && window.open(venue.website, '_blank')}
                  >
                    View Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
