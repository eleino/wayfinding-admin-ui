import { useContext, useEffect } from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { AppRouter } from "./routes/AppRouter";
import { AuthContext } from "@auth/authContext";

const router = createRouter({
  routeTree: AppRouter,
  basepath: import.meta.env.BASE_URL,
  context: {
    auth: undefined!,
  },
});

function App() {
  const auth = useContext(AuthContext);

  // Update the router context with the current auth state whenever it changes
  useEffect(() => {
    void router.invalidate();
  }, [auth.isAuthenticated, auth.userRole]);

  return <RouterProvider router={router} context={{ auth }} />;
}

export default App
