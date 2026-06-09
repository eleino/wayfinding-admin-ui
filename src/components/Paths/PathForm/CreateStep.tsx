import { Field } from "@formisch/react";
import { useState } from "react";
import { DeleteDialog } from "@components/Forms/DeleteDialog";
import { EditStepLocation } from "./EditStepLocation";
import { usePathCreateSteps } from "../PathContext/PathCreateStepsContext";

type CreateStepProps = {
  stepIndex: number;
  onRemove: () => void;
};
export const CreateStep = (props: CreateStepProps) => {
  const {
    stepIndex,
    onRemove,
  } = props;
  const [stepError, setStepError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { form, locationList, entryLocations, calcPathLength } = usePathCreateSteps();

  return (
    <div
      className={`mb-2 p-1 py-2 border ${stepError ? "border-red-500" : "border-lab-green-dark"} shadow-xl/30 rounded bg-sidebar-grey flex flex-row relative`}
    >
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
        <span
          className={`${stepIndex !== 0 ? "text-red-500 outline-red-500" : "text-gray-500 outline-gray-500"} cursor-pointer w-6 h-6 text-4xl absolute right-2 outline-3 rounded text-center`}
          onClick={() => {
            if (stepIndex !== 0) setShowDeleteConfirm(true);
          }}
        >
          <span className="relative bottom-2">&times;</span>
        </span>
        {showDeleteConfirm && (
          <DeleteDialog
            itemName={`Step ${stepIndex + 1}`}
            onConfirm={() => {
              onRemove();
              setShowDeleteConfirm(false);
            }}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
        <EditStepLocation
          form={form}
          locationList={locationList}
          entryLocations={entryLocations}
          stepIndex={stepIndex}
          setStepError={setStepError}
        />
        <div className="flex flex-row gap-4">
          <Field
            of={form}
            path={["steps", stepIndex, "distance_to_next_meters"]}
          >
            {(field) => {
              return (
                <div className="flex flex-col">
                  <label className="ml-1">
                    Distance to next step (meters){" "}
                    <span className="text-red-500">*</span>
                  </label>
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
                  {field.errors && (
                    <p className="text-red-500 ml-1">{field.errors}</p>
                  )}
                </div>
              );
            }}
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
                  {field.errors && (
                    <p className="text-red-500">{field.errors}</p>
                  )}
                </div>
              );
            }}
          </Field>
        </div>
      </div>
    </div>
  );
};
