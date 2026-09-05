import axios from 'axios';

/**
 * Talks to the Express API through Vite's `/api` proxy.
 *
 * If the backend is down the app falls back to the static JSON in `public/` so
 * the UI still renders read-only — see `src/api/items.js`.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

/** Turns an Axios failure into a single readable sentence. */
export function describeError(error) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.errors?.length) return data.errors.join('; ');
    if (data?.error) return data.error;
    if (error.code === 'ECONNABORTED') return 'The request timed out.';
    if (!error.response) return 'Cannot reach the API server.';
    return `${error.response.status} ${error.response.statusText}`;
  }
  return error?.message || 'Something went wrong.';
}
