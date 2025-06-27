import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDaysInMonth, getFirstDayOfMonth } from "@/lib/date-utils";
import type { EventWithVenue } from "@shared/schema";

export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data: events } = useQuery<EventWithVenue[]>({
    queryKey: [`/api/events/calendar/${year}/${month + 1}`],
  });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDay = (day: number) => {
    if (!events) return [];
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year;
    });
  };

  const getEventColor = (genre?: string) => {
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
    return colors[genre || ''] || "bg-gray-500";
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar days including previous month's trailing days
  const calendarDays = [];
  
  // Add previous month's trailing days
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
  
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      events: []
    });
  }
  
  // Add current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      events: getEventsForDay(day)
    });
  }
  
  // Add next month's leading days to fill the grid
  const remainingDays = 42 - calendarDays.length; // 6 weeks * 7 days
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      events: []
    });
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-forest mb-4">Event Calendar</h2>
          <p className="text-lg text-charcoal max-w-2xl mx-auto">Plan your entertainment schedule with our interactive calendar</p>
        </div>
        
        {/* Calendar Controls */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <Button
              onClick={previousMonth}
              variant="outline"
              className="bg-forest text-white border-forest hover:bg-sage"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <h3 className="text-xl font-display font-bold text-charcoal">
              {monthNames[month]} {year}
            </h3>
            <Button
              onClick={nextMonth}
              variant="outline"
              className="bg-forest text-white border-forest hover:bg-sage"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              className={view === 'month' ? "bg-sunset text-white" : "border border-sunset text-sunset hover:bg-sunset hover:text-white"}
              onClick={() => setView('month')}
            >
              Month
            </Button>
            <Button 
              className={view === 'week' ? "bg-sunset text-white" : "border border-sunset text-sunset hover:bg-sunset hover:text-white"}
              onClick={() => setView('week')}
            >
              Week
            </Button>
            <Button 
              className={view === 'day' ? "bg-sunset text-white" : "border border-sunset text-sunset hover:bg-sunset hover:text-white"}
              onClick={() => setView('day')}
            >
              Day
            </Button>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="bg-gray-50 rounded-xl p-6">
          {/* Calendar header */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center font-semibold text-charcoal py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-4">
            {calendarDays.map((dayData, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg p-2 hover:shadow-md transition-shadow cursor-pointer min-h-[100px] ${
                  dayData.events.length > 0 ? 'border-l-4 border-sunset' : ''
                } ${!dayData.isCurrentMonth ? 'opacity-50' : ''}`}
              >
                <div className={`text-center font-semibold mb-1 ${
                  !dayData.isCurrentMonth ? 'text-gray-400' : 'text-charcoal'
                }`}>
                  {dayData.day}
                </div>
                <div className="space-y-1">
                  {dayData.events.slice(0, 2).map((event, eventIndex) => (
                    <Badge
                      key={eventIndex}
                      className={`${getEventColor(event.genre)} text-white text-xs px-2 py-1 rounded truncate block`}
                    >
                      {event.title}
                    </Badge>
                  ))}
                  {dayData.events.length > 2 && (
                    <div className="text-xs text-sunset">
                      +{dayData.events.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
