import { useState } from "react";
import { Search } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to events page with search query
      window.location.href = `/events?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-forest to-sage text-white">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Discover Asheville's
            <span className="text-sunset block">Live Music Scene</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your one-stop destination for concerts, shows, and events across Asheville's premier venues
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search events, artists, or venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-6 py-4 text-charcoal text-lg pr-14 bg-white border-0 focus:ring-2 focus:ring-sunset"
              />
              <Button 
                onClick={handleSearch}
                className="absolute right-2 top-2 bg-sunset hover:bg-orange-600 text-white px-4 py-2"
                size="sm"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/events">
              <Button className="bg-sunset hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold">
                Browse All Events
              </Button>
            </Link>
            <Link href="/calendar">
              <Button 
                variant="outline" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-forest px-8 py-3 text-lg font-semibold"
              >
                View Calendar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
