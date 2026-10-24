import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, DEFAULT_HEADERS } from '../config/api.config';

const TOKEN_KEY = 'customer_token';
const USER_KEY = 'customer_user';

export const customerAuth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: () => {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  removeUser: () => localStorage.removeItem(USER_KEY),
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  isAuthenticated: () => Boolean(localStorage.getItem(TOKEN_KEY)),
};

/**
 * Tự động sửa lỗi giải mã UTF-8 (mojibake) từ CSDL
 */
function fixMojibakeString(str) {
  if (typeof str !== 'string' || !str) return str;
  try {
    const bytes = Uint8Array.from([...str].map((c) => c.charCodeAt(0) & 0xff));
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return decoded;
  } catch {
    return str;
  }
}

function cleanPayload(data) {
  if (!data) return data;
  if (typeof data === 'string') return fixMojibakeString(data);
  if (Array.isArray(data)) return data.map(cleanPayload);
  if (typeof data === 'object') {
    const res = {};
    for (const key of Object.keys(data)) {
      res[key] = cleanPayload(data[key]);
    }
    return res;
  }
  return data;
}

const axiosCustomer = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: DEFAULT_HEADERS,
});

axiosCustomer.interceptors.request.use(
  (config) => {
    const token = customerAuth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosCustomer.interceptors.response.use(
  (response) => cleanPayload(response.data),
  (error) => {
    if (error.response?.status === 401) {
      customerAuth.clearAuth();
    }
    return Promise.reject(error);
  }
);

export default axiosCustomer;
