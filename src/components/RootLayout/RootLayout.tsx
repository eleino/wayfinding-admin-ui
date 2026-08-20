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
    <div className="h-full w-full bg-black p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex sm:w-full md:max-w-10/12">
        <div className="flex w-full flex-col gap-4 md:flex-row">
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
