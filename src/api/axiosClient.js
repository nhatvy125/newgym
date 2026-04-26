import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const AUTH_WHITELIST = ['/auth/login', '/auth/register', '/auth/refresh'];

const normalizeRequestUrl = (url = '') => {
  if (url.startsWith('/api/')) {
    return url.replace(/^\/api/, '');
  }
  return url;
};

const isAuthWhitelistRequest = (url = '') => {
  const requestUrl = normalizeRequestUrl(url);
  return AUTH_WHITELIST.some((path) => requestUrl === path || requestUrl.startsWith(path));
};

const isTokenExpired = (token) => {
  if (!token) return false;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return false;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.exp ? Date.now() >= payload.exp * 1000 : false;
  } catch {
    return false;
  }
};

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const requestUrl = normalizeRequestUrl(config.url || '');

  if (token && isTokenExpired(token)) {
    localStorage.removeItem('token');
  }

  if (token && !isAuthWhitelistRequest(requestUrl)) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // CHẶN LOOP: Nếu lỗi 401 xảy ra ngay tại API Login hoặc Refresh thì KHÔNG làm gì cả
    if (
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/register') ||
      originalRequest.url.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        // Nếu không có cả refresh token thì cho ra đảo luôn
        localStorage.clear();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const res = await axios.post('/api/auth/refresh', { token: refreshToken });
        if (res.status === 200) {
          const newToken = res.data.token;
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.clear();
        // Chỉ chuyển hướng nếu hiện tại không phải đang ở trang login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;