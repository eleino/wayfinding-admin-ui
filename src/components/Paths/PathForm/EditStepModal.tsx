import type { StepInstructionsItem } from "@apptypes/step";
import { TextInput } from "@components/Forms/TextInput";
import { Form, useForm, Field } from "@formisch/react";
import { useGetStepById } from "@hooks/useSteps";
import { EditStepSchema } from "@schemas/step.schema";

export const EditStepModal = (props: {
  stepId: number;
  stepInstructionsEn?: StepInstructionsItem; //this step's instructions in English so we don't need to fetch overview twice here
  closeModal: () => void;
  locationName?: string;
}) => {
  // we should get all other necessary data from fetching step overview
  const { stepId, stepInstructionsEn, closeModal } = props;
  const stepOverview = useGetStepById(stepId);

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
  const instructionsForm = useForm({
    schema: EditStepSchema,
    initialInput: {
      trl_instruction_on_approach_fi:
        stepData?.step.instructions.find(
          (instr) => instr.direction === "on_approach",
        )?.instructions.translation || "",

      trl_instruction_on_approach_en:
        stepInstructionsEn?.translations.en?.find(
          (text) =>
            text.translation_key ===
            stepInstructionsEn.trl_instruction_on_approach_key,
        )?.text_value || "",

      trl_instruction_to_next_fi:
        stepData?.step.instructions.find(
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
      overlay_on_approach:
        stepData?.step.instructions.find(
          (instr) => instr.direction === "on_approach",
        )?.instructions.image.overlay || undefined,

      overlay_to_next:
        stepData?.step.instructions.find(
          (instr) => instr.direction === "to_next",
        )?.instructions.image.overlay || undefined,
    },
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-sidebar-grey rounded p-6 w-150 relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-white cursor-pointer border border-border-grey rounded w-10 h-10 text-2xl"
        >
          &times;
        </button>{" "}
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
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};
