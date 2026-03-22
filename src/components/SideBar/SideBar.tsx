import { Link } from "@tanstack/react-router";

// SideBar.tsx
const SideBar = () => {
  return (
    <div className="w-50 py-5 bg-sidebar-grey">
      <ul className="list-none w-full">
        <li className="sidebar-link">
          <Link
            to="/"
            className="pl-5 py-2 w-full h-full block"
            activeProps={{ className: "text-lab-turquoise font-bold bg-lab-turquoise/10" }}
          >
            Home
          </Link>
        </li>
        <li className="sidebar-link w-full">
          <Link
            to="/locations"
            className="pl-5 py-2 w-full h-full block"
            activeProps={{ className: "text-lab-turquoise font-bold bg-lab-turquoise/20" }}
          >
            Locations
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
