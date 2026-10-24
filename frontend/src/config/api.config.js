/**
 * Cấu hình kết nối API cho toàn bộ ứng dụng PhotoStudio.
 * Tương thích với môi trường Vite và Backend Spring Boot (mặc định port 8081).
 * Tự động chuẩn hóa để các service gọi endpoint dạng '/api/...' không bị lặp '/api/api/...'
 */

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

export const API_BASE_URL = rawBaseUrl.replace(/\/api\/?$/, '');

export const API_TIMEOUT = 10000;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const MULTIPART_HEADERS = {
  'Content-Type': 'multipart/form-data',
  Accept: 'application/json',
};
