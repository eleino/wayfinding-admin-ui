import type { AppTranslation } from "./translation";

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

export interface StepListItem {
  step_order: number;
  distance_to_next_meters: number;
  video_instruction_url: string;
  img_on_approach: StepInstructionImage | null;
  img_to_next: StepInstructionImage | null;
  trl_instruction_on_approach_key: string;
  trl_instruction_to_next_key: string;
  translations: {
    fi?: AppTranslation[];
    en?: AppTranslation[];
  }
}

export interface StepListDestination {
  location_id: number;
  trl_location_name_key: string;
  translations: {
    fi?: AppTranslation[];
    en?: AppTranslation[];
  }
}

// GET /paths/:pathId/instructions?lang=fi
export interface StepListResponse {
  steps: StepListItem[];
  destination: StepListDestination;
}