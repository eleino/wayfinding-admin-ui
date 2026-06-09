// modal to pop open LocationForm
import { LocationForm } from "./LocationForm";
import type { EditLocationInput } from "@apptypes/location";
import { useLocationCreator } from "@hooks/useLocationCreator";

export const LocationModal = (props: {
  locationData?: EditLocationInput | null;
  buildingId: number | null;
  closeModal: () => void;
  setLocationId: (id: number) => void;
  heading: string;
  isEntryLocation?: boolean;
}) => {
  const {
    locationData,
    buildingId,
    closeModal,
    setLocationId,
    heading,
    isEntryLocation,
  } = props;
  const locationCreator = useLocationCreator();
  const handleSubmit = async (data: EditLocationInput) => {
    if (!buildingId) return;
    const result = await locationCreator.mutateAsync(buildingId, data);
    if (!result.error && result.data?.location.location_id) {
      setLocationId(result.data.location.location_id);
      closeModal();
    }
  };
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-20">
      <div className="bg-sidebar-grey rounded p-6 w-150 relative h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="sticky w-full top-0 left-0 flex justify-end">
          <button
            onClick={closeModal}
            className="cursor-pointer border border-border-grey bg-sidebar-grey/90 rounded w-10 h-10 text-2xl hover:border-lab-turquoise hover:text-lab-turquoise transition-colors z-50"
          >
            &times;
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4">{heading}</h2>
        <LocationForm
          locationData={locationData}
          isEntryLocation={isEntryLocation}
          handleSubmit={(data) => {
            handleSubmit(data);
          }}
        />
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
