import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';

import { API_CONFIG } from '@/constants';

const TOKEN_KEY = 'velora-auth';

/**
 * Central HTTP client for the Velora Markets Spring Boot API.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_CONFIG.baseURL}/${API_CONFIG.version}`,
  timeout: API_CONFIG.timeout,

  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Automatically attach JWT to protected API requests.
 */
apiClient.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem(TOKEN_KEY);
    let token: string | null = null;
    if (raw) {
      try { token = (JSON.parse(raw) as { token?: string }).token ?? null; } catch { token = raw; }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response interceptor.
 * Note: Session termination is managed explicitly by AuthContext for genuine auth failures (e.g. /users/me).
 * Global 401 rejection passes the error to callers without wiping local state prematurely.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export async function apiRequest<T>(
  config: AxiosRequestConfig,
): Promise<T> {

  const response =
    await apiClient.request<T>(config);

  return response.data;
}

export { TOKEN_KEY };