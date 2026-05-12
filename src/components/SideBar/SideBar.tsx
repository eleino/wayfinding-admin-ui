// SideBar.tsx
import { Link } from "@tanstack/react-router";
import { createPath } from "@utils/createPath";
import { useSelectionStore } from "storage/store";

const SideBar = (props: { path: string }) => {
  const savedOrgId = useSelectionStore((state) => state.orgId);
  const savedSiteId = useSelectionStore((state) => state.siteId);
  const savedBuildingId = useSelectionStore((state) => state.buildingId);
  const paramsPath = createPath("", savedOrgId || undefined, savedSiteId || undefined, savedBuildingId || undefined);
  const currentPath = props.path;
  console.log("Current path in SideBar:", currentPath);
  const links = [
    { name: "Dashboard", path: "/dashboard", location: "/dashboard" },
    { name: "Locations", path: `/locations${paramsPath}`, location: `/locations` },
    { name: "Paths", path: `/paths${paramsPath}`, location: `/paths` },
    { name: "Media/Images", path: "/images", location: "/images" },
    { name: "Translations", path: "/translations", location: "/translations" },
    { name: "QR Codes", path: "/qrcodes", location: "/qrcodes" },
    { name: "Settings", path: "/settings", location: "/settings" },
  ];
  return (
    <div className="w-50 py-5 bg-sidebar-grey">
      <ul className="list-none w-full">
        {links.map((link) => (
          <li className="sidebar-link" key={link.path}>
            <Link
              to={link.path}
              className={`pl-5 py-2 w-full h-full block ${(currentPath.startsWith(link.location)) ? "text-lab-turquoise font-bold bg-lab-turquoise/10" : ""}`}
              activeProps={{ className: "text-lab-turquoise font-bold bg-lab-turquoise/10" }}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
