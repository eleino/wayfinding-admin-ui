// form for creating and editing locations
import { Field, FieldArray, Form, useForm } from "@formisch/react";
import type { EditLocationInput } from "@schemas/location.schema";
import { TextInput } from "@components/Forms/TextInput";
import { ToggleBox } from "@components/Forms/ToggleBox";
import { ImageDropBox } from "@components/Forms/ImageDropBox";
import { LocationSchema } from "@schemas/location.schema";
import type { AppInitLanguage } from "@apptypes/init";
import { useLocationImageLibrary } from "@hooks/useLocationImageLibrary";

export const LocationForm = (props: {
  locationData?: EditLocationInput | null;
  handleSubmit: (data: EditLocationInput) => void;
  isEntryLocation?: boolean;
  languageList: AppInitLanguage[];
  locationId?: number;
}) => {
  const { locationData, handleSubmit, isEntryLocation, languageList, locationId } = props;
  const imageLibrary = useLocationImageLibrary(locationId);
  const languageCodes = languageList.map((lang) => lang.code) || [];

  const mapLanguageCodeToName = (code: string) => {
    const language = languageList.find((lang) => lang.code === code);
    return language ? language.name : code;
  };

  const initialValues = locationData || {
    location_name: "",
    is_entry_location: isEntryLocation || false,
    floor_number: 1,
    trl_location_name: languageCodes.map((code) => ({ lang: code, text: "" })),
    trl_at_current_location_msg: languageCodes.map((code) => ({
      lang: code,
      text: "",
    })),
    imageFile: undefined,
    existingImageKey: undefined,
    removeImage: false,
  };
  const locationForm = useForm({
    schema: LocationSchema,
    initialInput: initialValues,
    validate: "initial",
  });

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
        <FieldArray of={locationForm} path={["trl_location_name"]}>
          {(fieldArray) => (
            <div className="flex flex-col gap-1">
              <label>Location Name Translations</label>
              {fieldArray.items.map((item, index) => (
                <div key={item}>
                  <Field
                    of={locationForm}
                    path={["trl_location_name", index, "lang"]}
                  >
                    {(langField) => (
                      <Field
                        of={locationForm}
                        path={["trl_location_name", index, "text"]}
                      >
                        {(textField) => (
                          <TextInput
                            key={index}
                            label={mapLanguageCodeToName(
                              langField.input ? langField.input : "",
                            )}
                            input={textField.input}
                            {...textField.props}
                            onChange={(event) =>
                              textField.onChange(event.target.value)
                            }
                            name={`trl_location_name_${langField.input}`}
                            errors={textField.errors}
                          />
                        )}
                      </Field>
                    )}
                  </Field>
                </div>
              ))}
            </div>
          )}
        </FieldArray>
        <FieldArray of={locationForm} path={["trl_at_current_location_msg"]}>
          {(fieldArray) => (
            <div className="flex flex-col gap-1">
              <label>At Current Location Message Translations</label>
              {fieldArray.items.map((item, index) => (
                <div key={item}>
                  <Field
                    of={locationForm}
                    path={["trl_at_current_location_msg", index, "lang"]}
                  >
                    {(langField) => (
                      <Field
                        of={locationForm}
                        path={["trl_at_current_location_msg", index, "text"]}
                      >
                        {(textField) => (
                          <TextInput
                            key={index}
                            label={mapLanguageCodeToName(
                              langField.input ? langField.input : "",
                            )}
                            input={textField.input}
                            {...textField.props}
                            onChange={(event) =>
                              textField.onChange(event.target.value)
                            }
                            name={`trl_at_current_location_msg_${langField.input}`}
                            errors={fieldArray.errors}
                          />
                        )}
                      </Field>
                    )}
                  </Field>
                </div>
              ))}
            </div>
          )}
        </FieldArray>
        <Field of={locationForm} path={["imageFile"]}>
          {(imageField) => (
            <Field of={locationForm} path={["removeImage"]}>
              {(removeImageField) => (
                <Field of={locationForm} path={["existingImageKey"]}>
                  {(existingImageField) => (
                    <div className="flex flex-col gap-1">
                      <label>Location Image (optional, JPEG or PNG)</label>
                      <ImageDropBox
                        onFileSelect={(file) => {
                          imageField.onChange(file);
                          if (file) removeImageField.onChange(false);
                        }}
                        onExistingImageSelect={(image) => {
                          existingImageField.onChange(image?.key);
                          if (image) {
                            imageField.onChange(undefined);
                            removeImageField.onChange(false);
                          }
                        }}
                        existingImageGroups={imageLibrary.groups}
                        existingImagesLoading={imageLibrary.isLoading}
                        existingImagesError={imageLibrary.error}
                        onExistingImageRemove={() =>
                          removeImageField.onChange(true)
                        }
                        imageUrl={locationData?.imageUrl || undefined}
                      />
                      {imageField.errors && (
                        <div className="text-red-500">
                          {imageField.errors[0]}
                        </div>
                      )}
                    </div>
                  )}
                </Field>
              )}
            </Field>
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
