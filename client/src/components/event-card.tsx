import { Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTime, formatDate } from "@/lib/date-utils";
import type { EventWithVenue } from "@shared/schema";

interface EventCardProps {
  event: EventWithVenue;
  featured?: boolean;
}

export function EventCard({ event, featured = false }: EventCardProps) {
  const getGenreColor = (genre?: string) => {
    if (!genre) return "bg-gray-500";
    
    const colors: Record<string, string> = {
      "Rock": "bg-purple-500",
      "Folk": "bg-sage",
      "Jazz": "bg-blue-500",
      "Electronic": "bg-cyan-500",
      "Country": "bg-yellow-500",
      "Comedy": "bg-pink-500",
      "Reggae": "bg-green-500",
      "Americana": "bg-amber-500",
      "Local": "bg-blue-500",
      "Special Events": "bg-red-500"
    };
    
    return colors[genre] || "bg-gray-500";
  };

  const cardClasses = featured 
    ? "bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 hover-lift"
    : "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift";

  return (
    <Card className={cardClasses}>
      <div className="relative">
        <img 
          src={event.imageUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400'} 
          alt={event.title}
          className={`w-full object-cover ${featured ? 'h-64' : 'h-48'}`}
        />
        {event.isSoldOut && (
          <div className="absolute top-4 right-4">
            <Badge variant="destructive" className="font-semibold">
              SOLD OUT
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          {event.genre && (
            <Badge className={`${getGenreColor(event.genre)} text-white`}>
              {event.genre}
            </Badge>
          )}
          <span className="text-forest font-semibold">
            {formatDate(event.startDate)}
          </span>
        </div>
        
        <h3 className={`font-display font-bold text-charcoal mb-2 ${featured ? 'text-2xl' : 'text-xl'}`}>
          {event.title}
        </h3>
        
        {event.description && (
          <p className="text-gray-600 mb-3 text-sm">
            {event.description}
          </p>
        )}
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-2 text-sage" />
          <span className="text-sm">{event.venue.name}</span>
        </div>
        
        {event.startTime && (
          <div className="flex items-center text-gray-600 mb-4">
            <Clock className="w-4 h-4 mr-2 text-sage" />
            <span className="text-sm">
              {event.startTime}
              {event.ageRestriction && ` • ${event.ageRestriction}`}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className={`font-bold text-sunset ${featured ? 'text-xl' : 'text-lg'}`}>
            {event.price}
          </span>
          <Button 
            className="bg-forest hover:bg-sage text-white transition-colors"
            onClick={() => event.ticketUrl && window.open(event.ticketUrl, '_blank')}
            disabled={event.isSoldOut}
          >
            {event.isSoldOut ? 'Sold Out' : 'Get Tickets'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
