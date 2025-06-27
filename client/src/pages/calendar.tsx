import { NavigationHeader } from "@/components/navigation-header";
import { CalendarWidget } from "@/components/calendar-widget";

export default function Calendar() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-forest to-sage text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Event Calendar</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Plan your entertainment schedule with our comprehensive calendar view
            </p>
          </div>
        </div>
      </section>

      <CalendarWidget />
    </div>
  );
}
