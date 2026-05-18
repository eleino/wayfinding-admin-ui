import type { CreateStepDTO } from "@apptypes/dtos/create-step.dto";
import * as v from "valibot";

export const StepSchema = v.object({
  location_id: v.number(),
  step_order: v.number(),
  distance_to_next_meters: v.pipe(v.number(), v.integer()),
  video_timestamp_seconds: v.optional(v.number()),
});

export const StepArraySchema =
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
  });

export const OverlaySchema = v.object({
  // overlay_key: v.string(), // e.g. FROM_30_AT_5_TO_14
  // overlay_image_key: v.string(), // e.g. OVERLAY_LEFT_ARROW
  position_x_percent: v.number(),
  position_y_percent: v.number(),
  rotation_deg: v.number(),
  rotation_x_deg: v.number(),
  overlay_size: v.number(),
});

export const EditStepSchema = v.intersect([
  StepSchema,
  v.object({
    location_id: v.number(),
    step_order: v.number(),
    distance_to_next_meters: v.pipe(v.number(), v.integer()),
    video_timestamp_seconds: v.optional(v.number()),
    trl_instruction_on_approach_fi: v.pipe(v.string(), v.nonEmpty("Instruction on approach (Finnish) is missing")),
    trl_instruction_on_approach_en: v.pipe(v.string(), v.nonEmpty("Instruction on approach (English) is missing")),
    trl_instruction_to_next_fi: v.pipe(v.string(), v.nonEmpty("Instruction to next (Finnish) is missing")),
    trl_instruction_to_next_en: v.pipe(v.string(), v.nonEmpty("Instruction to next (English) is missing")),
    image_on_approach_file: v.optional(v.pipe(v.file(), v.mimeType(["image/jpeg", "image/png"], "Only JPEG and PNG images are allowed"))),
    image_to_next_file: v.optional(v.pipe(v.file(), v.mimeType(["image/jpeg", "image/png"], "Only JPEG and PNG images are allowed"))),
    overlay_on_approach: v.optional(
      OverlaySchema
    ),
    overlay_to_next: v.optional(
      OverlaySchema
    ),
  }),
]);
