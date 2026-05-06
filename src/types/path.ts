
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
    }
  }
}