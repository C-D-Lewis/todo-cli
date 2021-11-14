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
export const formatDate = (timestamp: number) => {
  const str = new Date(timestamp).toISOString();
  const [date, time] = str.split('T');
  return `${date} ${time.split(':').slice(0, 2).join(':')}`;
};
