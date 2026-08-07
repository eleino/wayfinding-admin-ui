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
  useAppInit();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };
  if (!isAuthenticated || (userRole !== "admin" && userRole !== "maintainer")) {
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
    <div className="p-10 w-full h-full bg-black">
      <div className="flex flex-col rounded-xl shadow-lg bg-sidebar-grey/50">
        <div className="flex flex-row gap-4">
          <SideBar handleLogout={handleLogout} />
          <main>
            <BreadCrumbs />
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
