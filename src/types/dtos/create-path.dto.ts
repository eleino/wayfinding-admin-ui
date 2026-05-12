import type { CreateStepDTO } from "./create-step.dto";
export interface CreatePathDTO {
    name: string;
    priority: number;
    estimated_time_minutes?: number;
    accessibility_level: number;
    video_instruction_url: string;
    organizations?: number[]; // list of org ids with access?
    steps: CreateStepDTO[];
}