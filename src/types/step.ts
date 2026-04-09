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