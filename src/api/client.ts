import ky from 'ky';
import { normalizeApiError } from './errors';

const apiClient = ky.create({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
  retry: 0, // handle retries with Tanstack Query
  hooks: {
    beforeRequest: [
      ({request}) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    beforeError: [
      ({ error }) => normalizeApiError(error),
    ],
  },
});

export default apiClient;
