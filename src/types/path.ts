
export interface PathOrganization {
  organization_id: number;
  name: string;
}

export interface PathStep {
  id: number;
  name: string;
  order: number;
}

// returned when fetching the overview for a specific path
export interface PathApiResponse {
  path: {
    path_id: number;
    name: string;
    start_location_id: number;
    end_location_id: number;
    building_id: number;
    is_active: boolean;
    priority: number;
    elevated_priority_starts_at: Date;
    elevated_priority_expires_at: Date;
    distance_meters: number;
    estimated_time_minutes: number;
    accessibility_level: number;
    video_instruction_url: string;
    trl_path_name_key: string;
    allowed_organizations: PathOrganization[];
  };
  steps?: PathStep[];
}

// returned when fetching a list of paths for a building
export interface Path {
  id: number;
  name: string;
}
