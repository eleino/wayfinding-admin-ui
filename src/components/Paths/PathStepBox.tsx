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

export interface StepDetailResponse {
  path_step_id: number;
  path_id: number;
  location_id: number;
  step_order: number;
  distance_to_next_meters: number;
  video_timestamp_seconds: number;
  instructions: StepInstruction[];
}

// the response to GET /steps/:stepId/overview
export interface StepApiResponse {
  step: StepDetailResponse;
}
  */

import { useGetStepById } from "@hooks/useSteps";

export const PathStepBox = (props: { stepId: number }) => {
  const { stepId } = props;
  const stepQuery = useGetStepById(stepId, {
    enabled: !!stepId,
  });

  if (stepQuery.isLoading) {
    return <p>Loading step details...</p>;
  }

  if (stepQuery.isError) {
    return <p>Error loading step details: {stepQuery.error.message}</p>;
  }

  if (!stepQuery.data) {
    return <p>No step data available.</p>;
  }
  const step = stepQuery.data.step;

  return (
    <div className="bg-sidebar-grey p-4 rounded shadow mb-4 border-l-4 border-lab-blue">
      <h3 className="text-lg font-bold mb-2">Step {step.step_order}</h3>
      <p className="text-gray-300 mb-1">Location ID: {step.location_id}</p>
      <p className="text-gray-300 mb-1">Distance to next step: {step.distance_to_next_meters} meters</p>
      <p className="text-gray-300 mb-1">Video timestamp: {step.video_timestamp_seconds} seconds</p>
      <h4 className="text-md font-semibold mt-2 mb-1">Instructions:</h4>
      {step.instructions.map((instruction, index) => (
        <div key={index} className="mb-2">
          <p className="text-gray-300 mb-1">Direction: {instruction.direction}</p>
          <p className="text-gray-300 mb-1">Translation: {instruction.instructions.translation}</p>
          {instruction.instructions.image.url && (
            <img src={instruction.instructions.image.url} alt={`Instruction ${index} image`} className="mt-1 w-50 h-auto" />
          )}
        </div>
      ))}
    </div>
  );
};