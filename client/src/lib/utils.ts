import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function formatTime(time: string): string {
  return time;
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

export function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
}

export function isThisWeek(date: Date): boolean {
  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekEnd = getWeekEnd(now);
  return date >= weekStart && date <= weekEnd;
}

export function getGenreColor(genre: string): string {
  const colors: Record<string, string> = {
    'Rock': 'bg-purple-500',
    'Folk': 'bg-sage',
    'Jazz': 'bg-blue-500',
    'Electronic': 'bg-cyan-500',
    'Country': 'bg-yellow-500',
    'Comedy': 'bg-red-500',
    'Reggae': 'bg-green-500',
    'Hip-Hop': 'bg-orange-500',
    'Blues': 'bg-indigo-500',
    'Americana': 'bg-amber-500',
    'Indie': 'bg-pink-500',
    'Alternative': 'bg-violet-500'
  };
  return colors[genre] || 'bg-gray-500';
}
