// form for creating and editing locations
import { Field, Form, useForm, setInput } from "@formisch/react";
import type { EditLocationInput } from "@apptypes/location";
import { useState } from "react";
import { TextInput } from "@components/Forms/TextInput";
import { ToggleBox } from "@components/Forms/ToggleBox";
import { ImageDropBox } from "@components/Forms/ImageDropBox";
import { LocationSchema } from "@schemas/location.schema";

export const LocationForm = (props: {
  locationData?: EditLocationInput | null;
  handleSubmit: (data: EditLocationInput) => void;
  isEntryLocation?: boolean;
}) => {
  const { locationData, handleSubmit, isEntryLocation } = props;
  const [fiNameDirty, setFiNameDirty] = useState(false);
  const initialValues = locationData || {
    location_name: "",
    is_entry_location: isEntryLocation || false,
    floor_number: 1,
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

  const handleNameChange = (value: string) => {
    setInput(locationForm, { path: ["trl_location_name_fi"], input: value });
  };

  return (
    <div>
      <Form
        of={locationForm}
        style={{ width: "100%" }}
        onSubmit={(data) => {
          handleSubmit(data);
        }}
        className="space-y-4"
      >
        <Field of={locationForm} path={["location_name"]}>
          {(field) => (
            <TextInput
              label="Internal name"
              {...field.props}
              input={field.input}
              required
              onChange={(event) => {
                field.onChange(event.target.value);
                if (!fiNameDirty && !locationData?.trl_location_name_fi) {
                  handleNameChange(event.target.value);
                }
              }}
              errors={field.errors}
            />
          )}
        </Field>
        <Field of={locationForm} path={["is_entry_location"]}>
          {(field) => (
            <div>
              <label className="ml-1">Is this an entry location?</label>
              <ToggleBox
                checked={field.input}
                {...field.props}
                onChecked={(checked) => {
                  if (isEntryLocation) return;
                  field.onChange(checked);
                }}
              >
                <span>{field.input ? "Yes" : "No"}</span>
              </ToggleBox>
              {field.errors && (
                <div className="text-red-500">{field.errors[0]}</div>
              )}
            </div>
          )}
        </Field>
        <Field of={locationForm} path={["floor_number"]}>
          {(field) => (
            <div className="flex flex-col gap-1">
              <label className="ml-1">Floor Number</label>
              <input
                type="number"
                {...field.props}
                value={Number(field.input)}
                min="1"
                max="3"
                className="border-border-grey w-50 bg-black p-2"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
              {field.errors && (
                <div className="text-red-500">{field.errors[0]}</div>
              )}
            </div>
          )}
        </Field>
        <Field of={locationForm} path={["trl_location_name_fi"]}>
          {(field) => {
            return (
              <TextInput
                label="Location name (fi)"
                {...field.props}
                input={field.input}
                onChange={(event) => {
                  field.onChange(event.target.value);
                  setFiNameDirty(true);
                }}
                required
                errors={field.errors}
              />
            );
          }}
        </Field>
        <Field of={locationForm} path={["trl_location_name_en"]}>
          {(field) => (
            <TextInput
              label="Location name (en)"
              {...field.props}
              input={field.input}
              onChange={(event) => field.onChange(event.target.value)}
              required
              errors={field.errors}
            />
          )}
        </Field>
        <Field of={locationForm} path={["trl_at_current_location_msg_fi"]}>
          {(field) => (
            <TextInput
              label="At location message (fi)"
              {...field.props}
              input={field.input}
              required
              errors={field.errors}
            />
          )}
        </Field>
        <Field of={locationForm} path={["trl_at_current_location_msg_en"]}>
          {(field) => (
            <TextInput
              label="At location message (en)"
              {...field.props}
              input={field.input}
              required
              errors={field.errors}
            />
          )}
        </Field>
        <Field of={locationForm} path={["imageFile"]}>
          {(field) => (
            <div className="flex flex-col gap-1">
              <label>Location Image (optional, JPEG or PNG)</label>
              <ImageDropBox
                onFileSelect={(file) => field.onChange(file)}
                imageUrl={locationData?.imageUrl || undefined}
              />
              {field.errors && (
                <div className="text-red-500">{field.errors[0]}</div>
              )}
            </div>
          )}
        </Field>
        <div className="flex justify-end my-5">
        <button
          type="submit"
          className="bg-lab-green-dark rounded cursor-pointer w-40 p-1"
        >
          Save Location
        </button>
        </div>
      </Form>
    </div>
  );
};
