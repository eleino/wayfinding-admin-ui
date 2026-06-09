import { ShowPath } from "@components/Paths/ShowPath";
import { PathSelections } from "@components/Paths/PathSelections";
import { useLocation } from "@tanstack/react-router";
import { createPath } from "@utils/createPath";
import { useSelectionStore } from "storage/store";
import { BreadCrumbs } from "@components/List/BreadCrumbs";


const PathsView = () => {
  const {search} = useLocation();
  const pathId = search.pathId as number | undefined;
  const searchParams = { ...search };
  const org = useSelectionStore((state) => state.orgList.find((org) => org.id === Number(searchParams.orgId)));
  const site = useSelectionStore((state) => state.siteList.find((site) => site.id === Number(searchParams.siteId)));
  const building = useSelectionStore((state) => state.buildingList.find((building) => building.id === Number(searchParams.buildingId)));
  // show breadcrumbs path at the top of the page based on search params, e.g. "Organization > Site > Building"
  const breadcrumbs = [];
  if (searchParams.orgId) {
    breadcrumbs.push({
      label: `${org?.name || `Organization ${searchParams.orgId}`}`,
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
      label: `${site?.name || `Site ${searchParams.siteId}`}`,
      link: createPath("/paths", searchParams.orgId),
      onClick: () => {
        useSelectionStore.setState({ siteId: null, buildingId: null });
      },
    });
  }
  if (searchParams.buildingId) {
    breadcrumbs.push({
      label: `${building?.name || `Building ${searchParams.buildingId}`}`,
      link: createPath("/paths", searchParams.orgId, searchParams.siteId),
      onClick: () => {
        useSelectionStore.setState({ buildingId: null });
      },
    });
  }
  return (
    <div className="p-5">
      {breadcrumbs.length > 0 && (
        <BreadCrumbs crumbs={breadcrumbs} />
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
