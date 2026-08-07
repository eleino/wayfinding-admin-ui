// component for styling the breadcrumbs
import { Link, useMatches } from "@tanstack/react-router";
import type { BreadcrumbItem } from "@utils/breadcrumbs";

export const BreadCrumbs = () => {
  const matches = useMatches();

  // we need to reverse the matches array to find the most specific match that has a getBreadcrumbs function in its context
  // (for example, in order of specificity: EditLocationView > LocationsView > RootLayout)
  const targetedMatch = [...matches]
    .reverse()
    .find(
      (match) =>
        match.context && typeof match.context.getBreadcrumbs === "function",
    );

  if (!targetedMatch || !targetedMatch.context.getBreadcrumbs) return null;

  const crumbs: BreadcrumbItem[] = targetedMatch.context.getBreadcrumbs();
  const activeCrumbs = crumbs.filter((crumb) => crumb.condition);

  if (activeCrumbs.length === 0) return null;

  return (
    <div className="my-4 ml-4 text-sm">
      {activeCrumbs.map((crumb, index) => (
        <span
          key={index}
          className={`p-2 px-8 ${index === activeCrumbs.length - 1 ? "bg-lab-turquoise" : "bg-sidebar-grey"}`}
          style={
            index === 0
              ? {
                  clipPath:
                    "polygon(0 0,calc(100% - 20px) 0,100% 50%,calc(100% - 20px) 100%,0 100%)",
                  paddingInline: "20px 30px",
                }
              : {
                  clipPath:
                    "polygon(0 0,calc(100% - 20px) 0,100% 50%,calc(100% - 20px) 100%,0 100%,20px 50%)",
                  paddingInline: "calc(20px+.5em)",
                }
          }
        >
          {crumb.to ? <Link
            to={crumb.to}
            search={crumb.getSearch?.()}
            onClick={crumb.onNavigate}
            className={`hover:underline ${index === activeCrumbs.length - 1 ? "text-black decoration-lab-blue" : "text-white"}`}
          >
            {crumb.label}
          </Link>
          : <span className={index === activeCrumbs.length - 1 ? "text-black" : "text-white"}>
              {crumb.label}
            </span>}
        </span>
      ))}
    </div>
  );
};
