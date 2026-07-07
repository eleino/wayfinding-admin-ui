import { LocationsSelections } from "@components/Locations/LocationsSelections";
import { QRCodePath } from "@components/QRCode/QRCodePath";
import { getRouteApi } from "@tanstack/react-router";

const currRoute = getRouteApi("/qrcodes");
const QRCodesView = () => {
  const search = currRoute.useSearch();
  const locationId = search.locationId as number | undefined;
  const searchParams = { ...search };

  return (
    <div className="p-4">
      <h1>QR Codes</h1>

      {locationId ? (
        <QRCodePath locationId={locationId} searchParams={searchParams} />
      ) : (
        <LocationsSelections searchParams={searchParams} page="qrcodes" />
      )}
    </div>
  );
};

export default QRCodesView;
