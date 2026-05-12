import { CreatePathSchema } from "@schemas/path.schema";
import type { FormStore } from "@formisch/react";
import { Field } from "@formisch/react";
import type { ListLocation } from "@apptypes/location";
import { useState } from "react";
import { LocationModal } from "@components/Locations/LocationModal";
import { useLocation } from "@tanstack/react-router";
import { createPortal } from "react-dom";

type CreateStepProps = {
  form: FormStore<typeof CreatePathSchema>;
  stepIndex: number;
  locationList: ListLocation[] | undefined;
  calcPathLength: () => void;
};
export const CreateStep = (props: CreateStepProps) => {
  const { form, stepIndex, locationList, calcPathLength } = props;
  const [stepError, setStepError] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const {search} = useLocation();
  const buildingId = search.buildingId;
  return (
    <div className={`mb-2 p-1 py-2 border ${stepError ? 'border-red-500' : 'border-lab-green-dark'} shadow-xl/30 rounded bg-sidebar-grey flex flex-row`}>
      <Field of={form} path={["steps", stepIndex, "step_order"]}>
        {(field) => {
          if (field.input !== stepIndex + 1) {
            field.onChange(stepIndex + 1);
          }
          return (
            <div className="text-center self-center w-15 py-5 border border-dashed m-1 border-lab-turquoise text-lab-turquoise font-bold text-2xl rounded">
              {field.input}
            </div>
          );
        }}
      </Field>
      <div>
        <Field of={form} path={["steps", stepIndex, "location_id"]}>
          {(field) => { 
            if (field.input === undefined || field.input === 0) {
              setStepError(true);
            } else setStepError(false);
            return(
            <div className="flex flex-col ml-1 gap-1">
              <div className="flex flex-row gap-2">
                {/* <label className="p-1 pl-0">Step location: <span className="text-red-500">*</span></label> */}
                <div>Select a location below or <button type="button" onClick={() => setIsLocationModalOpen(true)} className="bg-lab-blue text-white p-1 px-2 mb-1 rounded">
                  Add new location
                </button>
                {isLocationModalOpen && (
                    createPortal(<LocationModal 
                      buildingId={buildingId || null}
                      closeModal={() => setIsLocationModalOpen(false)}
                      setLocationId={(id) => field.onChange(id)}
                      heading="Create New Location"
                    />, document.body)
                )}
                </div>
              </div>
                {locationList ? (
                  <select
                    {...field.props}
                    value={field.input}
                    required
                    onChange={(event) => {
                      field.onChange(Number(event.target.value));
                    }}
                    className="w-80 p-1 mb-2 border border-border-grey rounded bg-black"
                  >
                    <option value="">Select a location</option>
                    {locationList.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-red-500">Could not load locations.</p>
                )}
                {field.errors && <p className="text-red-500">{field.errors}</p>}
            </div>
          )}}
        </Field>
        <div className="flex flex-row gap-4">
          <Field
            of={form}
            path={["steps", stepIndex, "distance_to_next_meters"]}
          >
            {(field) => { 
            return (
              <div className="flex flex-col">
                <label className="ml-1">Distance to next step (meters) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  {...field.props}
                  value={field.input}
                  required
                  min="0"
                  onChange={(event) => {
                    field.onChange(Number(event.target.value));
                    calcPathLength();
                       }}
                  className="ml-1 w-50 pl-2 p-1 border border-border-grey rounded bg-black"
                />
                {field.errors && <p className="text-red-500 ml-1">{field.errors}</p>}
              </div>
            )}}
          </Field>
          <Field
            of={form}
            path={["steps", stepIndex, "video_timestamp_seconds"]}
          >
            {(field) => { 
             return (
              <div className="flex flex-col">
                <label className="ml-1">Video timestamp (seconds)</label>
                <input
                  type="number"
                  {...field.props}
                  value={field.input || ""}
                  min="0"
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(value === "" ? undefined : Number(value));
                           }}
                  className="ml-1 w-50 pl-2 p-1 border border-border-grey rounded bg-black"
                />
                {field.errors && <p className="text-red-500">{field.errors}</p>}
              </div>
            )}}
          </Field>
        </div>
      </div>
    </div>
  );
};
