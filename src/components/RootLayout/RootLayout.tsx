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
      <div className="mx-auto flex w-full max-w-10/12">
        <div className="flex w-full flex-row gap-4">
          <SideBar handleLogout={logout} />
          <main className="min-w-0 flex-1 max-w-7xl">
            <BreadCrumbs />
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
