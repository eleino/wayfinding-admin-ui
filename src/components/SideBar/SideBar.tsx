import { Link } from "@tanstack/react-router";

// SideBar.tsx
const SideBar = () => {
  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: "Paths", path: "/paths" },
    { name: "Media/Images", path: "/images" },
    { name: "Translations", path: "/translations" },
    { name: "QR Codes", path: "/qrcodes" },
    { name: "Settings", path: "/settings" },
  ];
  return (
    <div className="w-50 py-5 bg-sidebar-grey">
      <ul className="list-none w-full">
        {links.map((link) => (
          <li className="sidebar-link" key={link.path}>
            <Link
              to={link.path}
              className="pl-5 py-2 w-full h-full block"
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
