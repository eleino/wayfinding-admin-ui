import { type FormStore, Field } from "@formisch/react";
import type { StepArraySchema } from "@schemas/step.schema";
import type { EntranceLocation, ListLocation } from "@apptypes/location";
import { useState } from "react";
import { createPortal } from "react-dom";
import { LocationModal } from "@components/Locations/LocationModal";
import { useLocation } from "@tanstack/react-router";
import type { CreatePathSchema } from "@schemas/path.schema";

interface EditStepLocationProps {
  form: FormStore<typeof StepArraySchema | typeof CreatePathSchema>;
  locationList: ListLocation[] | undefined;
  entryLocations: EntranceLocation[] | undefined;
  stepIndex: number;
  setStepError: (hasError: boolean) => void;
  setUnsavedChanges?: (hasUnsavedChanges: boolean) => void;
}

export const EditStepLocation = (props: EditStepLocationProps) => {
  const { form, locationList, entryLocations, stepIndex, setStepError, setUnsavedChanges } = props;
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const { search } = useLocation();
  const buildingId = search.buildingId;

  const entrances = entryLocations?.map((entry) => ({
    id: entry.location_id,
    name:
      entry.translations.fi?.find(
        (t) => t.translation_key === entry.trl_location_name_key,
      )?.text_value || entry.trl_location_name_key,
  }));
  return (
        <Field of={form} path={["steps", stepIndex, "location_id"]}>
          {(field) => {
            if (field.input === undefined || field.input === 0) {
              setStepError(true);
            } else setStepError(false);
            return (
              <div className="flex flex-col pt-1 gap-1">
                <div className="flex flex-row gap-2">
                  {/* <label className="p-1 pl-0">Step location: <span className="text-red-500">*</span></label> */}
                  <div>
                    Select a location below or
                    <button
                      type="button"
                      onClick={() => setIsLocationModalOpen(true)}
                      className="bg-lab-blue text-white ml-2 p-1 px-2 mb-1 rounded"
                    >
                      Add new location
                    </button>
                    {isLocationModalOpen &&
                      createPortal(
                        <LocationModal
                          buildingId={buildingId || null}
                          closeModal={() => setIsLocationModalOpen(false)}
                          setLocationId={(id) => {
                            field.onChange(id);
                            setUnsavedChanges?.(true);
                          }}
                          isEntryLocation={stepIndex === 0}
                          heading="Create New Location"
                        />,
                        document.body,
                      )}
                  </div>
                </div>
                {stepIndex === 0 ? (
                  <select
                    {...field.props}
                    value={field.input}
                    required
                    onChange={(event) => {
                      field.onChange(Number(event.target.value));
                      setUnsavedChanges?.(true);
                    }}
                    className="w-80 p-2 mb-2 border border-border-grey rounded bg-black"
                  >
                    <option value="">
                      {entrances && entrances.length > 0
                        ? "Select a location"
                        : "No entry locations available yet"}
                    </option>
                    {entrances?.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                ) : locationList ? (
                  <select
                    {...field.props}
                    value={field.input}
                    required
                    onChange={(event) => {
                      field.onChange(Number(event.target.value));
                      setUnsavedChanges?.(true);
                    }}
                    className="w-80 p-1 mb-2 border border-border-grey rounded bg-black"
                  >
                    <option value="">
                      {locationList && locationList.length > 0
                        ? "Select a location"
                        : "No locations available yet"}
                    </option>
                    {locationList?.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-red-500">
                    Could not load entry locations.
                  </p>
                )}
                {field.errors && <p className="text-red-500">{field.errors}</p>}
              </div>
            );
          }}
        </Field>
  );
};
