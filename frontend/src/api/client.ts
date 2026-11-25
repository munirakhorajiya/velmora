import axios from 'axios';

export const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach DRF Token authentication header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('velmora_token');
  if (token) {
    config.headers.Authorization = token.startsWith('Token ') ? token : `Token ${token}`;
  }
  return config;
});

interface ApiErrorPayload {
  non_field_errors?: string[];
  email?: string[];
  password?: string[];
  error?: string;
  detail?: string;
  message?: string;
}

/**
 * Extracts a human-readable error message from an unknown Axios/network error.
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (!axios.isAxiosError(err)) {
    return fallback;
  }
  const data = err.response?.data as string | ApiErrorPayload | undefined;
  if (!data) {
    return fallback;
  }
  if (typeof data === 'string') {
    return data;
  }
  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
    return data.non_field_errors[0];
  }
  if (Array.isArray(data.email) && data.email.length > 0) {
    return data.email[0];
  }
  if (Array.isArray(data.password) && data.password.length > 0) {
    return data.password[0];
  }
  return data.error || data.detail || data.message || fallback;
}
