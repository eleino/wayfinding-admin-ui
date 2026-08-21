import type { StepApiResponse } from "@apptypes/step";
import type { EditStepInput } from "@schemas/step.schema";
import { TextInput } from "@components/Forms/TextInput";
import { useForm, Field, handleSubmit, FieldArray, reset, setInput } from "@formisch/react";
import { EditStepSchema } from "@schemas/step.schema";
import { StepOverlay } from "./StepOverlay";
import type { Translation } from "@apptypes/translation";
import type { ImageResponse } from "@apptypes/image";
import { useInstructionsUpdater } from "@hooks/useInstructionsUpdater";
import { useLocationImageLibrary } from "@hooks/useLocationImageLibrary";
import { useLanguages } from "@hooks/useAppInit";
import { useLocation } from "@tanstack/react-router";
import { FormDraftAutosaver, useFormDraft } from "@hooks/useFormDraft";
import { isDraftForRoute } from "@storage/drafts";
import type { SearchParams } from "@schemas/router.schema";
import { ConfirmDialog } from "@components/Forms/ConfirmDialog";
import { useEffect, useMemo, useRef, useState } from "react";
import { fillTranslationsForLanguages } from "./stepInstructionTranslations";

export const EditStepInstructions = (props: {
  stepInstructions?: {
    stepInstructionTranslations: EditStepInput;
    trl_instruction_to_next_key: string;
    trl_instruction_on_approach_key: string;
  };
  closeModal: () => void;
  stepIndex: number;
  locationName?: string;
  stepData: StepApiResponse;
  firstApproachTranslations: Translation[] | undefined;
  overlayImages: ImageResponse | undefined;
  firstApproachImageUrl?: string;
}) => {
  const {
    stepInstructions,
    stepIndex,
    locationName,
    stepData,
    firstApproachTranslations,
    overlayImages,
    closeModal,
    firstApproachImageUrl,
  } = props;

  const instructionsUpdater = useInstructionsUpdater();
  const imageLibrary = useLocationImageLibrary(stepData.step.location_id);
  const languageList = useLanguages();
  const { search } = useLocation();
  const currentStepInstructions = stepInstructions?.stepInstructionTranslations;

  const instructionKeys = {
    approach: stepInstructions?.trl_instruction_on_approach_key || "",
    to_next: stepInstructions?.trl_instruction_to_next_key || "",
  };

  const overlay_on_approach =
    stepData.step.instructions.find(
      (instr) => instr.direction === "on_approach",
    )?.instructions.image.overlay || undefined;
  const overlay_to_next =
    stepData.step.instructions.find((instr) => instr.direction === "to_next")
      ?.instructions.image.overlay || undefined;

  const approachOverlayKey =
    overlayImages?.data.find(
      (img) => img.url === overlay_on_approach?.overlay_image_url,
    )?.key || "";
  const toNextOverlayKey =
    overlayImages?.data.find(
      (img) => img.url === overlay_to_next?.overlay_image_url,
    )?.key || "";

  const draftSearch = { ...search, stepId: stepData.step.path_step_id } as SearchParams;
  const { draft, save, dismiss: dismissDraft } = useFormDraft({
    kind: "step-instruction",
    label: `Step instructions: ${locationName || `step ${stepData.step.step_order}`}`,
    route: "/paths/edit",
    search: draftSearch,
  });
  const baseInitialValues = {
    trl_instruction_on_approach:
      fillTranslationsForLanguages(
        languageList.data,
        stepIndex === 0
          ? firstApproachTranslations?.map((trl) => ({
              lang: trl.language_code,
              text: trl.text_value,
            }))
          : currentStepInstructions?.trl_instruction_on_approach,
      ),
    trl_instruction_to_next: fillTranslationsForLanguages(
      languageList.data,
      currentStepInstructions?.trl_instruction_to_next,
    ),

    image_on_approach_file: undefined,
    existing_image_on_approach_key: undefined,
    remove_image_on_approach: false,
    image_to_next_file: undefined,
    existing_image_to_next_key: undefined,
    remove_image_to_next: false,
    overlay_on_approach: overlay_on_approach && {
      image_key: approachOverlayKey,
      position_x_percent: Number(overlay_on_approach?.position_x_percent) || 0,
      position_y_percent: Number(
        overlay_on_approach?.position_y_percent ?? -20,
      ),
      rotation_deg: Number(overlay_on_approach?.rotation_deg) || 0,
      rotation_x_deg: Number(overlay_on_approach?.rotation_x_deg) || 0,
      overlay_size: Number(overlay_on_approach?.overlay_size) || 15,
    },

    overlay_to_next: overlay_to_next && {
      image_key: toNextOverlayKey,
      position_x_percent: Number(overlay_to_next?.position_x_percent) || 0,
      position_y_percent: Number(overlay_to_next?.position_y_percent ?? -20),
      rotation_deg: Number(overlay_to_next?.rotation_deg) || 0,
      rotation_x_deg: Number(overlay_to_next?.rotation_x_deg) || 0,
      overlay_size: Number(overlay_to_next?.overlay_size) || 15,
    },
  };
  const [serverInitialValues] = useState(() => baseInitialValues);
  const draftValues = draft && isDraftForRoute(draft, "/paths/edit", draftSearch)
    ? draft.values
    : undefined;
  const restoredValues = useMemo(
    () =>
      draftValues
        ? {
            ...serverInitialValues,
            ...draftValues,
            image_on_approach_file: undefined,
            image_to_next_file: undefined,
          }
        : serverInitialValues,
    [draftValues, serverInitialValues],
  );

  const instructionsForm = useForm({
    schema: EditStepSchema,
    initialInput: serverInitialValues,
    validate: "blur",
  });
  const hasRestoredDraft = useRef(false);
  // restore draft values if they exist and haven't been restored yet
  useEffect(() => {
    if (!draftValues || hasRestoredDraft.current) return;
    setInput(instructionsForm, { input: restoredValues as never });
    hasRestoredDraft.current = true;
  }, [draftValues, instructionsForm, restoredValues]);
  const [pendingAction, setPendingAction] = useState<"cancel" | "reset" | null>(null);

  const handleInstructionsSubmit = async (values: EditStepInput) => {
    const result = await instructionsUpdater.mutateAsync(
      values,
      serverInitialValues,
      stepData,
    );
    if (!result.error) {
      dismissDraft();
      closeModal();
    }
  };

  const onSave = handleSubmit(instructionsForm, handleInstructionsSubmit);
  const handleCancel = () => {
    if (instructionsForm.isDirty || draft) {
      setPendingAction("cancel");
      return;
    }
    dismissDraft();
    closeModal();
  };
  const handleReset = () => {
    setPendingAction("reset");
  };
  const confirmAction = () => {
    if (pendingAction === "cancel") {
      dismissDraft();
      closeModal();
      return;
    }
    reset(instructionsForm, { initialInput: serverInitialValues });
    dismissDraft();
    setPendingAction(null);
  };

  if (instructionsUpdater.isLoading) {
    return <div>{instructionsUpdater.loadingMessage}</div>;
  }
  if (instructionsUpdater.error) {
    return (
      <div className="text-red-500">
        Error updating instructions: {instructionsUpdater.error.message}
      </div>
    );
  }
  return (
    <div>
      {!stepData ? (
        <p className="text-red-500">Error loading step data.</p>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Edit Step {stepData.step.step_order}
          </h2>
          <div
            className="space-y-4"
          >
            <FormDraftAutosaver form={instructionsForm} save={save} />
            <p className="ml-1">
              Location:{" "}
              <span className="text-lab-turquoise">{locationName}</span> (id:{" "}
              {stepData.step.location_id})
            </p>

            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-lab-turquoise">
                Edit the instructions on approach
              </h2>
              <FieldArray
                of={instructionsForm}
                path={["trl_instruction_on_approach"]}
              >
                {(fieldArray) => (
                  <div>
                    {fieldArray.items.map((item, index) => (
                      <div key={item}>
                        <Field
                          of={instructionsForm}
                          path={["trl_instruction_on_approach", index, "lang"]}
                        >
                          {(langField) => (
                            <Field
                              of={instructionsForm}
                              path={[
                                "trl_instruction_on_approach",
                                index,
                                "text",
                              ]}
                            >
                              {(textField) => (
                                <TextInput
                                  label={`Instruction on approach (${langField.input}), key: ${instructionKeys.approach}`}
                                  {...textField.props}
                                  input={textField.input}
                                  onChange={(event) => {
                                    textField.onChange(event.target.value);
                                  }}
                                  errors={fieldArray.errors}
                                />
                              )}
                            </Field>
                          )}
                        </Field>
                      </div>
                    ))}
                  </div>
                )}
              </FieldArray>

              <StepOverlay
                imageUrl={
                  firstApproachImageUrl ??
                  stepData.step.instructions.find(
                    (instr) => instr.direction === "on_approach",
                  )?.instructions.image.url
                }
                overlayUrl={overlay_on_approach?.overlay_image_url}
                direction="on_approach"
                form={instructionsForm}
                overlayImages={overlayImages}
                overlayKey={approachOverlayKey}
                existingImageGroups={imageLibrary.groups}
                existingImagesLoading={imageLibrary.isLoading}
                existingImagesError={imageLibrary.error}
              />

              <h2 className="text-lg font-semibold text-lab-turquoise pt-5">
                Edit the instructions leading to next step
              </h2>
              <FieldArray
                of={instructionsForm}
                path={["trl_instruction_to_next"]}
              >
                {(fieldArray) => (
                  <div>
                    {fieldArray.items.map((item, index) => (
                      <div key={item}>
                        <Field
                          of={instructionsForm}
                          path={["trl_instruction_to_next", index, "lang"]}
                        >
                          {(langField) => (
                            <Field
                              of={instructionsForm}
                              path={["trl_instruction_to_next", index, "text"]}
                            >
                              {(textField) => (
                                <TextInput
                                  label={`Instruction to next (${langField.input}), key: ${instructionKeys.to_next}`}
                                  {...textField.props}
                                  input={textField.input}
                                  onChange={(event) => {
                                    textField.onChange(event.target.value);
                                  }}
                                  errors={fieldArray.errors}
                                />
                              )}
                            </Field>
                          )}
                        </Field>
                      </div>
                    ))}
                  </div>
                )}
              </FieldArray>

              <StepOverlay
                imageUrl={
                  stepData.step.instructions.find(
                    (instr) => instr.direction === "to_next",
                  )?.instructions.image.url
                }
                overlayUrl={overlay_to_next?.overlay_image_url}
                direction="to_next"
                form={instructionsForm}
                overlayKey={toNextOverlayKey}
                overlayImages={overlayImages}
                existingImageGroups={imageLibrary.groups}
                existingImagesLoading={imageLibrary.isLoading}
                existingImagesError={imageLibrary.error}
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="mt-4 w-full rounded border border-border-grey px-4 py-2 text-white cursor-pointer sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 w-full rounded border border-border-grey px-4 py-2 text-white cursor-pointer sm:w-auto"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onSave}
                className="mt-4 w-full rounded bg-lab-green-dark px-4 py-2 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                disabled={!instructionsForm.isDirty}
              >
                Save step
              </button>
            </div>
            {pendingAction && (
              <ConfirmDialog
                title={pendingAction === "cancel" ? "Discard step instruction changes?" : "Reset step instructions?"}
                description={pendingAction === "cancel" ? "Your unsaved changes and saved instruction draft will be removed." : "The instructions will return to their original values and the saved draft will be removed."}
                confirmLabel={pendingAction === "cancel" ? "Discard changes" : "Reset instructions"}
                onConfirm={confirmAction}
                onCancel={() => setPendingAction(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
