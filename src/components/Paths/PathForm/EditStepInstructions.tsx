import type {
  EditStepInput,
  StepApiResponse,
  StepInstructionsItem,
} from "@apptypes/step";
import { TextInput } from "@components/Forms/TextInput";
import { useForm, Field, handleSubmit } from "@formisch/react";
import { EditStepSchema } from "@schemas/step.schema";
import { StepOverlay } from "./StepOverlay";
import type { Translation } from "@apptypes/translation";
import type { ImageResponse } from "@apptypes/image";
import { useInstructionsUpdater } from "@hooks/useInstructionsUpdater";

export const EditStepInstructions = (props: {
  stepInstructionsEn?: StepInstructionsItem;
  closeModal: () => void;
  stepIndex: number;
  locationName?: string;
  stepData: StepApiResponse;
  firstApproachEn: Translation | undefined;
  overlayImages: ImageResponse | undefined;
}) => {
  const {
    stepInstructionsEn,
    stepIndex,
    locationName,
    stepData,
    firstApproachEn,
    overlayImages,
    closeModal,
  } = props;

  const instructionsUpdater = useInstructionsUpdater();

  const instructionKeys = {
    approach:
      stepData.step.instructions.find(
        (instr) => instr.direction === "on_approach",
      )?.trl_instruction_key || "",
    to_next:
      stepData.step.instructions.find((instr) => instr.direction === "to_next")
        ?.trl_instruction_key || "",
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

  const initialValues = {
    trl_instruction_on_approach_fi:
      stepData.step.instructions.find(
        (instr) => instr.direction === "on_approach",
      )?.instructions.translation || "",

    trl_instruction_on_approach_en:
      stepIndex === 0
        ? firstApproachEn?.text_value || ""
        : stepInstructionsEn?.translations.en?.find(
            (text) =>
              text.translation_key ===
              stepInstructionsEn.trl_instruction_on_approach_key,
          )?.text_value || "",

    trl_instruction_to_next_fi:
      stepData.step.instructions.find((instr) => instr.direction === "to_next")
        ?.instructions.translation || "",

    trl_instruction_to_next_en:
      stepInstructionsEn?.translations.en?.find(
        (text) =>
          text.translation_key ===
          stepInstructionsEn.trl_instruction_to_next_key,
      )?.text_value || "",

    image_on_approach_file: undefined,
    image_to_next_file: undefined,
    overlay_on_approach: overlay_on_approach && {
      // also need overlay_key and image_key when sending data to backend
      image_key: approachOverlayKey,
      position_x_percent: Number(overlay_on_approach?.position_x_percent) || 0,
      position_y_percent: Number(overlay_on_approach?.position_y_percent ?? -20),
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

  const instructionsForm = useForm({
    schema: EditStepSchema,
    initialInput: initialValues,
  });

  const handleInstructionsSubmit = async (values: EditStepInput) => {
    console.log("Submitted values:", values);
    console.log("Form Errors:", instructionsForm.errors);
    const result = await instructionsUpdater.mutateAsync(
      values, initialValues, stepData
    );
    if (!result.error) {
      closeModal();
    }
  };

  const onSave = handleSubmit(instructionsForm, handleInstructionsSubmit);

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

          {/* <Form
              of={instructionsForm}
              onSubmit={(data) => {
                console.log("wtf")
                handleInstructionsSubmit(data);
              }}
              className="space-y-4"
            > */}
          <div className="space-y-4">
            <p className="ml-1">
              Location:{" "}
              <span className="text-lab-turquoise">{locationName}</span> (id:{" "}
              {stepData.step.location_id})
            </p>

            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-lab-turquoise">
                Edit the instructions on approach
              </h2>
              <Field
                of={instructionsForm}
                path={["trl_instruction_on_approach_fi"]}
              >
                {(field) => (
                  <TextInput
                    label={`Instruction on approach (fi), key: ${instructionKeys.approach}`}
                    {...field.props}
                    input={field.input}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                    errors={field.errors}
                  />
                )}
              </Field>
              <Field
                of={instructionsForm}
                path={["trl_instruction_on_approach_en"]}
              >
                {(field) => (
                  <TextInput
                    label="Instruction on approach (en)"
                    {...field.props}
                    input={field.input}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                    errors={field.errors}
                  />
                )}
              </Field>
              <StepOverlay
                imageUrl={
                  stepData.step.instructions.find(
                    (instr) => instr.direction === "on_approach",
                  )?.instructions.image.url
                }
                overlayUrl={overlay_on_approach?.overlay_image_url}
                direction="on_approach"
                form={instructionsForm}
                overlayImages={overlayImages}
                overlayKey={approachOverlayKey}
              />

              <h2 className="text-lg font-semibold text-lab-turquoise pt-5">
                Edit the instructions leading to next step
              </h2>
              <Field
                of={instructionsForm}
                path={["trl_instruction_to_next_fi"]}
              >
                {(field) => (
                  <TextInput
                    label={`Instruction to next (fi), key: ${instructionKeys.to_next}`}
                    {...field.props}
                    input={field.input}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                    errors={field.errors}
                  />
                )}
              </Field>
              <Field
                of={instructionsForm}
                path={["trl_instruction_to_next_en"]}
              >
                {(field) => (
                  <TextInput
                    label="Instruction to next (en)"
                    {...field.props}
                    input={field.input}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                    errors={field.errors}
                  />
                )}
              </Field>
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
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onSave}
                className="mt-4 px-4 py-2 bg-lab-green-dark text-white rounded cursor-pointer"
              >
                Save step
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
