import { LocationsSelections } from "@components/Locations/LocationsSelections";
import { QRCodePath } from "@components/QRCode/QRCodePath";
import type { SearchParams } from "@schemas/router.schema";
import { useSearch } from "@tanstack/react-router";

const QRCodesView = () => {
  const search = useSearch({ from: "__root__" }) as SearchParams;
  const locationId = search.locationId;
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
