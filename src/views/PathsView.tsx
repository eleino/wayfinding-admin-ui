import { ShowPath } from "@components/Paths/ShowPath";
import { PathSelections } from "@components/Paths/PathSelections";
import { getRouteApi, Link } from "@tanstack/react-router";
import { createPath } from "@utils/createPath";
import { useSelectionStore } from "storage/store";

const currRoute = getRouteApi("/paths");
const PathsView = () => {
  const search = currRoute.useSearch();
  const pathId = search.pathId as number | undefined;
  const searchParams = { ...search };
  // show breadcrumbs path at the top of the page based on search params, e.g. "Organization > Site > Building"
  const breadcrumbs = [];
  if (searchParams.orgId) {
    breadcrumbs.push({
      label: `Organization ${searchParams.orgId}`,
      link: "/paths",
      onClick: () => {
        useSelectionStore.setState({
          orgId: null,
          siteId: null,
          buildingId: null,
        });
      },
    });
  }
  if (searchParams.siteId) {
    breadcrumbs.push({
      label: `Site ${searchParams.siteId}`,
      link: createPath("/paths", searchParams.orgId),
      onClick: () => {
        useSelectionStore.setState({ siteId: null, buildingId: null });
      },
    });
  }
  if (searchParams.buildingId) {
    breadcrumbs.push({
      label: `Building ${searchParams.buildingId}`,
      link: createPath("/paths", searchParams.orgId, searchParams.siteId),
      onClick: () => {
        useSelectionStore.setState({ buildingId: null });
      },
    });
  }
  return (
    <div className="p-5">
      {breadcrumbs.length > 0 && (
        <div className="mb-4 text-sm text-lab-green">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              <Link
                to={crumb.link}
                onClick={crumb.onClick}
                className="text-lab-green-dark"
              >
                {crumb.label}
              </Link>
              {index < breadcrumbs.length - 1 && " > "}
            </span>
          ))}
        </div>
      )}
      <h1>Paths</h1>

      {pathId ? (
        <ShowPath pathId={pathId} searchParams={searchParams} />
      ) : (
        <PathSelections searchParams={searchParams} />
      )}
    </div>
  );
};

export default PathsView;
