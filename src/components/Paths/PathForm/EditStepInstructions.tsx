import type { StepApiResponse, StepInstructionsItem } from "@apptypes/step";
import { TextInput } from "@components/Forms/TextInput";
import { Form, useForm, Field } from "@formisch/react";
import { EditStepSchema } from "@schemas/step.schema";
import { StepOverlay } from "./StepOverlay";
import { useState } from "react";
import type { Translation } from "@apptypes/translation";
import type { ImageResponse } from "@apptypes/image";

export const EditStepInstructions = (props: {
  stepId: number;
  stepInstructionsEn?: StepInstructionsItem; //this step's instructions in English so we don't need to fetch overview twice here
  closeModal: () => void;
  stepIndex: number;
  locationName?: string;
  stepData: StepApiResponse | undefined;
  firstApproachEn: Translation | undefined;
  overlayImages: ImageResponse | undefined;
}) => {
  // we should get all other necessary data from fetching step overview
  const { stepId, stepInstructionsEn, stepIndex, locationName, stepData, firstApproachEn, overlayImages } = props;

  // new overlay is posted to backend if stepData's instructions.image.overlay for that direction was undefined
  // otherwise if the overlay parameters (position, size, rotation) or image_key have changed, we send a put request

  // const stepData = stepOverview.data;
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
        ? firstApproachEn?.text_value || ""
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

  const [approachOverlayKey, setApproachOverlayKey] = useState<string>(() => 
    overlayImages?.data.find(img => img.url === overlay_on_approach?.overlay_image_url)?.key || "");
  const [toNextOverlayKey, setToNextOverlayKey] = useState<string>(() => 
    overlayImages?.data.find(img => img.url === overlay_to_next?.overlay_image_url)?.key || "");

  const instructionsForm = useForm({
    schema: EditStepSchema,
    initialInput: initialValues,
  });


  return (
    <div>
        {!stepData ? (
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
                <span className="text-lab-turquoise">{locationName}</span>{" "}
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
                    overlayImages={overlayImages}
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
                    overlayImages={overlayImages}
                  />
                </div>
                <div className="flex justify-end">
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-lab-green-dark text-white rounded"
              >
                Save step
              </button>
              </div>
            </Form>
          </div>
        )}
    </div>
  );
};
