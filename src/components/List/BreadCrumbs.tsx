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

  const currentCrumb = activeCrumbs[activeCrumbs.length - 1];
  const parentCrumb = activeCrumbs[activeCrumbs.length - 2];

  return (
    <>
      <nav aria-label="Breadcrumb" className="my-4 min-w-0 lg:hidden">
        <div className="flex min-w-0 items-center gap-3 rounded p-2 text-sm">
          {parentCrumb && (
            <Link
              to={parentCrumb.to}
              search={parentCrumb.getSearch?.()}
              onClick={parentCrumb.onNavigate}
              className="flex min-w-0 max-w-1/2 items-center gap-1 rounded px-2 py-1 text-lab-turquoise hover:bg-lab-turquoise/10"
              aria-label={`Back to ${parentCrumb.label}`}
            >
              <span aria-hidden="true">←</span>
              <span className="truncate">{parentCrumb.label}</span>
            </Link>
          )}
          <span
            aria-current="page"
            className="min-w-0 max-w-60 flex-1 truncate rounded bg-lab-turquoise px-3 py-1 font-medium text-black"
          >
            {currentCrumb.label}
          </span>
        </div>
      </nav>

      <nav aria-label="Breadcrumb" className="my-4 ml-4 hidden overflow-x-auto text-sm lg:block">
        <div className="flex w-max min-w-full flex-nowrap">
          {activeCrumbs.map((crumb, index) => (
            <span
              key={crumb.id}
              className={`shrink-0 whitespace-nowrap p-2 px-8 ${index === activeCrumbs.length - 1 ? "bg-lab-turquoise" : "bg-sidebar-grey"}`}
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
      </nav>
    </>
  );
};
