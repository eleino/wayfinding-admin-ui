import * as v from 'valibot';
export const StepSchema =
  v.object({
    location_id: v.number(),
    step_order: v.number(),
    distance_to_next_meters: v.pipe(v.number(), v.integer()),
    video_timestamp_seconds: v.optional(v.number()),
  });