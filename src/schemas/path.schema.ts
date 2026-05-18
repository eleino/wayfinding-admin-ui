import * as v from 'valibot';
import { StepSchema } from './step.schema';
import type { CreateStepDTO } from '@apptypes/dtos/create-step.dto';
export const PathBaseSchema = v.object({
  path_name: v.pipe(v.string(), v.nonEmpty("Name cannot be empty")),
  priority: v.pipe(v.number(), v.integer("Priority must be an integer")),
  estimated_time_minutes: v.optional(v.pipe(v.number(), v.minValue(0, "Estimated time must be a positive number"), v.integer("Estimated time must be an integer"))),
  accessibility_level: v.pipe(v.number(), v.integer("Accessibility level must be an integer")),
  video_instruction_url: v.pipe(v.string(), v.url("Video instruction URL must be a valid URL")),
  organizations: v.optional(v.array(v.number())),
});

export const CreatePathSchema = v.intersect([
  PathBaseSchema,
  v.object({
    steps: v.pipe(
      v.array(StepSchema),
      v.minLength(2, "A path must have at least 2 steps"),
      v.custom(
        (steps) => {
          // Type assertion because v.custom expects type 'unknown' but typescript wants it to be known
          const arr = steps as CreateStepDTO[];
          const ids = arr.map(s => s.location_id);
          return new Set(ids).size === ids.length;
        },
        "Each step must have a unique location."
      )
    ),
  }),
]);

export const EditPathSchema = v.intersect([
  PathBaseSchema,
  v.object({
    elevated_priority_starts_at: v.optional(v.date("Elevated priority start date must be a valid date")),
    elevated_priority_expires_at: v.optional(v.date("Elevated priority end date must be a valid date")),
    trl_path_name_fi: v.pipe(v.string(), v.nonEmpty("Finnish name cannot be empty")),
    trl_path_name_en: v.pipe(v.string(), v.nonEmpty("English name cannot be empty")),
  }),
]);
