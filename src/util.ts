/**
 * Pad a number with a space.
 *
 * @param {number} v - Value to pad.
 * @returns {string} Padded value.
 */
export const spacePad = (v: number) => (v < 10 ? ` ${v}` : v);

/**
 * Format a todo item date.
 *
 * @param {number} timestamp - Timestamp to format.
 * @returns {string} Formatted date.
 */
export const formatDate = (timestamp: number): string => {
  const str = new Date(timestamp).toISOString();
  const [date, time] = str.split('T');

  return `${date} ${time.split(':').slice(0, 2).join(':')}`;
};

/**
 * Format 'x ago' string.
 *
 * @param {number} timestamp - Timestamp in the past.
 * @returns {string} Format string.
 */
export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const then = new Date(timestamp).getTime();

  const minsAgo = Math.round((now - then) / 60000);
  if (minsAgo < 60) return `${minsAgo} minutes ago`;

  const hoursAgo = Math.round(minsAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo} hours ago`;

  const daysAgo = Math.round(hoursAgo / 24);
  return `${daysAgo} days ago`;
};
