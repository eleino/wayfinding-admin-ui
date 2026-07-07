import { Link, useSearch, useNavigate } from "@tanstack/react-router";
import { useSelectionStore } from "@storage/store";
import { LocationForm } from "@components/Locations/LocationForm";
import type { EditLocationInput } from "@apptypes/location";
import { useLocationCreator } from "@hooks/useLocationCreator";
import type { SearchParams } from "@schemas/router.schema";

export const NewLocationView = () => {
  const { buildingId } = useSearch({ from: "__root__" }) as SearchParams;
  //const [errorMessage, setErrorMessage] = useState("");
  const savedBuildingId =
    useSelectionStore((state) => state.buildingId) || buildingId;
  const savedSiteId = useSelectionStore((state) => state.siteId);
  const savedOrgId = useSelectionStore((state) => state.orgId);

  const navigate = useNavigate();

  const locationCreator = useLocationCreator();

  const handleCreateLocation = async (locationData: EditLocationInput) => {
    if (!buildingId) return;
    const result = await locationCreator.mutateAsync(buildingId, locationData);
    if (!result.error && result.data?.location.location_id) {
      navigate({
        to: "/locations",
        search: {
          orgId: savedOrgId,
          siteId: savedSiteId,
          buildingId: savedBuildingId,
          locationId: result.data.location.location_id,
        },
        replace: true,
      });
    }
  };

  return (
    <div className="p-4">
      <h1>Add a new location</h1>
      <Link
        to="/locations"
        search={{
          orgId: savedOrgId,
          siteId: savedSiteId,
          buildingId: savedBuildingId,
        }}
        className="text-lab-green-dark p-2"
      >
        ← Back to locations list
      </Link>
      <div className="border-border-grey bg-sidebar-grey p-4 mt-4 w-150">
        {buildingId ? (
          <LocationForm handleSubmit={handleCreateLocation} />
        ) : (
          <div>Please select a building to add a location.</div>
        )}
        {locationCreator.isLoading && (
          <div>{locationCreator.loadingMessage}</div>
        )}
        {locationCreator.error && (
          <div className="text-red-500">
            Error creating location: {locationCreator.error.message}
          </div>
        )}
      </div>
    </div>
  );
};
