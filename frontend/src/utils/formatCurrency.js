/**
 * Format currency to Vietnamese Dong (e.g. 3500000 -> "3.500.000đ")
 * @param {number|string} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return '0đ';
  return Number(amount).toLocaleString('vi-VN') + 'đ';
}

export default formatCurrency;
