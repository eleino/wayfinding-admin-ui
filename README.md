# Wayfinding Admin UI

## Installation
1. Clone the repository and navigate to the `wayfinding-admin-ui` directory.
2. Run `npm install` to install the dependencies.
3. Create a `.env` file in the root of the `wayfinding-admin-ui` directory with the following content:
   ```
   VITE_API_BASE_URL=/api/v1
   ```
4. Run `npm run dev` to start the development server. The backend needs to be running (in Docker or locally).
5. Navigate to `http://localhost:5172` in your browser to access the admin UI.
6. Log in using the admin credentials.



## Notes

- I had to change the default port from 5173 to 5172 because the users' frontend (running in Docker) uses 5173.
- Because of that, I had to add proxy config to vite.config.ts to get around CORS errors, and use relative API URL (/api/v1) instead of absolute (http://localhost:3000/api/v1).
- The proxy setting will be ignored in prod so no need to change that, but the API URL will need to be changed to absolute (or if they run in the same Docker network, the backend's container name can be used as the hostname).
- Could also just add port 5172 in allowedOrigins in the backend's main.ts.