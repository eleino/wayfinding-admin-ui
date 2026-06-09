import type { StepInstruction } from "@apptypes/step";
import { useGetTranslation } from "@hooks/useTranslations";

export const StepInstructions = (props: {
  instruction: StepInstruction;
  key: number;
}) => {
  const { instruction } = props;
  const { image, translation } = instruction.instructions;
  const { overlay } = image;
  const enTranslation = useGetTranslation(instruction.trl_instruction_key, "en");
  return (
    <div className="mb-2">
      <p className="text-lab-turquoise mb-1">Direction: {instruction.direction}</p>
      <p className="text-gray-300 mb-1">Translation key: {instruction.trl_instruction_key}
        <span className="block">fi: {translation}</span>
        <span className="block">en: {enTranslation ? enTranslation.data?.text_value : "Translation not available"}</span>
      </p>
      <div className="">
        <p>Image key: {instruction.img_key}</p>
        <p>Overlay key: {instruction.overlay_key}</p>
        <div className="relative w-100 h-auto top-0 left-0">
      {image.url && (
        <img
          src={image.url}
          alt={`Instruction ${instruction.img_key} image`}
          className="mt-1 relative w-full h-full top-0 left-0 object-contain"
        />
      )}
      {overlay && (
        <img
          src={overlay.overlay_image_url}
          alt={`Instruction ${instruction.img_key} overlay image`}
          className="absolute"
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
    </div>
  );
};
