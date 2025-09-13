/**
 * Utility functions for handling event dates consistently across the application
 */

/**
 * Safely parse an event date, handling different formats and edge cases
 * @param {string|Date} dateInput - The date to parse
 * @param {string} timeInput - Optional time string (HH:MM format)
 * @returns {Date|null} - Parsed date or null if invalid
 */
export const parseEventDate = (dateInput, timeInput = null) => {
  try {
    if (!dateInput) return null;

    let eventDate;

    // Handle Date object
    if (dateInput instanceof Date) {
      eventDate = new Date(dateInput);
    } 
    // Handle string dates
    else if (typeof dateInput === 'string') {
      eventDate = new Date(dateInput);
    } 
    // Handle other types
    else {
      console.warn('Invalid date input type:', typeof dateInput, dateInput);
      return null;
    }

    // Check if the date is valid
    if (isNaN(eventDate.getTime())) {
      console.warn('Invalid date parsed:', dateInput);
      return null;
    }

    // Add time if provided
    if (timeInput && typeof timeInput === 'string' && timeInput.includes(':')) {
      const [hours, minutes] = timeInput.split(':');
      eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    }

    return eventDate;
  } catch (error) {
    console.error('Error parsing event date:', error, { dateInput, timeInput });
    return null;
  }
};

/**
 * Determine if an event is completed based on its date and time
 * @param {Object} event - Event object with Date and Time properties
 * @returns {string} - 'completed' or 'upcoming'
 */
export const getEventStatus = (event) => {
  try {
    const eventDate = parseEventDate(event.Date, event.Time);
    
    if (!eventDate) {
      console.warn('Could not parse date for event:', event.ID, event.Date);
      return 'upcoming'; // Default to upcoming if date is invalid
    }

    const now = new Date();
    const isPast = eventDate < now;
    
    // If event is more than 24 hours old, consider it completed
    const hoursDiff = (now - eventDate) / (1000 * 60 * 60);
    const isCompleted = isPast && hoursDiff > 24;
    
    return isCompleted ? 'completed' : 'upcoming';
  } catch (error) {
    console.error('Error determining event status:', error, event);
    return 'upcoming'; // Default to upcoming on error
  }
};

/**
 * Format a date for display
 * @param {string|Date} dateInput - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export const formatEventDate = (dateInput, options = {}) => {
  try {
    const eventDate = parseEventDate(dateInput);
    
    if (!eventDate) {
      return 'Invalid Date';
    }

    const defaultOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };

    return eventDate.toLocaleDateString(undefined, { ...defaultOptions, ...options });
  } catch (error) {
    console.error('Error formatting event date:', error, dateInput);
    return 'Invalid Date';
  }
};

/**
 * Check if two dates are on the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} - True if same day
 */
export const isSameDay = (date1, date2) => {
  try {
    if (!date1 || !date2) return false;
    
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);
    
    return d1.toDateString() === d2.toDateString();
  } catch (error) {
    console.error('Error comparing dates:', error, { date1, date2 });
    return false;
  }
};
