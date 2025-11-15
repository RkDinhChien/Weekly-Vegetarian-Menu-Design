// Utility functions for week management

/**
 * Get week number and year for a given date
 * Format: "YYYY-WW" (e.g., "2025-46")
 */
export const getWeekIdentifier = (date: Date): string => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${date.getFullYear()}-${String(weekNumber).padStart(2, '0')}`;
};

/**
 * Get Monday of the week for a given date
 */
export const getMonday = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

/**
 * Get all dates in a week starting from Monday
 */
export const getWeekDates = (startDate: Date): Date[] => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
};

/**
 * Get week identifier for current week
 */
export const getCurrentWeekIdentifier = (): string => {
  return getWeekIdentifier(new Date());
};

/**
 * Format date to DD/MM/YYYY
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};
