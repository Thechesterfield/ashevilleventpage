import { QueryClient, QueryFunction } from "@tanstack/react-query";
import eventsData from "../data/events-current.json";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// Fallback data processing functions using authentic scraped data
function getEventsThisWeek() {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  return eventsData.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate >= weekStart && eventDate <= weekEnd;
  });
}

function getFeaturedEvents() {
  return eventsData.filter(event => event.isFeatured);
}

function getVenuesWithEvents() {
  const venues = Array.from(new Set(eventsData.map(event => event.venue)));
  return venues.map(venue => ({
    ...venue,
    upcomingEvents: eventsData.filter(event => event.venue.id === venue.id),
    eventCount: eventsData.filter(event => event.venue.id === venue.id).length
  }));
}

function getFilterOptions() {
  const genres = Array.from(new Set(eventsData.map(event => event.genre).filter(Boolean)));
  const venues = Array.from(new Set(eventsData.map(event => event.venue.name)));
  return { genres, venues };
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    
    try {
      const res = await fetch(url, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      // Use authentic scraped data as fallback when API is unavailable
      console.log(`API unavailable, using authentic scraped data for ${url}`);
      
      if (url.includes('/api/events/this-week')) {
        return getEventsThisWeek() as T;
      }
      if (url.includes('/api/events/featured')) {
        return getFeaturedEvents() as T;
      }
      if (url.includes('/api/events')) {
        return eventsData as T;
      }
      if (url.includes('/api/venues')) {
        return getVenuesWithEvents() as T;
      }
      if (url.includes('/api/filters')) {
        return getFilterOptions() as T;
      }
      
      // For calendar events, filter by date
      const calendarMatch = url.match(/\/api\/events\/calendar\/(\d+)\/(\d+)/);
      if (calendarMatch) {
        const [, year, month] = calendarMatch;
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0);
        
        return eventsData.filter(event => {
          const eventDate = new Date(event.startDate);
          return eventDate >= startDate && eventDate <= endDate;
        }) as T;
      }
      
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
