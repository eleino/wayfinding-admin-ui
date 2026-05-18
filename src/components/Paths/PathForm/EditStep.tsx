import type { ListLocation } from "@apptypes/location";
import type { EditPathInput } from "@apptypes/path";
import type { StepInstructionsList } from "@apptypes/step";

export const EditStep = (props: {
  stepIndex: number;
  locationList?: ListLocation[];
  calcPathLength: () => string;
  pathData: EditPathInput;
  pathInstructionsFi?: StepInstructionsList;
  pathInstructionsEn?: StepInstructionsList;
  allowRearranging?: boolean;
}) => {
  const {
    stepIndex,
    locationList,
    calcPathLength,
    pathData,
    pathInstructionsFi,
    pathInstructionsEn,
    allowRearranging
  } = props;
  const stepNro = stepIndex + 1;
  const stepInstructions = {
    distance_to_next_meters: pathInstructionsFi?.steps.find((step) => step.step_order === stepNro)?.distance_to_next_meters || 0,
    name: pathData.steps?.[stepIndex]?.name || `Step ${stepNro}`,
    approach: {
        fi: {
            key: pathInstructionsFi?.steps.find((step) => step.step_order === stepNro)?.trl_instruction_on_approach_key,
            text: pathInstructionsFi?.steps.find((step) => step.step_order === stepNro)?.translations?.fi?.find((text) => text.translation_key === pathInstructionsFi?.steps.find((step) => step.step_order === stepNro)?.trl_instruction_on_approach_key)?.text_value || "N/A"
        },
        en: {
            key: pathInstructionsEn?.steps.find((step) => step.step_order === stepNro)?.trl_instruction_on_approach_key,
            text: pathInstructionsEn?.steps.find((step) => step.step_order === stepNro)?.translations?.en?.find((text) => text.translation_key === pathInstructionsEn?.steps.find((step) => step.step_order === stepNro)?.trl_instruction_on_approach_key)?.text_value || "N/A"
        },
        overlay: pathInstructionsFi?.steps.find((step) => step.step_order === stepNro)?.img_on_approach?.overlay || null,
        image: pathInstructionsFi?.steps.find((step) => step.step_order === stepNro)?.img_on_approach || null,
    },
    to_next: {
        fi: {
            key: pathInstructionsFi?.steps.find((step) => step.step_order === stepNro)?.trl_instruction_to_next_key,
            text: pathInstructionsFi?.steps.find((step) => step.step_order === stepNro)?.translations.fi?.find((text) => text.translation_key === pathInstructionsFi?.steps.find((step) => step.step_order === stepNro)?.trl_instruction_to_next_key)?.text_value || "N/A"
        },
        en: {
            key: pathInstructionsEn?.steps.find((step) => step.step_order === stepNro)?.trl_instruction_to_next_key,
            text: pathInstructionsEn?.steps.find((step) => step.step_order === stepNro)?.translations?.en?.find((text) => text.translation_key === pathInstructionsEn?.steps.find((step) => step.step_order === stepNro)?.trl_instruction_to_next_key)?.text_value || "N/A"
        },
        overlay: pathInstructionsFi?.steps.find((step) => step.step_order === stepNro)?.img_to_next?.overlay || null,
        image: pathInstructionsFi?.steps.find((step) => step.step_order === stepNro)?.img_to_next || null,
    }
  }
  return (
    <div className="border p-4 mb-4 bg-sidebar-grey rounded">
      <div className="flex flex-row gap-4"><p className="w-30">Step {stepIndex + 1}</p>
      <button className={`bg-${allowRearranging ? 'lab-blue' : 'black'} text-white px-4 py-1 rounded hover:bg-lab-blue-dark`} onClick={() => {}}>
        Change Location
      </button>
      <button className={`bg-${allowRearranging ? 'black':'lab-blue' } text-white px-4 py-1 rounded hover:bg-lab-green-dark`} onClick={() => {}}>
        Edit Path Instructions
      </button></div>
      <p>Location: {stepInstructions.name}</p>
        <p>Distance to next: {stepInstructions.distance_to_next_meters} meters</p>
        <p className="font-bold text-lab-turquoise">Instruction on approach:</p>
        <p>FI: {stepInstructions.approach.fi.text || "N/A"}, EN: {stepInstructions.approach.en.text || "N/A"}</p>
        <div className="relative w-50 top-0 left-0">Image:
        {stepInstructions.approach.image ? (
          <img src={stepInstructions.approach.image.url} alt={`Instruction image for step ${stepIndex + 1}`} className="w-100 object-contain relative" />
          
        ) : (
          "N/A"
        )}
        {stepInstructions.approach.overlay ? (
          <img src={stepInstructions.approach.overlay?.overlay_image_url} alt={`Instruction overlay for step ${stepIndex + 1}`} className="mt-1 absolute"
          style={{
            top: "55%",
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
            zIndex: 100,
          }} />
        ) : (
          ""
        )}
        </div>
        <p className="font-bold text-lab-turquoise">Instruction to next:</p>
        <p>FI: {stepInstructions.to_next.fi.text}, EN: {stepInstructions.to_next.en.text}</p>
        <div className="relative w-50 top-0 left-0">Image:
        {stepInstructions.to_next.image ? (
          <img src={stepInstructions.to_next.image.url} alt={`Instruction image for step ${stepIndex + 1}`} className="w-100 object-contain relative" />
          
        ) : (
          "N/A"
        )}
        {stepInstructions.to_next.overlay ? (
          <img src={stepInstructions.to_next.overlay?.overlay_image_url} alt={`Instruction overlay for step ${stepIndex + 1}`} className="mt-1 absolute"
          style={{
            top: "55%",
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
            zIndex: 100,
          }} />
        ) : (
          ""
        )}
        </div>
        
    </div>
  );
};
