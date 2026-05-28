import { useState } from "react";
import { DeleteDialog } from "@components/Forms/DeleteDialog";
import { Field } from "@formisch/react";
import { createPortal } from "react-dom";
import { EditStepModal } from "./EditStepModal";
import { EditStepLocation } from "./EditStepLocation";
import { usePathEditSteps } from "../PathContext/PathEditStepsContext";
import { useGetTranslationsEnFi } from "@hooks/useTranslations";

export const EditStep = (props: {
  stepIndex: number;
  haveStepDataDetails: boolean;
  onRemove: () => void;
  setUnsavedChanges: (hasUnsavedChanges: boolean) => void;
}) => {
  const {
    stepIndex,
    onRemove,
    haveStepDataDetails,
    setUnsavedChanges,
  } = props;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [stepError, setStepError] = useState(false);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const { form, locationList, entryLocations, pathData, pathInstructionsFi, pathInstructionsEn, allowRearranging } = usePathEditSteps();
  const stepNro = stepIndex + 1;
  const currentStep = pathData.steps?.[stepIndex];
  const currentStepInstructionsFi = pathInstructionsFi?.steps.find(
    (step) => step.step_order === stepNro,
  );
  const currentStepInstructionsEn = pathInstructionsEn?.steps.find(
    (step) => step.step_order === stepNro,
  );
  
  const stepInstructions = {
    distance_to_next_meters:
      currentStepInstructionsFi?.distance_to_next_meters || 0,
    name: currentStep?.name || `Step ${stepNro}`,
    approach: {
      fi: {
        key: currentStepInstructionsFi?.trl_instruction_on_approach_key,
        text:
          currentStepInstructionsFi?.translations?.fi?.find(
            (text) =>
              text.translation_key ===
              currentStepInstructionsFi?.trl_instruction_on_approach_key,
          )?.text_value || "N/A",
      },
      en: {
        key: currentStepInstructionsEn?.trl_instruction_on_approach_key,
        text:
          currentStepInstructionsEn?.translations?.en?.find(
            (text) =>
              text.translation_key ===
              currentStepInstructionsEn?.trl_instruction_on_approach_key,
          )?.text_value || "N/A",
      },
      overlay: currentStepInstructionsFi?.img_on_approach?.overlay || null,
      image: currentStepInstructionsFi?.img_on_approach || null,
    },
    to_next: {
      fi: {
        key: currentStepInstructionsFi?.trl_instruction_to_next_key,
        text:
          currentStepInstructionsFi?.translations?.fi?.find(
            (text) =>
              text.translation_key ===
              currentStepInstructionsFi?.trl_instruction_to_next_key,
          )?.text_value || "N/A",
      },
      en: {
        key: currentStepInstructionsEn?.trl_instruction_to_next_key,
        text:
          currentStepInstructionsEn?.translations?.en?.find(
            (text) =>
              text.translation_key ===
              currentStepInstructionsEn?.trl_instruction_to_next_key,
          )?.text_value || "N/A",
      },
      overlay: currentStepInstructionsFi?.img_to_next?.overlay || null,
      image: currentStepInstructionsFi?.img_to_next || null,
    },
  };
    const firstApproachText = useGetTranslationsEnFi(stepInstructions.approach.fi.key, {enabled: stepIndex === 0});

  return (
    <div className={`border p-4 mb-4 bg-sidebar-grey rounded relative ${stepError ? "border-red-500" : "border-lab-green-dark"} `}>
      <div className="flex flex-row">
        <Field of={form} path={["steps", stepIndex, "step_order"]}>
          {(field) => {
            if (field.input !== stepNro) {
              field.onChange(stepNro);
            }
            return (
              <p className="font-bold text-lab-turquoise p-2 border-2 border-dashed rounded border-lab-turquoise">
                Step {field.input}
              </p>
            );
          }}
        </Field>
        <div className="absolute right-4 top-4 flex flex-row gap-3">
          <button
            className={`bg-${allowRearranging ? "gray-300 border border-border-grey" : "lab-blue cursor-pointer"} text-white px-4 py-1 rounded`}
            onClick={() => setIsInstructionModalOpen(true)}
            type="button"
          >
            Edit Step Instructions
          </button>
          {isInstructionModalOpen &&
            createPortal(
              <EditStepModal
                stepIndex={stepIndex}
                stepId={currentStep?.id || 0}
                stepInstructionsEn={currentStepInstructionsEn}
                closeModal={() => setIsInstructionModalOpen(false)}
                locationName={currentStep?.name}
              />,
              document.body,
            )}
          <p
            className={`${(allowRearranging && stepIndex !== 0) ? "cursor-pointer inline-block text-red-500 outline-red-500" : "text-gray-500 outline-gray-500"} w-6 h-6 mt-1 text-4xl outline-3 rounded text-center`}
            onClick={() => {
              if (allowRearranging && stepIndex !== 0) setShowDeleteConfirm(true);
            }}
          >
            <span className="relative bottom-2">&times;</span>
          </p>
          {showDeleteConfirm && (
            <DeleteDialog
              itemName={`Step ${stepIndex + 1}`}
              onConfirm={() => {
                onRemove();
                setUnsavedChanges(true);
                setShowDeleteConfirm(false);
              }}
              onCancel={() => setShowDeleteConfirm(false)}
            />
          )}
        </div>
      </div>
        {allowRearranging ? (
          <EditStepLocation
            form={form}
            locationList={locationList}
            entryLocations={entryLocations}
            stepIndex={stepIndex}
            setStepError={setStepError}
            setUnsavedChanges={setUnsavedChanges}
          />
        ) : (
          <p className="pt-1">Location: {stepInstructions.name}</p>
        )}
      <div className="flex flex-row gap-4">

        {haveStepDataDetails ? (
          <div className="flex flex-row gap-4 pb-2">
            <Field
              of={form}
              path={["steps", stepIndex, "distance_to_next_meters"]}
            >
              {(field) => {
                return (
                  <div className="flex flex-col">
                    <label className="">
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
                        //setUnsavedChanges(true); // maybe not necessary?
                      }}
                      className="w-50 pl-2 p-1 border border-border-grey rounded bg-black"
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
                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                        // setUnsavedChanges(true);
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
        ) : (
          <p>
            Distance to next: {stepInstructions.distance_to_next_meters} meters
          </p>
        )}
      </div>

      <div className="flex flex-row">
        <div className="flex flex-col flex-1 gap-1 max-w-1/2">
          <p className="font-bold text-lab-turquoise">
            Instruction on approach:
          </p>
          <p className="wrap-break-word text-sm text-gray-400">
            {stepInstructions.approach.fi.key}
          </p>
          <div className="flex flex-row gap-2">
            <div className="relative w-20 h-auto top-0 left-0 flex-none">
              {stepInstructions.approach.image ? (
                <img
                  src={stepInstructions.approach.image.url}
                  alt={`Instruction image for step ${stepIndex + 1}`}
                  className="w-full h-full object-contain relative"
                />
              ) : (
                <p className="text-gray-500">No image</p>
              )}
              {stepInstructions.approach.overlay ? (
                <img
                  src={stepInstructions.approach.overlay?.overlay_image_url}
                  alt={`Instruction overlay for step ${stepIndex + 1}`}
                  className="mt-1 absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: `${stepInstructions.approach.overlay.overlay_size}%`,
                    height: "auto",
                    transform: `
                translate(${stepInstructions.approach.overlay.position_x_percent}%, ${stepInstructions.approach.overlay.position_y_percent}%)
                perspective(6cm)
                rotateX(${stepInstructions.approach.overlay.rotation_x_deg}deg) 
                rotate(${stepInstructions.approach.overlay.rotation_deg}deg)
            `,
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                />
              ) : (
                ""
              )}
            </div>
            <p>
              FI: {stepIndex === 0 && firstApproachText.data ? firstApproachText.data[1].text_value : stepInstructions.approach.fi.text || "N/A"}
              <br />
              EN: {stepIndex === 0 && firstApproachText.data ? firstApproachText.data[0].text_value : stepInstructions.approach.en.text || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex flex-col text-end flex-1 max-w-1/2">
          <p className="font-bold text-lab-turquoise">Instruction to next:</p>
          <p className="wrap-break-word text-sm text-gray-400">
            {stepInstructions.to_next.fi.key}
          </p>
          <div className="flex flex-row gap-2">
            <div className="relative w-20 flex-none">
              {stepInstructions.to_next.image ? (
                <img
                  src={stepInstructions.to_next.image.url}
                  alt={`Instruction image for step ${stepIndex + 1}`}
                  className="w-full h-full object-contain relative"
                />
              ) : (
                <p className="text-gray-500">No image</p>
              )}
              {stepInstructions.to_next.overlay ? (
                <img
                  src={stepInstructions.to_next.overlay?.overlay_image_url}
                  alt={`Instruction overlay for step ${stepIndex + 1}`}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: `${stepInstructions.to_next.overlay.overlay_size}%`,
                    height: "auto",
                    transform: `
                translate(${stepInstructions.to_next.overlay.position_x_percent}%, ${stepInstructions.to_next.overlay.position_y_percent}%)
                perspective(6cm)
                rotateX(${stepInstructions.to_next.overlay.rotation_x_deg}deg) 
                rotate(${stepInstructions.to_next.overlay.rotation_deg}deg)
            `,
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                />
              ) : (
                ""
              )}
            </div>
            <p className="text-end w-full">
              FI: {stepInstructions.to_next.fi.text}
              <br />
              EN: {stepInstructions.to_next.en.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
