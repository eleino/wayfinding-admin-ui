// form for creating and editing locations
import { Field, Form, useForm } from "@formisch/react"
import type { EditLocationInput } from "@apptypes/location";
import * as v from "valibot";

const LocationSchema = v.object({
    name: v.pipe(v.string(), v.nonEmpty("Name cannot be empty")),
    is_entry_location: v.boolean(),
    floor_number: v.number(),
    trl_location_name_fi: v.pipe(v.string(), v.nonEmpty("Finnish name cannot be empty")),
    trl_location_name_en: v.pipe(v.string(), v.nonEmpty("English name cannot be empty")),
    trl_at_current_location_msg_fi: v.pipe(v.string(), v.nonEmpty("Finnish message cannot be empty")),
    trl_at_current_location_msg_en: v.pipe(v.string(), v.nonEmpty("English message cannot be empty")),
    imageFile: v.optional(v.pipe(v.file(), v.mimeType(["image/jpeg", "image/png"], "Only JPEG and PNG images are allowed"))),
});

export const LocationForm = (props: { locationData: EditLocationInput | null }) => {
    const { locationData } = props;
    const initialValues = locationData || {
        name: "",
        is_entry_location: false,
        floor_number: 0,
        trl_location_name_fi: "",
        trl_location_name_en: "",
        trl_at_current_location_msg_fi: "",
        trl_at_current_location_msg_en: "",
        imageFile: undefined,
    };
    const locationForm = useForm({
        schema: LocationSchema,
        initialInput: initialValues,
    });
}