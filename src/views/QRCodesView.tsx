import { BreadCrumbs } from "@components/List/BreadCrumbs";
import { LocationsSelections } from "@components/Locations/LocationsSelections";
import { QRCodePath } from "@components/QRCode/QRCodePath";
import { getRouteApi } from "@tanstack/react-router";
import { createPath } from "@utils/createPath";
import { useSelectionStore } from "storage/store";

const currRoute = getRouteApi("/qrcodes");
const QRCodesView = () => {
  const search = currRoute.useSearch();
  const locationId = search.locationId as number | undefined;
  const searchParams = { ...search };

  const breadcrumbs = [];
  const org = useSelectionStore((state) =>
    state.orgList.find((org) => org.id === Number(searchParams.orgId)),
  );
  if (searchParams.orgId) {
    breadcrumbs.push({
      label: `${org?.name ? org.name : `Organization ${searchParams.orgId}`}`,
      link: "/qrcodes",
      onClick: () => {
        useSelectionStore.setState({
          orgId: null,
          siteId: null,
          buildingId: null,
        });
      },
    });
  }
  const site = useSelectionStore((state) =>
    state.siteList.find((site) => site.id === Number(searchParams.siteId)),
  );
  if (searchParams.siteId) {
    breadcrumbs.push({
      label: `${site?.name ? site.name : `Site ${searchParams.siteId}`}`,
      link: createPath("/qrcodes", searchParams.orgId),
      onClick: () => {
        useSelectionStore.setState({ siteId: null, buildingId: null });
      },
    });
  }
  const building = useSelectionStore((state) =>
    state.buildingList.find(
      (building) => building.id === Number(searchParams.buildingId),
    ),
  );
  if (searchParams.buildingId) {
    breadcrumbs.push({
      label: `${building?.name ? building.name : `Building ${searchParams.buildingId}`}`,
      link: createPath("/qrcodes", searchParams.orgId, searchParams.siteId),
      onClick: () => {
        useSelectionStore.setState({ buildingId: null });
      },
    });
  }
  return (
    <div className="p-5">
      {breadcrumbs.length > 0 && <BreadCrumbs crumbs={breadcrumbs} />}

      <h1 className="mt-2">QR Codes</h1>

      {locationId ? (
        <QRCodePath locationId={locationId} searchParams={searchParams} />
      ) : (
        <LocationsSelections searchParams={searchParams} page="qrcodes" />
      )}
    </div>
  );
};

export default QRCodesView;
