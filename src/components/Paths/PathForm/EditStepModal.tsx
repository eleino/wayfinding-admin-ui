import type { StepInstructionsItem } from "@apptypes/step";
import { TextInput } from "@components/Forms/TextInput";
import { Form, useForm, Field, reset } from "@formisch/react";
import { useGetStepById } from "@hooks/useSteps";
import { EditStepSchema } from "@schemas/step.schema";
import { StepOverlay } from "./StepOverlay";
import { useGetTranslation } from "@hooks/useTranslations";
import { useEffect, useState } from "react";

export const EditStepModal = (props: {
  stepId: number;
  stepInstructionsEn?: StepInstructionsItem; //this step's instructions in English so we don't need to fetch overview twice here
  closeModal: () => void;
  locationName?: string;
  stepIndex: number;
}) => {
  // we should get all other necessary data from fetching step overview
  const { stepId, stepInstructionsEn, closeModal, stepIndex } = props;
  const stepOverview = useGetStepById(stepId);
  const firstApproachEn = useGetTranslation(
    stepInstructionsEn?.trl_instruction_on_approach_key || "",
    "en",
    { enabled: stepIndex === 0 },
  );
  const [approachOverlayKey, setApproachOverlayKey] = useState<string>("");
  const [toNextOverlayKey, setToNextOverlayKey] = useState<string>("");
  // new overlay is posted to backend if stepData's instructions.image.overlay for that direction was undefined
  // otherwise if the overlay parameters (position, size, rotation) or image_key have changed, we send a put request

  const stepData = stepOverview.data;
  const instructionKeys = {
    approach:
      stepData?.step.instructions.find(
        (instr) => instr.direction === "on_approach",
      )?.trl_instruction_key || "",
    to_next:
      stepData?.step.instructions.find((instr) => instr.direction === "to_next")
        ?.trl_instruction_key || "",
  };

  const overlay_on_approach =
    stepData?.step.instructions.find(
      (instr) => instr.direction === "on_approach",
    )?.instructions.image.overlay || undefined;
  const overlay_to_next =
    stepData?.step.instructions.find((instr) => instr.direction === "to_next")
      ?.instructions.image.overlay || undefined;

  const initialValues = {
    trl_instruction_on_approach_fi:
      stepData?.step.instructions.find(
        (instr) => instr.direction === "on_approach",
      )?.instructions.translation || "",

    trl_instruction_on_approach_en:
      stepIndex === 0
        ? firstApproachEn.data?.text_value || ""
        : stepInstructionsEn?.translations.en?.find(
            (text) =>
              text.translation_key ===
              stepInstructionsEn.trl_instruction_on_approach_key,
          )?.text_value || "",

    trl_instruction_to_next_fi:
      stepData?.step.instructions.find((instr) => instr.direction === "to_next")
        ?.instructions.translation || "",

    trl_instruction_to_next_en:
      stepInstructionsEn?.translations.en?.find(
        (text) =>
          text.translation_key ===
          stepInstructionsEn.trl_instruction_to_next_key,
      )?.text_value || "",

    image_on_approach_file: undefined,
    image_to_next_file: undefined,
    overlay_on_approach: {
      // also need overlay_key and image_key when sending data to backend
      position_x_percent: overlay_on_approach?.position_x_percent || 0,
      position_y_percent: overlay_on_approach?.position_y_percent || 0,
      rotation_deg: overlay_on_approach?.rotation_deg || 0,
      rotation_x_deg: overlay_on_approach?.rotation_x_deg || 0,
      overlay_size: overlay_on_approach?.overlay_size || 20,
    },

    overlay_to_next: {
      position_x_percent: overlay_to_next?.position_x_percent || 0,
      position_y_percent: overlay_to_next?.position_y_percent || 0,
      rotation_deg: overlay_to_next?.rotation_deg || 0,
      rotation_x_deg: overlay_to_next?.rotation_x_deg || 0,
      overlay_size: overlay_to_next?.overlay_size || 20,
    },
  };

  const instructionsForm = useForm({
    schema: EditStepSchema,
    initialInput: initialValues,
  });

  useEffect(() => {
    if (stepData) {
      reset(instructionsForm, {
        initialInput: {
          trl_instruction_on_approach_fi:
            stepData.step.instructions.find(
              (instr) => instr.direction === "on_approach",
            )?.instructions.translation || "",

          trl_instruction_on_approach_en:
            stepIndex === 0
              ? firstApproachEn.data?.text_value || ""
              : stepInstructionsEn?.translations.en?.find(
                  (text) =>
                    text.translation_key ===
                    stepInstructionsEn.trl_instruction_on_approach_key,
                )?.text_value || "",

          trl_instruction_to_next_fi:
            stepData.step.instructions.find(
              (instr) => instr.direction === "to_next",
            )?.instructions.translation || "",

          trl_instruction_to_next_en:
            stepInstructionsEn?.translations.en?.find(
              (text) =>
                text.translation_key ===
                stepInstructionsEn.trl_instruction_to_next_key,
            )?.text_value || "",

          image_on_approach_file: undefined,
          image_to_next_file: undefined,
          overlay_on_approach: {
            position_x_percent: overlay_on_approach?.position_x_percent || 0,
            position_y_percent: overlay_on_approach?.position_y_percent || 0,
            rotation_deg: overlay_on_approach?.rotation_deg || 0,
            rotation_x_deg: overlay_on_approach?.rotation_x_deg || 0,
            overlay_size: overlay_on_approach?.overlay_size || 20,
          },

          overlay_to_next: {
            position_x_percent: overlay_to_next?.position_x_percent || 0,
            position_y_percent: overlay_to_next?.position_y_percent || 0,
            rotation_deg: overlay_to_next?.rotation_deg || 0,
            rotation_x_deg: overlay_to_next?.rotation_x_deg || 0,
            overlay_size: overlay_to_next?.overlay_size || 20,
          },
        },
      });
    }
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-sidebar-grey rounded p-6 w-200 relative max-h-[90vh] overflow-y-auto scrollbar-thin top-0 left-0">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-white cursor-pointer border border-border-grey rounded w-10 h-10 text-2xl"
        >
          &times;
        </button>
        {stepOverview.isLoading || !stepData ? (
          <p>Loading step data...</p>
        ) : stepOverview.isError || !stepData ? (
          <p className="text-red-500">Error loading step data.</p>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Edit Step {stepData.step.step_order}
            </h2>

            <Form
              of={instructionsForm}
              onSubmit={(values) => {
                console.log("Submitted values:", values);
                // TODO handle submit
              }}
            >
              <p className="ml-1">
                Location:{" "}
                <span className="text-lab-turquoise">{props.locationName}</span>{" "}
                (id: {stepData.step.location_id})
              </p>
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
              {!stepOverview.isLoading && (
                <div className="flex flex-col gap-2 pt-10">
                  <h2 className="text-lg font-semibold">
                    Edit the image and overlay on approach
                  </h2>
                  <StepOverlay
                    imageUrl={
                      stepData.step.instructions.find(
                        (instr) => instr.direction === "on_approach",
                      )?.instructions.image.url
                    }
                    overlayUrl={overlay_on_approach?.overlay_image_url}
                    direction="on_approach"
                    form={instructionsForm}
                    setOverlayKey={setApproachOverlayKey}
                  />
                  <h2 className="text-lg font-semibold">
                    Edit the image and overlay leading to next step
                  </h2>
                  <StepOverlay
                    imageUrl={
                      stepData.step.instructions.find(
                        (instr) => instr.direction === "to_next",
                      )?.instructions.image.url
                    }
                    overlayUrl={overlay_to_next?.overlay_image_url}
                    direction="to_next"
                    form={instructionsForm}
                    setOverlayKey={setToNextOverlayKey}
                  />
                </div>
              )}
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-lab-green-dark text-white rounded"
              >
                Save step
              </button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};
