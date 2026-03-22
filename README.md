Notes

- I had to change the default port from 5173 to 5172 because the users' frontend (running in Docker) uses 5173.
- Because of that, I had to add proxy config to vite.config.ts to get around CORS errors, and use relative API URL (/api/v1) instead of absolute (http://localhost:3000/api/v1).
- The proxy setting will be ignored in prod so no need to change that, but the API URL will need to be changed to absolute (or if they run in the same Docker network, the backend's container name can be used as the hostname).
- Could also just add port 5172 in allowedOrigins in the backend's main.ts.