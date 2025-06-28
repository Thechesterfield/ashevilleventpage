import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterOptions, SearchFilters } from "@/types";

interface FilterSectionProps {
  onFiltersChange?: (filters: SearchFilters) => void;
  showQuickFilters?: boolean;
  currentFilters?: SearchFilters;
}

export function FilterSection({ onFiltersChange, showQuickFilters = true, currentFilters = {} }: FilterSectionProps) {
  const [filters, setFilters] = useState<SearchFilters>(currentFilters);

  const { data: filterOptions } = useQuery<FilterOptions>({
    queryKey: ["/api/filters"],
  });

  // Update local state when currentFilters change from parent
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value === 'all' ? undefined : value
    };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const quickFilters = [
    { label: "Tonight", key: "tonight" },
    { label: "This Weekend", key: "weekend" },
    { label: "Free Events", key: "free" },
    { label: "All Ages", key: "all-ages" },
    { label: "Outdoor Events", key: "outdoor" }
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-forest mb-4">Find Your Perfect Event</h2>
          <p className="text-lg text-charcoal max-w-2xl mx-auto">Use our advanced filters to discover events that match your interests</p>
        </div>
        
        {/* Filter Controls */}
        <Card className="shadow-lg mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Genre</label>
                <Select 
                  value={filters.genre || 'all'} 
                  onValueChange={(value) => handleFilterChange('genre', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {filterOptions?.genres?.map((genre) => (
                      <SelectItem key={genre} value={genre.toLowerCase()}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Venue Filter */}
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Venue</label>
                <Select 
                  value={filters.venue || 'all'} 
                  onValueChange={(value) => handleFilterChange('venue', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Venues" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Venues</SelectItem>
                    {filterOptions?.venues?.map((venue) => (
                      <SelectItem key={venue} value={venue.toLowerCase()}>
                        {venue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Date Filter */}
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Date Range</label>
                <Select 
                  value={filters.dateRange || 'all'} 
                  onValueChange={(value) => handleFilterChange('dateRange', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="next-week">Next Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="next-month">Next Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Price Filter */}
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Price Range</label>
                <Select 
                  value={filters.priceRange || 'all'} 
                  onValueChange={(value) => handleFilterChange('priceRange', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="under-20">Under $20</SelectItem>
                    <SelectItem value="20-50">$20 - $50</SelectItem>
                    <SelectItem value="50-plus">$50+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button className="bg-sunset hover:bg-orange-600 text-white px-8 py-3 font-semibold">
                Apply Filters
              </Button>
              <Button 
                variant="outline"
                className="border-sunset text-sunset hover:bg-sunset hover:text-white px-8 py-3 font-semibold"
                onClick={clearAllFilters}
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Filter Tags */}
        {showQuickFilters && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {quickFilters.map((filter) => (
              <Button
                key={filter.key}
                variant="outline"
                className="bg-white border border-forest text-forest px-4 py-2 rounded-full text-sm hover:bg-forest hover:text-white transition-colors"
                onClick={() => {
                  // Handle quick filter logic here
                  console.log('Quick filter clicked:', filter.key);
                }}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
