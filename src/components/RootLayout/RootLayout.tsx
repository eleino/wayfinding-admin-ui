import { Outlet } from "@tanstack/react-router";
import SideBar from "../SideBar/SideBar";
import { useContext } from "react";
import { AuthContext } from "@auth/authContext";
import { BreadCrumbs } from "@components/List/BreadCrumbs";
import { useAppInit } from "@hooks/useAppInit";

const RootLayout = () => {
  const { logout } = useContext(AuthContext);

  // Fetch app init data to initialize languages and settings
  useAppInit();

  return (
    <div className="p-10 w-full h-full bg-black">
      <div className="flex flex-col rounded-xl shadow-lg bg-sidebar-grey/50">
        <div className="flex flex-row gap-4">
          <SideBar handleLogout={logout} />
          <main className="min-w-0 flex-1 max-w-5xl">
            <BreadCrumbs />
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
