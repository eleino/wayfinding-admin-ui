import ky from 'ky';

const apiClient = ky.create({
  prefixUrl: `${import.meta.env.VITE_API_BASE_URL}`,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
  },
});

export default apiClient;