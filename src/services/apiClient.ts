import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { jwtManager } from '@/lib/auth';

// Get the base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8181/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = jwtManager.getAccessToken();
    if (token && !jwtManager.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle token refresh and auth errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = jwtManager.getRefreshToken();
      if (refreshToken) {
        try {
          // Attempt token refresh
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          jwtManager.setTokens({ accessToken, refreshToken: newRefreshToken });
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed - redirect to login
          jwtManager.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } else {
        // No refresh token - redirect to login
        jwtManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
