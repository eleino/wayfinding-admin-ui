export interface CreateStepDTO {
    location_id: number;
    step_order: number;
    distance_to_next_meters: number;
    video_timestamp_seconds?: number;
}