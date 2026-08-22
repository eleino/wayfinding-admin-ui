// form for creating and editing locations
import { Field, FieldArray, Form, useForm, handleSubmit, reset, setInput } from "@formisch/react";
import type { EditLocationInput } from "@schemas/location.schema";
import { TextInput } from "@components/Forms/TextInput";
import { ToggleBox } from "@components/Forms/ToggleBox";
import { ImageDropBox } from "@components/Forms/ImageDropBox";
import { createLocationSchema } from "@schemas/location.schema";
import type { AppInitLanguage } from "@apptypes/init";
import { useLocationImageLibrary } from "@hooks/useLocationImageLibrary";
import { FormDraftAutosaver, useFormDraft } from "@hooks/useFormDraft";
import { isDraftForRoute, type DraftRoute } from "@storage/drafts";
import type { SearchParams } from "@schemas/router.schema";
import { ConfirmDialog } from "@components/Forms/ConfirmDialog";
import { useEffect, useMemo, useRef, useState } from "react";

export const LocationForm = (props: {
  locationData?: EditLocationInput | null;
  submitForm: (data: EditLocationInput) => void;
  isEntryLocation?: boolean;
  languageList: AppInitLanguage[];
  locationId?: number;
  draftRoute: DraftRoute;
  draftSearch: SearchParams;
  onCancel: () => void;
  maxFloor: number;
}) => {
  const { locationData, submitForm, isEntryLocation, languageList, locationId, draftRoute, draftSearch, onCancel, maxFloor } = props;
  const imageLibrary = useLocationImageLibrary(locationId);
  const languageCodes = languageList.map((lang) => lang.code) || [];

  const mapLanguageCodeToName = (code: string) => {
    const language = languageList.find((lang) => lang.code === code);
    return language ? language.name : code;
  };

  const { draft, save, dismiss: dismissDraft } = useFormDraft({
    kind: "location",
    label: locationData ? `Edit location: ${locationData.location_name}` : "New location",
    route: draftRoute,
    search: draftSearch,
  });
  const baseInitialValues = locationData || {
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
  const [serverInitialValues] = useState(() => baseInitialValues);
  const draftValues = draft && isDraftForRoute(draft, draftRoute, draftSearch)
    ? draft.values
    : undefined;
  const restoredValues = useMemo(
    () =>
      draftValues
        ? { ...serverInitialValues, ...draftValues, imageFile: undefined }
        : serverInitialValues,
    [draftValues, serverInitialValues],
  );
  const locationForm = useForm({
    schema: useMemo(() => createLocationSchema(maxFloor), [maxFloor]),
    initialInput: serverInitialValues,
  });
  const hasRestoredDraft = useRef(false);

  // restore draft values if they exist and haven't been restored yet
  useEffect(() => {
    if (!draftValues || hasRestoredDraft.current) return;
    setInput(locationForm, { input: restoredValues });
    hasRestoredDraft.current = true;
  }, [draftValues, locationForm, restoredValues]);

  const [pendingAction, setPendingAction] = useState<"cancel" | "reset" | null>(null);

  const onSave = handleSubmit(locationForm, submitForm);

  const handleCancel = () => {
    if (locationForm.isDirty || draft) {
      setPendingAction("cancel");
      return;
    }
    dismissDraft();
    onCancel();
  };

  const handleReset = () => {
    setPendingAction("reset");
  };

  const confirmAction = () => {
    if (pendingAction === "cancel") {
      dismissDraft();
      onCancel();
      return;
    }
    reset(locationForm, { initialInput: serverInitialValues });
    dismissDraft();
    setPendingAction(null);
  };

  return (
    <div>
      <FormDraftAutosaver form={locationForm} save={save} />
      <Form
        of={locationForm}
        style={{ width: "100%" }}
        onSubmit={() => {
          if (locationForm.isValid) {
            onSave();
          }
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
                max={maxFloor}
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
        <div className="flex justify-end gap-2 my-5">
          <button type="button" className="border border-border-grey rounded cursor-pointer w-24 p-1" onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className="border border-border-grey rounded cursor-pointer w-24 p-1" onClick={handleReset}>
            Reset
          </button>
          <button
            type="button"
            className="bg-lab-green-dark rounded cursor-pointer w-40 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSave}
            disabled={!locationForm.isDirty}
          >
            Save Location
          </button>
        </div>
      </Form>
      {pendingAction && (
        <ConfirmDialog
          title={pendingAction === "cancel" ? "Discard location changes?" : "Reset location form?"}
          description={pendingAction === "cancel" ? "Your unsaved changes and saved draft will be removed." : "The form will return to its original values and the saved draft will be removed."}
          confirmLabel={pendingAction === "cancel" ? "Discard changes" : "Reset form"}
          onConfirm={confirmAction}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </div>
  );
};
