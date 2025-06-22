// Time conversion utilities with validation

/**
 * Validates if a time string is in valid 12-hour format (HH:MM AM/PM)
 * @param {string} time12 - Time string in 12-hour format
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValid12HourFormat(time12) {
  if (!time12 || typeof time12 !== 'string') return false;
  
  const regex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;
  return regex.test(time12.trim());
}

/**
 * Validates if a time string is in valid 24-hour format (HH:MM)
 * @param {string} time24 - Time string in 24-hour format
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValid24HourFormat(time24) {
  if (!time24 || typeof time24 !== 'string') return false;
  
  const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  return regex.test(time24.trim());
}

/**
 * Converts 12-hour format time to 24-hour format
 * @param {string} time12 - Time string in 12-hour format (e.g., "2:30 PM")
 * @returns {string|null} - Time string in 24-hour format or null if invalid
 */
export function convert12To24(time12) {
  if (!isValid12HourFormat(time12)) return null;
  
  const cleanTime = time12.trim().toUpperCase();
  const [timePart, period] = cleanTime.split(/\s+/);
  const [hours, minutes] = timePart.split(':');
  
  let hour24 = parseInt(hours, 10);
  
  if (period === 'AM') {
    if (hour24 === 12) hour24 = 0;
  } else if (period === 'PM') {
    if (hour24 !== 12) hour24 += 12;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes}`;
}

/**
 * Converts 24-hour format time to 12-hour format
 * @param {string} time24 - Time string in 24-hour format (e.g., "14:30")
 * @returns {string|null} - Time string in 12-hour format or null if invalid
 */
export function convert24To12(time24) {
  if (!isValid24HourFormat(time24)) return null;
  
  const [hours, minutes] = time24.trim().split(':');
  const hour24 = parseInt(hours, 10);
  
  let hour12 = hour24;
  let period = 'AM';
  
  if (hour24 === 0) {
    hour12 = 12;
  } else if (hour24 === 12) {
    period = 'PM';
  } else if (hour24 > 12) {
    hour12 = hour24 - 12;
    period = 'PM';
  }
  
  return `${hour12}:${minutes} ${period}`;
}

/**
 * Formats time input to ensure consistent format
 * @param {string} input - Raw time input
 * @param {string} format - Target format ('12' or '24')
 * @returns {string} - Formatted time string
 */
export function formatTimeInput(input, format) {
  if (!input) return '';
  
  let cleaned = input.trim().toUpperCase();
  
  if (format === '12') {
    // Add AM/PM if missing
    if (!/\s?(AM|PM)$/i.test(cleaned)) {
      cleaned += ' AM';
    }
    // Ensure space before AM/PM
    cleaned = cleaned.replace(/([0-9])(AM|PM)/i, '$1 $2');
  }
  
  return cleaned;
}

/**
 * Gets current time in both formats
 * @returns {object} - Object with time12 and time24 properties
 */
export function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  const time24 = `${hours.toString().padStart(2, '0')}:${minutes}`;
  const time12 = convert24To12(time24);
  
  return { time12, time24 };
}

