// root layout, app name on top left, side bar on left, content on right
import { Outlet } from "@tanstack/react-router";
import SideBar from "../SideBar/SideBar";
import { useContext } from "react";
import { AuthContext } from "@auth/authContext";

const RootLayout = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
if (!isAuthenticated || (userRole !== 'admin' && userRole !== 'maintainer')) {
    return (
        <main className="p-5">
          <Outlet />
        </main>
    );
  }
  return (
    <div className="flex flex-col p-10 w-full h-screen">
      <div className="flex flex-row h-full">
        <SideBar />
        <main className="p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
