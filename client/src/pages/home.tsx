import { NavigationHeader } from "@/components/navigation-header";
import { HeroSection } from "@/components/hero-section";
import { EventsThisWeek } from "@/components/events-this-week";
import { VenueSpotlight } from "@/components/venue-spotlight";
import { CalendarWidget } from "@/components/calendar-widget";
import { FilterSection } from "@/components/filter-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      <HeroSection />
      <EventsThisWeek />
      <VenueSpotlight />
      <CalendarWidget />
      <FilterSection showQuickFilters={true} />
      
      {/* Footer */}
      <footer className="bg-forest text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div>
              <h3 className="text-2xl font-display font-bold mb-4">Asheville Live</h3>
              <p className="text-gray-300 mb-6">Your complete guide to Asheville's vibrant music and entertainment scene. Never miss a show again.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-sunset transition-colors">
                  <i className="fab fa-facebook-f text-xl"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-sunset transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-sunset transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-sunset transition-colors">
                  <i className="fab fa-spotify text-xl"></i>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/events" className="text-gray-300 hover:text-sunset transition-colors">All Events</a></li>
                <li><a href="/calendar" className="text-gray-300 hover:text-sunset transition-colors">Calendar</a></li>
                <li><a href="/venues" className="text-gray-300 hover:text-sunset transition-colors">Venues</a></li>
                <li><a href="/archive" className="text-gray-300 hover:text-sunset transition-colors">Event Archive</a></li>
                <li><a href="#about" className="text-gray-300 hover:text-sunset transition-colors">About Us</a></li>
              </ul>
            </div>
            
            {/* Venues */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Featured Venues</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-sunset transition-colors">The Orange Peel</a></li>
                <li><a href="#" className="text-gray-300 hover:text-sunset transition-colors">The Grey Eagle</a></li>
                <li><a href="#" className="text-gray-300 hover:text-sunset transition-colors">Asheville Music Hall</a></li>
                <li><a href="#" className="text-gray-300 hover:text-sunset transition-colors">One World Brewing</a></li>
                <li><a href="/venues" className="text-gray-300 hover:text-sunset transition-colors">View All Venues</a></li>
              </ul>
            </div>
            
            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
              <p className="text-gray-300 mb-4">Get weekly event updates delivered to your inbox.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-4 py-2 rounded-l-lg text-charcoal focus:outline-none"
                />
                <button className="bg-sunset hover:bg-orange-600 px-4 py-2 rounded-r-lg transition-colors">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-sage mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2025 Asheville Live. Aggregating the best of Asheville's music scene.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-sunset text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-sunset text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-sunset text-sm transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
