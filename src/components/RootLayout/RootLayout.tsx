// root layout, app name on top left, side bar on left, content on right
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import SideBar from "../SideBar/SideBar";
import { useContext } from "react";
import { AuthContext } from "@auth/authContext";
import { BreadCrumbs } from "@components/List/BreadCrumbs";
import { useAppInit } from "@hooks/useAppInit";

const RootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);

  // Fetch app init data to initialize languages and settings
  const appInit = useAppInit();
  console.log(appInit.data);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
    
  }
if (!isAuthenticated || (userRole !== 'admin' && userRole !== 'maintainer')) {
  if (location.pathname !== "/login") {
    navigate({ to: "/login" });
  }
    return (
        <main className="p-5">
          <Outlet />
        </main>
    );
  }
  return (
    <div className="flex flex-col p-10 w-full h-screen">
      <div className="place-self-end">
        <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
          Logout
        </button>
      </div>
      <div className="flex flex-row h-full">
        <SideBar />
        <main className="p-5">
          <BreadCrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
