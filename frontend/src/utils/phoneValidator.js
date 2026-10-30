/**
 * Tiện ích kiểm tra và chuẩn hóa số điện thoại & ngày sinh theo quy chuẩn PhotoStudio
 * 1. Số điện thoại:
 *    - Bắt đầu bằng số 0
 *    - Số thứ hai phải là 3, 5, 7, 8, 9
 *    - Độ dài đúng 10 ký tự
 *    - Ví dụ hợp lệ: 0901234567, 0325178029, 0868123456, 0791234567, 0581234567
 * 
 * 2. Ngày sinh:
 *    - Không cho phép lớn hơn ngày hiện tại
 *    - Tuổi tính chính xác theo năm/tháng/ngày hiện tại trừ năm/tháng/ngày sinh >= 13 tuổi
 */

export const VN_PHONE_REGEX = /^0[35789]\d{8}$/;

/**
 * Kiểm tra số điện thoại: Bắt đầu bằng 0, số thứ hai là 3, 5, 7, 8, 9, độ dài 10 chữ số
 * @param {string} phone
 * @returns {{
 *   isValid: boolean,
 *   message: string,
 *   suggestedPhone: string|null,
 *   normalizedPhone: string
 * }}
 */
export function validateVietnamesePhone(phone) {
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return {
      isValid: false,
      message: 'Số điện thoại không được để trống.',
      suggestedPhone: null,
      normalizedPhone: '',
    };
  }

  // Loại bỏ khoảng trắng thừa, dấu gạch nối hoặc dấu chấm
  let cleaned = phone.trim().replace(/[\s.-]/g, '');

  // Nếu người dùng nhập đầu số quốc tế +84 hoặc 84, tự động chuyển về đầu 0
  let suggested = null;
  if (cleaned.startsWith('+84')) {
    suggested = '0' + cleaned.slice(3);
    cleaned = suggested;
  } else if (cleaned.startsWith('84') && cleaned.length === 11) {
    suggested = '0' + cleaned.slice(2);
    cleaned = suggested;
  }

  // 1. Kiểm tra ký tự: Chỉ được chứa số
  if (!/^\d+$/.test(cleaned)) {
    return {
      isValid: false,
      message: 'Số điện thoại chỉ được chứa các chữ số.',
      suggestedPhone: null,
      normalizedPhone: cleaned,
    };
  }

  // 2. Kiểm tra bắt đầu bằng số 0
  if (!cleaned.startsWith('0')) {
    return {
      isValid: false,
      message: 'Số điện thoại phải bắt đầu bằng số 0 (Ví dụ: 0901234567).',
      suggestedPhone: '0' + cleaned,
      normalizedPhone: cleaned,
    };
  }

  // 3. Kiểm tra độ dài: Đúng 10 ký tự
  if (cleaned.length !== 10) {
    return {
      isValid: false,
      message: `Số điện thoại phải có đúng 10 chữ số (hiện tại có ${cleaned.length} số).`,
      suggestedPhone: null,
      normalizedPhone: cleaned,
    };
  }

  // 4. Kiểm tra số thứ hai: phải là 3, 5, 7, 8, 9
  const secondChar = cleaned.charAt(1);
  if (!['3', '5', '7', '8', '9'].includes(secondChar)) {
    return {
      isValid: false,
      message: 'Số thứ hai phải là 3, 5, 7, 8 hoặc 9 (các đầu số di động: 03, 05, 07, 08, 09).',
      suggestedPhone: null,
      normalizedPhone: cleaned,
    };
  }

  return {
    isValid: true,
    message: '',
    suggestedPhone: null,
    normalizedPhone: cleaned,
  };
}

/**
 * Kiểm tra nhanh số điện thoại có hợp lệ (bắt đầu bằng 0, số thứ 2 là 3,5,7,8,9, dài 10 số)
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  let cleaned = phone.trim().replace(/[\s.-]/g, '');
  if (cleaned.startsWith('+84')) {
    cleaned = '0' + cleaned.slice(3);
  }
  return VN_PHONE_REGEX.test(cleaned);
}

// Giữ lại alias để tương thích các component cũ
export const validateVietnameseE164Phone = validateVietnamesePhone;
export const isE164Phone = isValidPhone;

/**
 * Kiểm tra điều kiện ngày sinh:
 * - Không cho phép lớn hơn ngày hiện tại
 * - Tính năm/tháng/ngày hiện tại trừ năm/tháng/ngày nhập phải >= 13 tuổi
 * @param {string|Date} dob - Ngày sinh dạng YYYY-MM-DD
 * @returns {{
 *   isValid: boolean,
 *   message: string,
 *   age: number|null
 * }}
 */
export function validateDateOfBirth(dob) {
  if (!dob) {
    return {
      isValid: true,
      message: '',
      age: null,
    };
  }

  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) {
    return {
      isValid: false,
      message: 'Ngày sinh không hợp lệ.',
      age: null,
    };
  }

  const today = new Date();
  const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const birthZero = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  // 1. Không cho phép lớn hơn ngày hiện tại
  if (birthZero > todayZero) {
    return {
      isValid: false,
      message: 'Ngày sinh không được lớn hơn ngày hiện tại.',
      age: null,
    };
  }

  // 2. Tính tuổi chính xác theo năm/tháng/ngày:
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  if (age < 13) {
    return {
      isValid: false,
      message: `Người dùng phải từ đủ 13 tuổi trở lên để sử dụng dịch vụ (hiện tại tính được ${age} tuổi).`,
      age,
    };
  }

  return {
    isValid: true,
    message: '',
    age,
  };
}

/**
 * Kiểm tra địa chỉ có hợp lệ không
 * @param {string} address
 * @returns {boolean}
 */
export function isAddressValid(address) {
  return Boolean(address && typeof address === 'string' && address.trim().length >= 5);
}

export default {
  validateVietnamesePhone,
  isValidPhone,
  validateVietnameseE164Phone,
  isE164Phone,
  validateDateOfBirth,
  isAddressValid,
};
