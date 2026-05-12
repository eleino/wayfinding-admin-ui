import type { StepCreationResponse, StepListItem } from "./step";
import type { AppTranslation } from "./translation";
export interface PathOrganization {
  organization_id: number;
  name: string;
}

export interface PathStep {
  id: number;
  name: string;
  order: number;
}

// GET /paths/:pathId/overview
export interface PathApiResponse {
  path: {
    path_id: number;
    name: string;
    start_location_id: number;
    end_location_id: number;
    building_id: number;
    is_active: boolean;
    priority: number;
    elevated_priority_starts_at: Date | null;
    elevated_priority_expires_at: Date | null;
    distance_meters: number | null;
    estimated_time_minutes: number;
    accessibility_level: number;
    video_instruction_url: string;
    trl_path_name_key: string | null;
    allowed_organizations: PathOrganization[];
  };
  steps?: PathStep[];
}

export interface Path {
  id: number;
  name: string;
}

// GET /buildings/:buildingId/paths
export interface PathListResponse {
  paths: Path[];
  meta: {
    paths: {
      total: number;
      limit: number;
    };
  };
}

// POST /buildings/:buildingId/paths response
export interface CreatePathResponse {
  path_id: number;
  name: string;
  start_location_id: number;
  end_location_id: number;
  building_id: number;
  is_active: boolean;
  priority: number;
  elevated_priority_starts_at: Date | null;
  elevated_priority_expires_at: Date | null;
  distance_meters: number | null;
  estimated_time_minutes: number;
  accessibility_level: number;
  video_instruction_url: string;
  trl_path_name_key: string | null;
  allowed_organizations: PathOrganization[];
  steps: StepCreationResponse[];
}

// GET /paths/:pathId/instructions?lang=fi|en response
export interface PathInstructionsResponse {
  steps: StepListItem[];
  destination: {
    location_id: number;
    trl_location_name_key: string;
    translations: {
      fi?: AppTranslation[];
      en?: AppTranslation[];
    };
  };
}

export interface CreatePathStep {
  location_id: number;
  step_order: number;
  distance_to_next_meters: number;
  video_timestamp_seconds?: number;
}
export interface EditPathInput {
  path_name: string;
  priority: number;
  estimated_time_minutes?: number;
  accessibility_level: number;
  video_instruction_url: string;
  organizations?: number[];
  elevated_priority_starts_at?: Date;
  elevated_priority_expires_at?: Date;
  steps?: CreatePathStep[];
}
