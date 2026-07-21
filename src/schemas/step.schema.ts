import type { CreateStepDTO } from "@apptypes/dtos/create-step.dto";
import * as v from "valibot";
import { TranslationSchema } from "./location.schema";

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
  // overlay and image keys are required but not entered by user.
  // overlay_key: v.string(), // e.g. FROM_30_AT_5_TO_14
  image_key: v.string("must be a string"), // e.g. OVERLAY_LEFT_ARROW
  position_x_percent: v.number("x percent must be a number"),
  position_y_percent: v.number("y percent must be a number"),
  rotation_deg: v.number("rotation must be a number"),
  rotation_x_deg: v.number("x rotation must be a number"),
  overlay_size: v.number("overlay size must be a number"),
});

// instructions are optional, user frontend displays a step's approach/to next instruction+image(+overlay) based on whether text instruction for it is present
export const EditStepSchema = v.object({
    trl_instruction_on_approach: v.optional(v.array(TranslationSchema)),
    trl_instruction_to_next: v.optional(v.array(TranslationSchema)),
    image_on_approach_file: v.optional(v.pipe(v.file(), v.mimeType(["image/jpeg", "image/png"], "Only JPEG and PNG images are allowed"))),
    image_to_next_file: v.optional(v.pipe(v.file(), v.mimeType(["image/jpeg", "image/png"], "Only JPEG and PNG images are allowed"))),
    overlay_on_approach: v.optional(
      OverlaySchema
    ),
    overlay_to_next: v.optional(
      OverlaySchema
    ),
  });
