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


/**
 * Validates if a time range string is in valid 12-hour format (HH:MM AM/PM to HH:MM AM/PM)
 * @param {string} timeRange12 - Time range string in 12-hour format
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidTimeRange12(timeRange12) {
  if (!timeRange12 || typeof timeRange12 !== 'string') return false;
  
  const rangeParts = timeRange12.split(/\s+to\s+/i);
  if (rangeParts.length !== 2) return false;
  
  const [startTime, endTime] = rangeParts;
  return isValid12HourFormat(startTime.trim()) && isValid12HourFormat(endTime.trim());
}

/**
 * Validates if a time range string is in valid 24-hour format (HH:MM to HH:MM)
 * @param {string} timeRange24 - Time range string in 24-hour format
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidTimeRange24(timeRange24) {
  if (!timeRange24 || typeof timeRange24 !== 'string') return false;
  
  const rangeParts = timeRange24.split(/\s+to\s+/i);
  if (rangeParts.length !== 2) return false;
  
  const [startTime, endTime] = rangeParts;
  return isValid24HourFormat(startTime.trim()) && isValid24HourFormat(endTime.trim());
}

/**
 * Parses a time range string and returns start and end times
 * @param {string} timeRange - Time range string (e.g., "2:30 PM to 3:30 PM")
 * @returns {object|null} - Object with startTime and endTime properties or null if invalid
 */
export function parseTimeRange(timeRange) {
  if (!timeRange || typeof timeRange !== 'string') return null;
  
  const rangeParts = timeRange.split(/\s+to\s+/i);
  if (rangeParts.length !== 2) return null;
  
  const [startTime, endTime] = rangeParts.map(time => time.trim());
  
  return {
    startTime,
    endTime
  };
}

/**
 * Converts 12-hour format time range to 24-hour format
 * @param {string} timeRange12 - Time range string in 12-hour format (e.g., "2:30 PM to 3:30 PM")
 * @returns {string|null} - Time range string in 24-hour format or null if invalid
 */
export function convertTimeRange12To24(timeRange12) {
  if (!isValidTimeRange12(timeRange12)) return null;
  
  const parsed = parseTimeRange(timeRange12);
  if (!parsed) return null;
  
  const startTime24 = convert12To24(parsed.startTime);
  const endTime24 = convert12To24(parsed.endTime);
  
  if (!startTime24 || !endTime24) return null;
  
  return `${startTime24} to ${endTime24}`;
}

/**
 * Converts 24-hour format time range to 12-hour format
 * @param {string} timeRange24 - Time range string in 24-hour format (e.g., "14:30 to 15:30")
 * @returns {string|null} - Time range string in 12-hour format or null if invalid
 */
export function convertTimeRange24To12(timeRange24) {
  if (!isValidTimeRange24(timeRange24)) return null;
  
  const parsed = parseTimeRange(timeRange24);
  if (!parsed) return null;
  
  const startTime12 = convert24To12(parsed.startTime);
  const endTime12 = convert24To12(parsed.endTime);
  
  if (!startTime12 || !endTime12) return null;
  
  return `${startTime12} to ${endTime12}`;
}

/**
 * Validates that the end time is after the start time in a time range
 * @param {string} timeRange - Time range string in either format
 * @returns {boolean} - True if end time is after start time, false otherwise
 */
export function isValidTimeRangeOrder(timeRange) {
  const parsed = parseTimeRange(timeRange);
  if (!parsed) return false;
  
  let startTime24, endTime24;
  
  // Try to convert to 24-hour format for comparison
  if (isValid12HourFormat(parsed.startTime)) {
    startTime24 = convert12To24(parsed.startTime);
    endTime24 = convert12To24(parsed.endTime);
  } else if (isValid24HourFormat(parsed.startTime)) {
    startTime24 = parsed.startTime;
    endTime24 = parsed.endTime;
  } else {
    return false;
  }
  
  if (!startTime24 || !endTime24) return false;
  
  // Convert to minutes for comparison
  const [startHour, startMin] = startTime24.split(':').map(Number);
  const [endHour, endMin] = endTime24.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return endMinutes > startMinutes;
}

/**
 * Formats time range input to ensure consistent format
 * @param {string} input - Raw time range input
 * @param {string} format - Target format ('12' or '24')
 * @returns {string} - Formatted time range string
 */
export function formatTimeRangeInput(input, format) {
  if (!input) return '';
  
  let cleaned = input.trim();
  
  // Normalize "to" separator
  cleaned = cleaned.replace(/\s*[-–—]\s*/g, ' to ');
  cleaned = cleaned.replace(/\s+to\s+/gi, ' to ');
  
  if (format === '12') {
    // Handle AM/PM for both times in the range
    const parts = cleaned.split(/\s+to\s+/i);
    if (parts.length === 2) {
      const formattedParts = parts.map(part => formatTimeInput(part.trim(), '12'));
      cleaned = formattedParts.join(' to ');
    }
  }
  
  return cleaned;
}

