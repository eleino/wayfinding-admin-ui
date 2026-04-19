// component for styling the breadcrumbs
import { Link } from "@tanstack/react-router";

export const BreadCrumbs = (props: { crumbs: { label: string; link: string; onClick: () => void }[] }) => {
  const { crumbs } = props;
  return (
    <div className="mb-4 text-sm">
      {crumbs.map((crumb, index) => (
        <span key={index} className={`p-2 px-10 ${index === crumbs.length - 1 ? 'bg-lab-turquoise' : 'bg-sidebar-grey'}`} style={index === 0 ? { clipPath: "polygon(0 0,calc(100% - 20px) 0,100% 50%,calc(100% - 20px) 100%,0 100%)", paddingInline: ".3em calc(20px+.3em)" } : { clipPath: "polygon(0 0,calc(100% - 20px) 0,100% 50%,calc(100% - 20px) 100%,0 100%,20px 50%)", paddingInline: "calc(20px+.5em)" }}>
          <Link to={crumb.link} onClick={crumb.onClick} className={`hover:underline ${index === crumbs.length - 1 ? 'text-black decoration-lab-blue' : 'text-white'}`}>
            {crumb.label}
          </Link>
        </span>
      ))}
    </div>
  );
};