import { Link, useSearch, useNavigate } from "@tanstack/react-router";
import { useSelectionStore } from "@storage/store";
import { LocationForm } from "@components/Locations/LocationForm";
import type { EditLocationInput } from "@schemas/location.schema";
import { useLocationCreator } from "@hooks/useLocationCreator";
import type { SearchParams } from "@schemas/router.schema";
import { useLanguages } from "@hooks/useAppInit";
import { useContext } from "react";
import { AuthContext } from "@auth/authContext";
import { useDraftStore } from "@storage/drafts";
import { useGetBuildingById } from "@hooks/useBuildings";
import { useState } from "react";
import { AlertDialog, type AlertDialogType } from "@components/Forms/AlertDialog";

export const NewLocationView = () => {
  const { buildingId } = useSearch({ from: "__root__" }) as SearchParams;
  const savedBuildingId =
    useSelectionStore((state) => state.buildingId) || buildingId;
  const savedSiteId = useSelectionStore((state) => state.siteId);
  const savedOrgId = useSelectionStore((state) => state.orgId);
  const languageList = useLanguages();
  const [showAlert, setShowAlert] = useState<AlertDialogType | null>(null);

  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);
  const dismissDraft = useDraftStore((state) => state.dismissDraft);

  const locationCreator = useLocationCreator();
  const building = useGetBuildingById(buildingId || null);

  const handleCreateLocation = async (locationData: EditLocationInput) => {
    if (!buildingId) return;
    const result = await locationCreator.mutateAsync(buildingId, locationData);
    if (!result.error && result.data?.location.location_id) {
      if (userId) dismissDraft(userId, "location");
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
    } else if (result.error) {
      setShowAlert({
        title: "Error creating location",
        description:
          result.error instanceof Error
            ? result.error.message
            : String(result.error),
        type: "error",
      });
    }
  };
  if (languageList.isLoading) {
    return <div>Loading languages...</div>;
  }
  if (languageList.isError) {
    return <div>Error loading languages: {languageList.error.message}</div>;
  }
  if (!languageList.data || languageList.data.length === 0) {
    return <div>No languages available</div>;
  }
  if (buildingId && building.isLoading) {
    return <div>Loading building data...</div>;
  }
  if (buildingId && (!building.data || building.isError)) {
    return <div className="text-red-500">Error loading building data.</div>;
  }
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
          <LocationForm
            submitForm={handleCreateLocation}
            languageList={languageList.data}
            draftRoute="/locations/new"
            draftSearch={{ orgId: savedOrgId, siteId: savedSiteId, buildingId }}
            onCancel={() => navigate({ to: "/locations", search: { orgId: savedOrgId, siteId: savedSiteId, buildingId: savedBuildingId } })}
            maxFloor={building.data?.building.total_floors || 1}
          />
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
        {showAlert && (
          <AlertDialog
            title={showAlert.title}
            description={showAlert.description}
            onConfirm={() => setShowAlert(null)}
            type={showAlert.type || "error"}
          />
        )}
      </div>
    </div>
  );
};
