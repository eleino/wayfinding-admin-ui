export interface UpdatePathDTO {
    name?: string;
    priority?: number;
    estimated_time_minutes?: number;
    accessibility_level?: number;
    video_instruction_url?: string;
    organizations?: number[];
    elevated_priority_starts_at?: Date;
    elevated_priority_expires_at?: Date;
}