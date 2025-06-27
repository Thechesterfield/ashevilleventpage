export interface SearchFilters {
  genre?: string;
  venue?: string;
  dateRange?: string;
  priceRange?: string;
  search?: string;
}

export interface CalendarDay {
  date: number;
  events: CalendarEventSummary[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface CalendarEventSummary {
  id: number;
  title: string;
  startTime: string;
  genre?: string;
  color: string;
}

export interface FilterOptions {
  genres: string[];
  venues: string[];
}
