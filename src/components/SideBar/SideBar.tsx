// SideBar.tsx
import type { SearchParams } from "@schemas/router.schema";
import { Link, useSearch } from "@tanstack/react-router";
import { useSelectionStore } from "storage/store";

const SideBar = (props: { handleLogout: () => void }) => {
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
    { name: "Settings", path: "/settings", search: {} },
  ];
  return (
    <div className="w-50 bg-sidebar-grey flex-none h-150 rounded shadow-lg border border-border-grey">
      <ul className="list-none w-full h-full flex flex-col">
        <div className="mb-5 p-4 w-full  text-center text-lg uppercase font-bold border-b-2 border-lab-turquoise shadow">Wayfinding</div>
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
            >
              {link.name}
            </Link>
          </li>
        ))}
        <div className="w-full h-full flex justify-end">
          <button
            onClick={props.handleLogout}
            className="bg-red-500 m-2 self-end text-white p-2 rounded w-full"
          >
            Logout
          </button>
        </div>
      </ul>
    </div>
  );
};

export default SideBar;
