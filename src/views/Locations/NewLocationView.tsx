import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { createPath } from "@utils/createPath";
import { useSelectionStore } from "@storage/store";
import { LocationForm } from "@components/Locations/LocationForm";
import type { EditLocationInput } from "@apptypes/location";
import { useLocationCreator } from "@hooks/useLocationCreator";

export const NewLocationView = () => {
  const { search } = useLocation();
  const buildingId =  search.buildingId;
  //const [errorMessage, setErrorMessage] = useState("");
  const savedBuildingId =
    useSelectionStore((state) => state.buildingId) || buildingId;
  const savedSiteId = useSelectionStore((state) => state.siteId);
  const savedOrgId = useSelectionStore((state) => state.orgId);
  const pathBack = createPath(
    "/locations",
    savedOrgId || undefined,
    savedSiteId || undefined,
    savedBuildingId || undefined,
  );

  const navigate = useNavigate();

  const locationCreator = useLocationCreator();


  const handleCreateLocation = async (locationData: EditLocationInput) => {
      if (!buildingId) return
      const result = await locationCreator.mutateAsync(buildingId, locationData);
      if (!result.error && result.data?.location.location_id) {
        navigate({ to: createPath(
          `/locations`,
          savedOrgId || undefined,
          savedSiteId || undefined,
          savedBuildingId || undefined,
          result.data.location.location_id,
        )});
      }
  };

  return (
    <div className="p-5">
      <div>
        <Link to={pathBack} className="text-lab-green-dark p-2">
          ← Back to locations list
        </Link>
      </div>
      <h1>Add a new location</h1>
      <div className="border-border-grey bg-sidebar-grey p-4 mt-4 w-150">
        {buildingId ? (
          <LocationForm handleSubmit={handleCreateLocation} />
        ) : (
          <div>Please select a building to add a location.</div>
        )}
        {locationCreator.isLoading && <div>{locationCreator.loadingMessage}</div>}
        {locationCreator.error && (
          <div className="text-red-500">
            Error creating location: {locationCreator.error.message}
          </div>
        )}
      </div>
    </div>
  );
};
