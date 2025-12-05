/**
 * Date and Week Helper Utilities
 */
import { DAYS_OF_WEEK, type DayOfWeek } from '@/types';

/**
 * Get date for a specific day in the week with offset
 * @param dayName - Vietnamese day name (e.g., "Thứ Hai")
 * @param weekOffset - Week offset (0 = current week, 1 = next week, -1 = last week)
 */
export const getDateForDay = (dayName: DayOfWeek, weekOffset: number = 0): Date => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const targetDayIndex = DAYS_OF_WEEK.indexOf(dayName);

  // Calculate days difference
  let daysToAdd = targetDayIndex - (currentDay === 0 ? 6 : currentDay - 1);
  daysToAdd += weekOffset * 7;

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysToAdd);
  return targetDate;
};

/**
 * Format date to Vietnamese format (dd/mm/yyyy)
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("vi-VN", { 
    day: "2-digit", 
    month: "2-digit",
    year: "numeric"
  });
};

/**
 * Format date for display (dd/mm)
 */
export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString("vi-VN", { 
    day: "2-digit", 
    month: "2-digit" 
  });
};

/**
 * Check if a day is today
 */
export const isToday = (dayName: DayOfWeek, weekOffset: number = 0): boolean => {
  const targetDate = getDateForDay(dayName, weekOffset);
  const today = new Date();
  return (
    targetDate.getDate() === today.getDate() &&
    targetDate.getMonth() === today.getMonth() &&
    targetDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Get week identifier (year-week format)
 */
export const getWeekIdentifier = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
};

/**
 * Get current week number
 */
export const getCurrentWeekNumber = (): number => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const days = Math.floor((today.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
};

/**
 * Parse date string (dd/mm/yyyy) to Date object
 */
export const parseDateString = (dateStr: string): Date | null => {
  try {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  } catch {
    return null;
  }
};
