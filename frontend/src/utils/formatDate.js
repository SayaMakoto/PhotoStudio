/**
 * Format date to Vietnamese format (e.g. "28/10/2026")
 * @param {string|Date} dateInput
 * @param {boolean} includeTime
 * @returns {string}
 */
export function formatDate(dateInput, includeTime = false) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  if (includeTime) {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }
  return `${day}/${month}/${year}`;
}

export default formatDate;
