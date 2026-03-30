export interface StepResponse {
  path_step_id: number;
  path_id: number;
  location_id: number;
  step_order: number;
  distance_to_next_meters: number;
  video_timestamp_seconds: number;
  img_on_approach_key: string;
  img_to_next_key: string;
  overlay_on_approach_key: string;
  overlay_to_next_key: string;
  trl_instruction_on_approach_key: string;
  trl_instruction_to_next_key: string;
}

export interface PathResponse {
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
  allowed_organizations: {
    organization_id: number;
    name: string;
  }[];
  steps?: StepResponse[];
}
