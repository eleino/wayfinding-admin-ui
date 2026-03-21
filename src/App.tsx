import { RouterProvider, createRouter } from "@tanstack/react-router"
import { AppRouter } from "./routes/AppRouter";
function App() {

  return <RouterProvider router={createRouter({ routeTree: AppRouter })} />
}

export default App
