import ky from 'ky';

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
  },
});

export default apiClient;