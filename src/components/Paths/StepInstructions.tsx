import type { StepInstruction } from "@apptypes/step";
import { useGetTranslation } from "@hooks/useTranslations";
/*
export interface StepInstructionImageOverlay {
  overlay_image_url: string;
  position_x_percent: string;
  position_y_percent: string;
  overlay_size: number;
  rotation_deg: number;
  rotation_x_deg: number;
}

export interface StepInstructionImage {
  url: string;
  overlay: StepInstructionImageOverlay;
}

export interface StepInstructionDetails {
  image: StepInstructionImage;
  translation: string;
}

export interface StepInstruction {
  direction: "on_approach" | "to_next" | string;
  img_key: string;
  overlay_key: string;
  trl_instruction_key: string;
  instructions: StepInstructionDetails;
}
*/

export const StepInstructions = (props: {
  instruction: StepInstruction;
  key: number;
}) => {
  const { instruction } = props;
  const { image, translation } = instruction.instructions;
  const { overlay } = image;
  const enTranslation = useGetTranslation(instruction.trl_instruction_key, "en");
  return (
    <div key={props.key} className="mb-2">
      <p className="text-gray-300 mb-1">Direction: {instruction.direction}</p>
      <p className="text-gray-300 mb-1">Translation key: {instruction.trl_instruction_key}
        <p>fi: {translation}</p>
        <p>en: {enTranslation ? enTranslation.data?.text_value : "Translation not available"}</p>
      </p>
      <div className="relative w-100 h-auto top-0 left-0">
        <p>Image key: {instruction.img_key}</p>
        <p>Overlay key: {instruction.overlay_key}</p>
      {image.url && (
        <img
          src={image.url}
          alt={`Instruction ${props.key} image`}
          className="mt-1 relative w-100 h-auto top-0 left-0"
        />
      )}
      {overlay && (
        <img
          src={overlay.overlay_image_url}
          alt={`Instruction ${props.key} overlay image`}
          className="mt-1 absolute"
          style={{
            top: "50%",
            left: "50%",
            width: `${overlay.overlay_size}%`,
            height: "auto",
            transform: `
                translate(${overlay.position_x_percent}%, ${overlay.position_y_percent}%)
                perspective(6cm)
                rotateX(${overlay.rotation_x_deg}deg) 
                rotate(${overlay.rotation_deg}deg)
            `,
            pointerEvents: "none",
            zIndex: 100,
          }}
        />
      )}
      </div>
    </div>
  );
};
