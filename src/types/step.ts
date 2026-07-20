import type { AppTranslation } from "./translation";

export interface StepInstructionImageOverlay {
  overlay_image_url: string;
  position_x_percent: number;
  position_y_percent: number;
  overlay_size: number;
  rotation_deg: number;
  rotation_x_deg: number;
}

export interface StepInstructionImage {
  url: string;
  overlay: StepInstructionImageOverlay | null;
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

export interface StepInstructionsItem {
  step_order: number;
  distance_to_next_meters: number;
  video_instruction_url: string;
  img_on_approach: StepInstructionImage | null;
  img_to_next: StepInstructionImage | null;
  trl_instruction_on_approach_key: string;
  trl_instruction_to_next_key: string;
  translations: {
    [lang: string]: AppTranslation[];
  };
}

export interface StepInstructionsDestination {
  location_id: number;
  trl_location_name_key: string;
  translations: {
    [lang: string]: AppTranslation[];
  };
}

// GET /paths/:pathId/instructions?lang=fi
export interface StepInstructionsList {
  steps: StepInstructionsItem[];
  destination: StepInstructionsDestination;
}

// part of the response when posting a new path
export interface StepCreationResponse {
  path_step_id: number;
  path_id: number;
  location_id: number;
  step_order: number;
  distance_to_next_meters: number;
  video_timestamp_seconds: number;
  img_on_approach_key: string;
  img_to_next_key: string;
  trl_instruction_on_approach_key: string;
  trl_instruction_to_next_key: string;
  overlay_on_approach_key: string;
  overlay_to_next_key: string;
}

export interface EditStepOverlay {
  // overlay_key: string; // e.g. FROM_30_AT_5_TO_14
  image_key: string; // e.g. OVERLAY_LEFT_ARROW
  position_x_percent: number;
  position_y_percent: number;
  overlay_size: number;
  rotation_deg: number;
  rotation_x_deg: number;
}

export interface EditStepInput {
  image_on_approach_url?: string;
  image_on_approach_file?: File;
  image_to_next_url?: string;
  image_to_next_file?: File;
  trl_instruction_on_approach?: { lang: string, text: string }[];
  trl_instruction_to_next?: { lang: string, text: string }[];
  overlay_on_approach?: EditStepOverlay;
  overlay_to_next?: EditStepOverlay;
}
