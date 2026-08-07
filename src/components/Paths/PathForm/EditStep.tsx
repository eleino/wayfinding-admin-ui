import { useMemo, useState } from "react";
import { DeleteDialog } from "@components/Forms/DeleteDialog";
import { Field } from "@formisch/react";
import { createPortal } from "react-dom";
import { EditStepModal } from "./EditStepModal";
import { EditStepLocation } from "./EditStepLocation";
import { usePathEditSteps } from "../PathContext/PathEditStepsContext";
import { useGetTranslationsAllLangs } from "@hooks/useTranslations";
import { useGetLocationById } from "@hooks/useLocations";
import type { StepInstructionsItem } from "@apptypes/step";

export const EditStep = (props: {
  stepIndex: number;
  haveStepDataDetails: boolean;
  onRemove: () => void;
  setUnsavedChanges: (hasUnsavedChanges: boolean) => void;
}) => {
  const { stepIndex, onRemove, haveStepDataDetails, setUnsavedChanges } = props;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [stepError, setStepError] = useState(false);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const {
    form,
    locationList,
    entryLocations,
    pathData,
    pathInstructions,
    allowRearranging,
    languageList,
  } = usePathEditSteps();
  const stepNro = stepIndex + 1;
  const currentStep = pathData.steps?.[stepIndex];

  // capture current step instructions for all languages
  const currentStepInstructions = useMemo(() => {
    if (!pathInstructions || !languageList?.length) return undefined;
    // so currentStepInstructions will be an object with the following structure:
    // {
    //   step_order: number,
    //   trl_instruction_on_approach_key: string,
    //   trl_instruction_to_next_key: string,
    //   trl_instruction_on_approach: { lang: string, text: string }[],
    //   trl_instruction_to_next: { lang: string, text: string }[],
    // }
    // map the pathInstructions array to find the step with the correct step_order
    const stepEntries = pathInstructions
      .map((langInstructions, index) => {
        const languageCode = languageList[index]?.code;
        const step = langInstructions.steps.find(
          (stp) => stp.step_order === stepNro,
        );
        return languageCode && step ? { languageCode, step } : null;
      })
      .filter( // filter out null values and assert the type of the remaining entries
        (
          entry,
        ): entry is { languageCode: string; step: StepInstructionsItem } =>
          entry !== null,
      );

    const baseStep = stepEntries[0]?.step; // to fill in non-translation entries
    if (!baseStep) return undefined;

    return {
      stepInstructionTranslations: {
        step_order: baseStep.step_order,
        distance_to_next_meters: baseStep.distance_to_next_meters,
        img_on_approach: baseStep.img_on_approach,
        img_to_next: baseStep.img_to_next,
        // fill in the translations for each language:
        trl_instruction_on_approach: stepEntries.map(
          ({ languageCode, step }) => ({
            lang: languageCode,
            text:
              step.translations[languageCode]?.find(
                (trl) =>
                  trl.translation_key === step.trl_instruction_on_approach_key,
              )?.text_value || "",
          }),
        ),
        trl_instruction_to_next: stepEntries.map(({ languageCode, step }) => ({
          lang: languageCode,
          text:
            step.translations[languageCode]?.find(
              (trl) => trl.translation_key === step.trl_instruction_to_next_key,
            )?.text_value || "",
        })),
      },
      trl_instruction_on_approach_key:
        baseStep.trl_instruction_on_approach_key || "",
      trl_instruction_to_next_key: baseStep.trl_instruction_to_next_key || "",
    };
  }, [pathInstructions, stepNro, languageList]);

  const firstLocation = useGetLocationById(
    stepIndex === 0 ? currentStep?.location_id : undefined,
    { enabled: stepIndex === 0 && !!currentStep?.location_id },
  );
  const firstApproachTranslationKey =
    firstLocation.data?.location.trl_current_location_msg_key ??
    currentStepInstructions?.trl_instruction_on_approach_key;
  const firstApproachText = useGetTranslationsAllLangs(
    firstApproachTranslationKey,
    { enabled: stepIndex === 0 && !!firstApproachTranslationKey },
  );
  const firstApproachImageUrl = firstLocation.data?.image?.url ?? undefined;
  const approachImage =
    stepIndex === 0 && firstApproachImageUrl
      ? { url: firstApproachImageUrl, overlay: null }
      : currentStepInstructions?.stepInstructionTranslations?.img_on_approach;

  return (
    <div
      className={`border p-4 mb-4 bg-sidebar-grey rounded relative ${stepError ? "border-red-500" : "border-lab-green-dark"} `}
    >
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
            disabled={allowRearranging}
            type="button"
          >
            Edit Step Instructions
          </button>
          {isInstructionModalOpen &&
            createPortal(
              <EditStepModal
                stepIndex={stepIndex}
                stepId={currentStep?.id || 0}
                stepInstructions={currentStepInstructions}
                closeModal={() => setIsInstructionModalOpen(false)}
                locationName={currentStep?.name}
                firstApproachImageUrl={firstApproachImageUrl}
              />,
              document.body,
            )}
          <div
            className={`${allowRearranging && stepIndex !== 0 ? "cursor-pointer inline-block text-red-500 outline-red-500" : "text-gray-500 outline-gray-500"} w-6 h-6 mt-1 text-4xl outline-3 rounded text-center`}
            onClick={() => {
              if (allowRearranging && stepIndex !== 0)
                setShowDeleteConfirm(true);
            }}
          >
            <span className="relative bottom-2">&times;</span>
          </div>
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
        <p className="pt-1">Location: {currentStep?.name}</p>
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
                        setUnsavedChanges(true);
                      }}
                      className="w-50 pl-2 p-1 border border-border-grey rounded bg-black"
                    />
                    {field.errors && (
                      <div className="text-red-500 ml-1">{field.errors}</div>
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
                        setUnsavedChanges(true);
                      }}
                      className="ml-1 w-50 pl-2 p-1 border border-border-grey rounded bg-black"
                    />
                    {field.errors && (
                      <div className="text-red-500">{field.errors}</div>
                    )}
                  </div>
                );
              }}
            </Field>
          </div>
        ) : (
          <p>Distance to next: {currentStep?.distance_to_next_meters} meters</p>
        )}
      </div>

      <div className="flex flex-row">
        <div className="flex flex-col flex-1 gap-1 max-w-1/2">
          <p className="font-bold text-lab-turquoise">
            Instruction on approach:
          </p>
          <p className="wrap-break-word text-sm text-gray-400">
            {currentStepInstructions?.trl_instruction_on_approach_key}
          </p>
          <div className="flex flex-row gap-2">
            <div className="relative w-20 h-auto top-0 left-0 flex-none">
              {approachImage ? (
                <img
                  src={approachImage.url}
                  alt={`Instruction image for step ${stepIndex + 1}`}
                  className="w-full h-full object-contain relative"
                />
              ) : (
                <p className="text-gray-500">No image</p>
              )}
              {approachImage?.overlay ? (
                <img
                  src={approachImage.overlay.overlay_image_url}
                  alt={`Instruction overlay for step ${stepIndex + 1}`}
                  className="mt-1 absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: `${approachImage.overlay.overlay_size}%`,
                    height: "auto",
                    transform: `
                translate(${approachImage.overlay.position_x_percent}%, ${approachImage.overlay.position_y_percent}%)
                perspective(6cm)
                rotateX(${approachImage.overlay.rotation_x_deg}deg)
                rotate(${approachImage.overlay.rotation_deg}deg)
            `,
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                />
              ) : (
                ""
              )}
            </div>
            <div>
              {stepIndex === 0 && firstApproachText.data ? (
                <div className="flex flex-col gap-1">
                  {firstApproachText.data.map((trl) => (
                    <span key={trl.language_code}>
                      {trl.language_code.toUpperCase()}: {trl.text_value}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {currentStepInstructions?.stepInstructionTranslations?.trl_instruction_on_approach.map(
                    (trl) => (
                      <span key={trl.lang}>
                        {trl.lang.toUpperCase()}: {trl.text}
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col text-end flex-1 max-w-1/2">
          <div className="font-bold text-lab-turquoise">Instruction to next:</div>
          <div className="wrap-break-word text-sm text-gray-400">
            {currentStepInstructions?.trl_instruction_to_next_key}
          </div>
          <div className="flex flex-row gap-2">
            <div className="relative w-20 flex-none">
              {currentStepInstructions?.stepInstructionTranslations
                ?.img_to_next ? (
                <img
                  src={
                    currentStepInstructions?.stepInstructionTranslations
                      ?.img_to_next.url
                  }
                  alt={`Instruction image for step ${stepIndex + 1}`}
                  className="w-full h-full object-contain relative"
                />
              ) : (
                <p className="text-gray-500">No image</p>
              )}
              {currentStepInstructions?.stepInstructionTranslations?.img_to_next
                ?.overlay ? (
                <img
                  src={
                    currentStepInstructions?.stepInstructionTranslations
                      ?.img_to_next.overlay?.overlay_image_url
                  }
                  alt={`Instruction overlay for step ${stepIndex + 1}`}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: `${currentStepInstructions?.stepInstructionTranslations?.img_to_next.overlay?.overlay_size}%`,
                    height: "auto",
                    transform: `
                translate(${currentStepInstructions?.stepInstructionTranslations?.img_to_next.overlay?.position_x_percent}%, ${currentStepInstructions?.stepInstructionTranslations?.img_to_next.overlay?.position_y_percent}%)
                perspective(6cm)
                rotateX(${currentStepInstructions?.stepInstructionTranslations?.img_to_next.overlay?.rotation_x_deg}deg) 
                rotate(${currentStepInstructions?.stepInstructionTranslations?.img_to_next.overlay?.rotation_deg}deg)
            `,
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                />
              ) : (
                ""
              )}
            </div>
            <div className="text-end w-full">
              <div className="flex flex-col gap-1">
                {currentStepInstructions?.stepInstructionTranslations?.trl_instruction_to_next.map(
                  (trl) => (
                    <span key={trl.lang}>
                      {trl.lang.toUpperCase()}: {trl.text}
                    </span>
                  ),
                )}
              </div>
              {/* FI: {stepInstructions.to_next.fi.text}
              <br />
              EN: {stepInstructions.to_next.en.text} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
