import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getGenreColor } from "@/lib/utils";
import type { Event } from "@shared/schema";

export function CalendarSection() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({ date: prevMonthDay, isCurrentMonth: false });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }

    // Add empty cells to complete the last week
    const remainingCells = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      days.push({ date: nextMonthDay, isCurrentMonth: false });
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    if (!events) return [];
    
    const dateStr = date.toDateString();
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === dateStr;
    });
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentDate);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-forest mb-4">
              Event Calendar
            </h2>
            <p className="text-lg text-charcoal max-w-2xl mx-auto">
              Loading calendar...
            </p>
          </div>
          <div className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-forest mb-4">
            Event Calendar
          </h2>
          <p className="text-lg text-charcoal max-w-2xl mx-auto">
            Plan your entertainment schedule with our interactive calendar
          </p>
        </div>
        
        {/* Calendar Controls */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <Button
              onClick={() => navigateMonth('prev')}
              variant="outline"
              className="border-forest text-forest hover:bg-forest hover:text-white"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <h3 className="text-xl font-display font-bold text-charcoal">
              {monthName}
            </h3>
            <Button
              onClick={() => navigateMonth('next')}
              variant="outline"
              className="border-forest text-forest hover:bg-forest hover:text-white"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => setViewMode('month')}
              className={viewMode === 'month' ? "bg-sunset text-white" : "border border-sunset text-sunset hover:bg-sunset hover:text-white"}
              variant={viewMode === 'month' ? "default" : "outline"}
            >
              Month
            </Button>
            <Button
              onClick={() => setViewMode('week')}
              className={viewMode === 'week' ? "bg-sunset text-white" : "border border-sunset text-sunset hover:bg-sunset hover:text-white"}
              variant={viewMode === 'week' ? "default" : "outline"}
            >
              Week
            </Button>
            <Button
              onClick={() => setViewMode('day')}
              className={viewMode === 'day' ? "bg-sunset text-white" : "border border-sunset text-sunset hover:bg-sunset hover:text-white"}
              variant={viewMode === 'day' ? "default" : "outline"}
            >
              Day
            </Button>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="bg-gray-50 rounded-xl p-6">
          {/* Calendar header */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-charcoal py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-4">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day.date);
              const hasEvents = dayEvents.length > 0;
              
              return (
                <div
                  key={index}
                  className={`
                    bg-white rounded-lg p-2 hover:shadow-md transition-shadow cursor-pointer min-h-[80px]
                    ${hasEvents ? 'border-l-4 border-sunset' : ''}
                    ${!day.isCurrentMonth ? 'opacity-50' : ''}
                  `}
                >
                  <div className={`text-center font-semibold mb-1 ${!day.isCurrentMonth ? 'text-gray-400' : ''}`}>
                    {day.date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`${getGenreColor(event.genre || '')} text-white text-xs px-2 py-1 rounded truncate`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-sunset font-medium">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
