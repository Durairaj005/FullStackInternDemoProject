// ─── Date Utility Functions ───────────────────────────────────────────────────
// Frontend-side date helpers formatted precisely for Feedants UI design reference.

/**
 * Formats a date string into a human-readable short format: "10 Aug 26"
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);
  return `${day} ${month} ${year}`;
};

/**
 * Formats time string: "11:50 PM" or "04:00 AM"
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = String(hours).padStart(2, '0');
  return `${strHours}:${minutes} ${ampm}`;
};

/**
 * Returns separated date & time object for the 2x2 Important Dates grid:
 * { date: "10 Aug 26", time: "11:50 PM" }
 */
export const formatDateTimeParts = (dateString: string): { date: string; time: string } => {
  return {
    date: formatDate(dateString),
    time: formatTime(dateString),
  };
};

/**
 * Formats a countdown from total seconds into the exact Feedants segmented format:
 * "01d : 06h : 28m : 32s"
 */
export const formatSegmentedCountdown = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return '00d : 00h : 00m : 00s';

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
};

const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * Converts a currency amount to formatted INR string.
 * Example: 1500 => "₹ 1,500"
 */
export const formatCurrency = (amount: number, currency = 'INR'): string => {
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol} ${amount.toLocaleString('en-IN')}`;
};

/**
 * Returns true if the registration window is closing within the next 24 hours.
 */
export const isClosingSoon = (registrationClosesInSeconds: number): boolean =>
  registrationClosesInSeconds > 0 && registrationClosesInSeconds < 86400;
