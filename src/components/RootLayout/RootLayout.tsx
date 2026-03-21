// root layout, app name on top left, side bar on left, content on right
import { Outlet } from "@tanstack/react-router";
import SideBar from "../SideBar/SideBar";

const RootLayout = () => {
  return (
    <div className="flex flex-col">
      <h1>Wayfinding admin UI</h1>

      <div className="flex flex-row">
        <SideBar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
