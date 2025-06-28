import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavigationHeader } from "@/components/navigation-header";
import { EventCard } from "@/components/event-card";
import { FilterSection } from "@/components/filter-section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { EventWithVenue } from "@shared/schema";
import type { SearchFilters } from "@/types";

export default function Events() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Get search query from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
      setFilters(prev => ({ ...prev, search: searchParam }));
    }
  }, []);

  const { data: events, isLoading } = useQuery<EventWithVenue[]>({
    queryKey: ["/api/events", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value);
        }
      });
      const url = `/api/events${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return response.json();
    },
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setFilters(prev => ({ ...prev, search: searchQuery }));
    } else {
      setFilters(prev => {
        const { search, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    // Merge new filters with existing ones, preserving search
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Keep search if it exists
      ...(prev.search && { search: prev.search })
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-forest to-sage text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">All Events</h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Discover every concert, show, and event happening in Asheville
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="Search events, artists, or venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-6 py-3 text-charcoal text-lg pr-16 bg-white border-0 rounded-lg h-12"
                />
                <Button 
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-sunset hover:bg-orange-600 text-white px-3 py-2 rounded-md h-8"
                  size="sm"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <FilterSection 
        onFiltersChange={handleFiltersChange} 
        showQuickFilters={false}
        currentFilters={filters}
      />

      {/* Events Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Loading events...</p>
            </div>
          ) : events && events.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display font-bold text-charcoal">
                  {filters.search ? `Search Results for "${filters.search}"` : 'All Events'}
                </h2>
                <span className="text-gray-600">
                  {events.length} event{events.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-charcoal mb-4">No events found</h3>
              <p className="text-gray-600 mb-6">
                {filters.search ? 
                  `No events match your search for "${filters.search}". Try different keywords or clear your filters.` :
                  "No events match your current filters. Try adjusting your search criteria."
                }
              </p>
              <Button 
                onClick={() => {
                  setFilters({});
                  setSearchQuery("");
                }}
                className="bg-sunset hover:bg-orange-600 text-white"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
