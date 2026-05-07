import ky from "ky";

const apiClient = ky.create({
  prefixUrl: "http://localhost:3000/api/v1",
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});

export default apiClient;
