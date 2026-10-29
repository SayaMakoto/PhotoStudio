/**
 * src/lib/vnpay.js
 * Tiện ích tích hợp cổng thanh toán VNPay Sandbox (https://sandbox.vnpayment.vn/devreg)
 * Hỗ trợ tạo URL thanh toán chuẩn chữ ký HMAC-SHA512 và xác thực giao dịch trả về.
 */

export const VNPAY_CONFIG = {
  vnp_TmnCode: '2Q8OTT67', // Mã Terminal Sandbox mặc định của VNPay
  vnp_HashSecret: 'NBJVCVIHRQZPDEABEOGLOKZSJGXTTLLW', // Khóa bí mật Sandbox
  vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', // Cổng thanh toán Sandbox
  vnp_Version: '2.1.0',
  vnp_Command: 'pay',
  vnp_CurrCode: 'VND',
  vnp_Locale: 'vn',
};

// Thông tin tài khoản ngân hàng thử nghiệm Sandbox để hiển thị cho người dùng
export const VNPAY_TEST_ACCOUNTS = [
  {
    bankName: 'Ngân hàng NCB (Khuyên Dùng)',
    cardNumber: '9704198526191432198',
    cardHolder: 'NGUYEN VAN A',
    issueDate: '07/15',
    otp: '123456',
  },
];

/**
 * Tính mã băm HMAC-SHA512 bằng Web Crypto API tích hợp sẵn trong trình duyệt
 */
export async function hmacSHA512(key, data) {
  const enc = new TextEncoder();
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  );
  const signature = await window.crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    enc.encode(data)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Định dạng ngày giờ thành chuỗi yyyyMMddHHmmss theo chuẩn VNPay
 */
export function formatVnpDate(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Tạo URL thanh toán VNPay Sandbox có chữ ký HMAC-SHA512
 */
export async function createVNPayPaymentUrl({
  amount,
  orderInfo,
  txnRef,
  returnUrl,
  bankCode = '',
}) {
  const createDate = formatVnpDate();
  const effectiveReturnUrl =
    returnUrl || `${window.location.origin}/payment/vnpay-return`;

  const params = {
    vnp_Version: VNPAY_CONFIG.vnp_Version,
    vnp_Command: VNPAY_CONFIG.vnp_Command,
    vnp_TmnCode: VNPAY_CONFIG.vnp_TmnCode,
    vnp_Amount: String(Math.round(amount * 100)), // VNPay tính theo đơn vị hào (x100)
    vnp_CreateDate: createDate,
    vnp_CurrCode: VNPAY_CONFIG.vnp_CurrCode,
    vnp_IpAddr: '127.0.0.1',
    vnp_Locale: VNPAY_CONFIG.vnp_Locale,
    vnp_OrderInfo: orderInfo || 'Thanh toan don dat lich PhotoStudio',
    vnp_OrderType: 'other',
    vnp_ReturnUrl: effectiveReturnUrl,
    vnp_TxnRef: txnRef || `PS_${Date.now()}`,
  };

  if (bankCode) {
    params.vnp_BankCode = bankCode;
  }

  // Sắp xếp các tham số theo thứ tự alphabet theo chuẩn VNPay
  const sortedKeys = Object.keys(params).sort();
  const signDataParts = [];
  const queryParts = [];

  for (const key of sortedKeys) {
    const val = params[key];
    if (val !== undefined && val !== null && val !== '') {
      const encodedKey = encodeURIComponent(key);
      const encodedVal = encodeURIComponent(String(val)).replace(/%20/g, '+');
      signDataParts.push(`${encodedKey}=${encodedVal}`);
      queryParts.push(`${encodedKey}=${encodedVal}`);
    }
  }

  const signData = signDataParts.join('&');
  const secureHash = await hmacSHA512(VNPAY_CONFIG.vnp_HashSecret, signData);

  return `${VNPAY_CONFIG.vnp_Url}?${queryParts.join('&')}&vnp_SecureHash=${secureHash}`;
}

/**
 * Xác thực chữ ký phản hồi trả về từ VNPay
 */
export async function verifyVNPayResponse(queryParams) {
  const secureHash = queryParams.vnp_SecureHash;
  if (!secureHash) return false;

  const signDataParts = [];
  const sortedKeys = Object.keys(queryParams)
    .filter((k) => k.startsWith('vnp_') && k !== 'vnp_SecureHash' && k !== 'vnp_SecureHashType')
    .sort();

  for (const key of sortedKeys) {
    const val = queryParams[key];
    if (val !== undefined && val !== null && val !== '') {
      const encodedKey = encodeURIComponent(key);
      const encodedVal = encodeURIComponent(String(val)).replace(/%20/g, '+');
      signDataParts.push(`${encodedKey}=${encodedVal}`);
    }
  }

  const signData = signDataParts.join('&');
  const expectedHash = await hmacSHA512(VNPAY_CONFIG.vnp_HashSecret, signData);

  return secureHash.toLowerCase() === expectedHash.toLowerCase();
}
