import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavigationHeader } from "@/components/navigation-header";
import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EventWithVenue } from "@shared/schema";

export default function Archive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const { data: allEvents, isLoading } = useQuery<EventWithVenue[]>({
    queryKey: ["/api/events"],
  });

  // Filter for past events
  const pastEvents = allEvents?.filter(event => 
    new Date(event.startDate) < new Date()
  ) || [];

  // Filter events based on search and date filters
  const filteredEvents = pastEvents.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.genre?.toLowerCase().includes(searchQuery.toLowerCase());

    const eventDate = new Date(event.startDate);
    const matchesYear = !selectedYear || eventDate.getFullYear().toString() === selectedYear;
    const matchesMonth = !selectedMonth || (eventDate.getMonth() + 1).toString() === selectedMonth;

    return matchesSearch && matchesYear && matchesMonth;
  });

  // Get unique years and months from past events
  const availableYears = [...new Set(pastEvents.map(event => 
    new Date(event.startDate).getFullYear().toString()
  ))].sort((a, b) => parseInt(b) - parseInt(a));

  const availableMonths = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  const handleSearch = () => {
    // Search is handled in real-time via the filter
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedYear("");
    setSelectedMonth("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-forest to-sage text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Event Archive</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Browse through past events and relive Asheville's music history
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search past events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-4 pr-12"
                />
                <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Year Filter */}
            <div className="w-full lg:w-40">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Years</SelectItem>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Month Filter */}
            <div className="w-full lg:w-40">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Months</SelectItem>
                  {availableMonths.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <Button 
              variant="outline"
              onClick={clearFilters}
              className="border-sunset text-sunset hover:bg-sunset hover:text-white"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Archive Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Loading archive...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display font-bold text-charcoal">
                  Past Events
                </h2>
                <span className="text-gray-600">
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="relative">
                    <EventCard event={event} />
                    <div className="absolute top-4 left-4">
                      <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        Past Event
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-charcoal mb-4">No past events found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedYear || selectedMonth ? 
                  "No past events match your current filters. Try adjusting your search criteria." :
                  "No past events are available in our archive yet."
                }
              </p>
              {(searchQuery || selectedYear || selectedMonth) && (
                <Button 
                  onClick={clearFilters}
                  className="bg-sunset hover:bg-orange-600 text-white"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
