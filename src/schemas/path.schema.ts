import * as v from 'valibot';
import { StepArraySchema } from './step.schema';

export const PathBaseSchema = v.object({
  path_name: v.pipe(v.string(), v.nonEmpty("Name cannot be empty")),
  priority: v.pipe(v.number(), v.integer("Priority must be an integer")),
  estimated_time_minutes: v.pipe(v.number(), v.minValue(0, "Estimated time must be a positive number"), v.integer("Estimated time must be an integer")),
  accessibility_level: v.pipe(v.number(), v.integer("Accessibility level must be an integer between 0 and 2"), v.minValue(0, "Accessibility level must be between 0 and 2"), v.maxValue(2, "Accessibility level must be between 0 and 2")),
  video_instruction_url: v.pipe(v.string(), v.url("Video instruction URL must be a valid URL")),
  organizations: v.optional(v.array(v.number())),
});

export const CreatePathSchema = v.intersect([
  PathBaseSchema,
  StepArraySchema,
]);

export const EditPathSchema = v.intersect([
  PathBaseSchema,
  v.object({
    elevated_priority_starts_at: v.optional(v.date("Elevated priority start date must be a valid date")),
    elevated_priority_expires_at: v.optional(v.date("Elevated priority end date must be a valid date")),
    // trl_path_name_fi: v.pipe(v.string(), v.nonEmpty("Finnish name cannot be empty")),
    // trl_path_name_en: v.pipe(v.string(), v.nonEmpty("English name cannot be empty")),
  }),
]);
