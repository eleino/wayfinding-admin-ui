import * as v from "valibot";

export const LocationSchema = v.object({
    location_name: v.pipe(v.string(), v.nonEmpty("Name cannot be empty")),
    is_entry_location: v.boolean(),
    floor_number: v.pipe(v.number("Floor number is required and must be a number between 1 and 3"), v.integer(), v.toMinValue(1), v.toMaxValue(3)),
    trl_location_name_fi: v.pipe(v.string(), v.nonEmpty("Finnish name cannot be empty")),
    trl_location_name_en: v.pipe(v.string(), v.nonEmpty("English name cannot be empty")),
    trl_at_current_location_msg_fi: v.pipe(v.string(), v.nonEmpty("Finnish message cannot be empty")),
    trl_at_current_location_msg_en: v.pipe(v.string(), v.nonEmpty("English message cannot be empty")),
    imageFile: v.optional(v.pipe(v.file(), v.mimeType(["image/jpeg", "image/png"], "Only JPEG and PNG images are allowed"))),
});