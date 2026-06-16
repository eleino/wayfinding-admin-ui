import {
  useGetLocationById,
  useGetLocationDestinations,
} from "@hooks/useLocations";
import { useState } from "react";
import { QRCode } from "./QRCode";
import { Link } from "@tanstack/react-router";
import { createPath } from "@utils/createPath";
import type { SearchParams } from "@apptypes/searchParams";

interface SelectedPath {
  path_id: number;
  destination: string;
}
export const QRCodePath = (props: {
  locationId: number;
  searchParams: SearchParams;
}) => {
  const { locationId, searchParams } = props;
  const [selectedPath, setSelectedPath] = useState<SelectedPath | undefined>(
    undefined,
  );
  const [accessibilityLevel, setAccessibilityLevel] = useState<string>("0");
  const { data: destinations } = useGetLocationDestinations(
    locationId,
    "fi",
    accessibilityLevel,
  );
  const location = useGetLocationById(locationId);

  const handlePathSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const pathId = parseInt(event.target.value);
    if (isNaN(pathId)) {
      setSelectedPath(undefined);
      return;
    }
    const destination = destinations?.end_locations.find(
      (dest) => dest.path_id === pathId,
    )?.translations.fi?.[0]?.text_value;
    setSelectedPath({ path_id: pathId, destination: destination ?? "" });
  };

  return (
    <div>
      <Link
        to={createPath(
          `/qrcodes`,
          searchParams.orgId || undefined,
          searchParams.siteId || undefined,
          searchParams.buildingId || undefined,
        )}
        className="text-lab-green-dark p-2"
      >
        &larr; Back to locations list
      </Link>
      <div className="flex flex-col gap-1 bg-sidebar-grey p-6 rounded mt-2">
        <label htmlFor="accessibility-level" className="">
          Accessibility:
        </label>
        <select
          id="accessibility-level"
          className="w-55 border border-border-grey p-1 mb-2 bg-black"
          onChange={(event) => {
            setAccessibilityLevel(event.target.value);
            setSelectedPath(undefined);
          }}
          defaultValue="0"
        >
          <option value="0">No accessibility</option>
          <option value="1">Accessibility needs</option>
        </select>
        <label htmlFor="path-select" className="">
          Select a path to generate QR code for:
        </label>
        <select
          id="path-select"
          className="w-55 border border-border-grey p-1 mb-2 bg-black"
          onChange={handlePathSelect}
          value={selectedPath?.path_id ?? ""}
        >
          <option value="">No path selected</option>
          {destinations && destinations.end_locations.length > 0 ? (
            destinations.end_locations.map((destination) => (
              <option key={destination.path_id} value={destination.path_id}>
                {destination.translations.fi?.[0]?.text_value}
              </option>
            ))
          ) : (
            <option disabled>No available paths</option>
          )}
        </select>
        <h3 className="text-lg font-bold">QR Code</h3>
        <div className="flex gap-1 items-center">
          Location:
          <span className="text-lab-green">
            {location?.data?.location.name}
          </span>
          <span className="text-sm text-gray-400">
            (id:
            {locationId})
          </span>
        </div>
        {selectedPath && (
          <div className="flex gap-1 items-center">
            Destination:
            <span className="text-lab-turquoise">
              {selectedPath.destination}
            </span>
            <span className="text-sm text-gray-400">
              (path id: {selectedPath.path_id})
            </span>
          </div>
        )}
        <QRCode locationId={locationId} pathId={selectedPath?.path_id} />
      </div>
    </div>
  );
};
