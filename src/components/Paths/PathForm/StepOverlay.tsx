import type { StepInstructionImage } from '@apptypes/step';
interface StepOverlayProps {
  image: StepInstructionImage | undefined;
  overlay_key: string | undefined;
  img_key: string | undefined;
}

export const StepOverlay = (props: StepOverlayProps) => {
  const { overlay_key, img_key, image } = props;
  const overlay = image?.overlay;
  return (
    <div>Edit overlay</div>
  )
}   