import type { StepCreationResponse } from "./step";
export interface PathOrganization {
  organization_id: number;
  name: string;
}

export interface PathStep {
  id: number;
  name: string;
  order: number;
  location_id: number;
  distance_to_next_meters: number;
  video_timestamp_seconds: number;
}

export interface PathResponsePath {
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
}

// GET /paths/:pathId/overview
export interface PathApiResponse {
  path: PathResponsePath;
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
