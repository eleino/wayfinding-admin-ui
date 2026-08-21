// SideBar.tsx
import type { SearchParams } from "@schemas/router.schema";
import { Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useSelectionStore } from "storage/store";

const SideBar = (props: { handleLogout: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const savedOrgId = useSelectionStore((state) => state.orgId);
  const savedSiteId = useSelectionStore((state) => state.siteId);
  const savedBuildingId = useSelectionStore((state) => state.buildingId);

  const currentSearch = useSearch({ from: "__root__" }) as SearchParams;
  const { orgId, siteId, buildingId } = currentSearch;

  const links = [
    { name: "Dashboard", path: "/dashboard", search: {} },
    {
      name: "Locations",
      path: `/locations`,
      search: {
        orgId: orgId || savedOrgId,
        siteId: siteId || savedSiteId,
        buildingId: buildingId || savedBuildingId,
      },
    },
    {
      name: "Paths",
      path: `/paths`,
      search: {
        orgId: orgId || savedOrgId,
        siteId: siteId || savedSiteId,
        buildingId: buildingId || savedBuildingId,
      },
    },
    { name: "Media/Images", path: "/images", search: {} },
    { name: "Translations", path: "/translations", search: {} },
    {
      name: "QR Codes",
      path: `/qrcodes`,
      search: {
        orgId: orgId || savedOrgId,
        siteId: siteId || savedSiteId,
        buildingId: buildingId || savedBuildingId,
      },
    },
    { name: "Users", path: "/users", search: {} },
  ];

  return (
    <aside className="w-full flex-none md:w-50">
      <div className="flex items-center justify-between rounded border border-border-grey bg-sidebar-grey p-3 shadow-lg md:hidden">
        <span className="text-lg font-bold uppercase">Wayfinding</span>
        <button
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          className="rounded p-2 text-lab-gray-light hover:bg-lab-turquoise/10 hover:text-lab-turquoise focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lab-turquoise"
        >
          <span aria-hidden="true" className="text-2xl leading-none">{isMenuOpen ? "×" : "☰"}</span>
        </button>
      </div>
      <nav
        id="primary-navigation"
        aria-label="Primary navigation"
        className={`${isMenuOpen ? "mt-2 flex" : "hidden"} w-full flex-col rounded border border-border-grey bg-sidebar-grey shadow-lg md:mt-0 md:flex md:h-150`}
      >
        <div className="mb-5 hidden w-full border-b-2 border-lab-turquoise p-4 text-center text-lg font-bold uppercase shadow md:block">Wayfinding</div>
        <ul className="flex w-full list-none flex-col">
        {links.map((link) => (
          <li className="sidebar-link" key={link.path}>
            <Link
              to={link.path}
              search={link.search}
              activeOptions={{
                exact: false,
                includeHash: false,
                includeSearch: false,
              }}
              className={`pl-5 py-2 w-full h-full block`}
              activeProps={{
                className: "text-lab-turquoise font-bold bg-lab-turquoise/10 border-l-2 border-lab-turquoise",
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          </li>
        ))}
        </ul>
        <div className="flex w-full flex-1 justify-end">
          <button
            type="button"
            onClick={props.handleLogout}
            className="m-2 w-full self-end rounded bg-red-500 p-2 text-white"
          >
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;
