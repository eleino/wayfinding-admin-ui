import type { PathApiResponse } from "@apptypes/path";
import type { EditPathInput } from "@schemas/path.schema";
import { Field, Form, useForm, type FormStore, getInput, reset, setInput } from "@formisch/react";
import { TextInput } from "@components/Forms/TextInput";
import { useGetOrganisations } from "@hooks/useOrganisations";
import { CreatePathSchema, EditPathSchema } from "@schemas/path.schema";
import { useLocation } from "@tanstack/react-router";
import { CreateStepList } from "./CreateStepList";
import { EditStepList } from "./EditStepList";
import { FormDraftAutosaver, useFormDraft } from "@hooks/useFormDraft";
import { isDraftForRoute } from "@storage/drafts";
import type { SearchParams } from "@schemas/router.schema";
import { ConfirmDialog } from "@components/Forms/ConfirmDialog";
import { useEffect, useMemo, useRef, useState } from "react";

export const PathForm = (props: {
  pathData?: PathApiResponse | null;
  handleSubmit: (updatedPathData: EditPathInput) => void;
  pathError?: Error | null;
  onCancel: () => void;
}) => {
  const { search } = useLocation();
  const buildingId = search.buildingId;
  const { pathData, handleSubmit, pathError, onCancel } = props;
  const isEditMode = !!pathData;
  const schema = isEditMode ? EditPathSchema : CreatePathSchema;
  const orgList = useGetOrganisations();
  const draftRoute = isEditMode ? "/paths/edit" : "/paths/new";
  const draftSearch = { ...search, stepId: undefined } as SearchParams;
  const { draft, save, saveAfterInput, dismiss: dismissDraft } = useFormDraft({
    kind: "path",
    label: pathData ? `Edit path: ${pathData.path.name}` : "New path",
    route: draftRoute,
    search: draftSearch,
  });
  const baseInitialValues = {
    path_name: pathData?.path.name || "",
    priority: pathData?.path.priority || 0,
    estimated_time_minutes: pathData?.path.estimated_time_minutes || 0,
    accessibility_level: pathData?.path.accessibility_level || 0,
    video_instruction_url: pathData?.path.video_instruction_url || "",
    elevated_priority_starts_at: pathData?.path.elevated_priority_starts_at
      ? new Date(pathData.path.elevated_priority_starts_at)
      : undefined,
    elevated_priority_expires_at: pathData?.path.elevated_priority_expires_at
      ? new Date(pathData.path.elevated_priority_expires_at)
      : undefined,
    organizations: pathData?.path.allowed_organizations
      ? pathData?.path.allowed_organizations.map((org) =>
          Number(org.organization_id),
        )
      : orgList.data
        ? orgList.data?.map((org) => Number(org.id))
        : [],
    steps: [], // always initially empty in Create mode, handled separately in Edit mode
  };
  const [serverInitialValues] = useState(() => baseInitialValues);
  const savedDetails = draft && isDraftForRoute(draft, draftRoute, draftSearch)
    ? (draft.values.details as Partial<typeof baseInitialValues> | undefined)
    : undefined;
  const restoredValues = useMemo(
    () =>
      savedDetails
        ? {
            ...serverInitialValues,
            ...savedDetails,
            elevated_priority_starts_at: savedDetails.elevated_priority_starts_at
              ? new Date(savedDetails.elevated_priority_starts_at)
              : undefined,
            elevated_priority_expires_at: savedDetails.elevated_priority_expires_at
              ? new Date(savedDetails.elevated_priority_expires_at)
              : undefined,
          }
        : serverInitialValues,
    [savedDetails, serverInitialValues],
  );
  const pathForm = useForm({
    schema,
    initialInput: serverInitialValues,
  });
  const hasRestoredDraft = useRef(false);
  useEffect(() => {
    if (!savedDetails || hasRestoredDraft.current) return;
    setInput(pathForm, { input: restoredValues as never });
    hasRestoredDraft.current = true;
  }, [pathForm, restoredValues, savedDetails]);
  const [pendingAction, setPendingAction] = useState<"cancel" | "reset" | null>(null);
  const readCurrentDraft = () => ({
    ...(draft?.values ?? {}),
    details: getInput(pathForm),
  });
  const saveCurrentDraft = () => saveAfterInput(readCurrentDraft);
  const handleCancel = () => {
    if (pathForm.isDirty || draft) {
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
    reset(pathForm, { initialInput: serverInitialValues });
    dismissDraft();
    setPendingAction(null);
  };
  if (!buildingId && !isEditMode) {
    return (
      <p className="text-red-500">
        Error: You must select a building to create a new path.
      </p>
    );
  }
  if (!isEditMode && orgList.isLoading) {
    return <p>Loading organizations...</p>;
  }
  return (
    <div className="relative w-200 bg-sidebar-grey rounded p-2 pb-10">
      <FormDraftAutosaver form={pathForm} save={save} mapValues={readCurrentDraft} />
      <Form
        of={pathForm}
        onSubmit={(data) => {
          if (!pathForm.isDirty) return; // no changes, nothing to submit. maybe add an alertdialog here
          handleSubmit(data);
        }}
        className="space-y-4"
      >
        <Field of={pathForm} path={["path_name"]}>
          {(field) => (
            <TextInput
              label="Path name"
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
        <div className="flex flex-row gap-10 py-2">
          <div>
            <Field of={pathForm} path={["priority"]}>
              {(field) => (
                <div className="flex flex-col">
                  <label className="ml-1">
                    Priority<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...field.props}
                    value={field.input}
                    required
                    onChange={(event) => {
                      field.onChange(Number(event.target.value));
                    }}
                    className="ml-1 w-30 pl-2 p-1 border border-border-grey rounded bg-black"
                  />
                  {field.errors && (
                    <p className="text-red-500">{field.errors}</p>
                  )}
                </div>
              )}
            </Field>
            <Field of={pathForm} path={["estimated_time_minutes"]}>
              {(field) => (
                <div className="flex flex-col">
                  <label className="ml-1">
                    Estimated time (minutes){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...field.props}
                    value={field.input || ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    required
                    className="ml-1 w-30 pl-2 p-1 border border-border-grey rounded bg-black"
                  />
                  {field.errors && (
                    <p className="text-red-500">{field.errors}</p>
                  )}
                </div>
              )}
            </Field>
            <Field of={pathForm} path={["accessibility_level"]}>
              {(field) => (
                <div className="flex flex-row gap-2">
                  <div className="flex flex-col">
                    <label className="ml-1">
                      Accessibility level 
                      <span className="text-red-500 pl-1">*</span>
                    </label>
                    <input
                      type="number"
                      {...field.props}
                      value={field.input}
                      min={0}
                      max={2}
                      required
                      onChange={(event) => {
                        field.onChange(Number(event.target.value));
                      }}
                      className="ml-1 w-30 pl-2 p-1 border border-border-grey rounded bg-black"
                    />
                    {field.errors && (
                      <p className="text-red-500">{field.errors}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-400 w-0 whitespace-nowrap">
                    0 = no special accessibility<br />
                    1 = accessible; only shown to users with accessibility needs<br />
                    2 = available to everyone (including users with accessibility needs)
                  </span>
                </div>
              )}
            </Field>
          </div>
          <div className="">
            <Field of={pathForm} path={["organizations"]}>
              {(field) => (
                <div>
                  <label className="ml-1">Allowed organizations</label>
                  {orgList.isLoading ? (
                    <p>Loading organizations...</p>
                  ) : (
                    <div className="flex flex-col ml-4">
                      {orgList.data?.map((org) => (
                        <label
                          key={org.id}
                          className="inline-flex items-center"
                        >
                          <input
                            type="checkbox"
                            value={org.id}
                            checked={
                              field.input?.includes(Number(org.id)) || false
                            }
                            onChange={(event) => {
                              const orgId = Number(event.target.value);
                              if (event.target.checked) {
                                field.onChange([...(field.input || []), orgId]);
                              } else {
                                field.onChange(
                                  (field.input || []).filter(
                                    (id) => id !== orgId,
                                  ),
                                );
                              }
                            }}
                          />
                          <span className="ml-2">
                            {orgList?.data?.find(
                              (orgData) =>
                                Number(orgData.id) === Number(org.id),
                            )?.name || org.id}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                  {field.errors && (
                    <p className="text-red-500">{field.errors}</p>
                  )}
                </div>
              )}
            </Field>
          </div>
        </div>
        <Field of={pathForm} path={["video_instruction_url"]}>
          {(field) => (
            <TextInput
              label="Video instruction URL"
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
        {isEditMode && (
          <div className="flex flex-col gap-4">
            <Field of={pathForm} path={["elevated_priority_starts_at"]}>
              {(field) => (
                <div className="flex flex-col">
                  <label className="ml-1">Elevated priority starts at</label>
                  <input
                    type="date"
                    {...field.props}
                    value={
                      field.input
                        ? new Date(field.input).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(
                        value === "" ? undefined : new Date(value),
                      );
                    }}
                    className="ml-1 w-50 pl-2 p-1 border border-border-grey rounded bg-black"
                  />
                  {field.errors && (
                    <p className="text-red-500">{field.errors}</p>
                  )}
                </div>
              )}
            </Field>
            <Field of={pathForm} path={["elevated_priority_expires_at"]}>
              {(field) => (
                <div className="flex flex-col">
                  <label className="ml-1">Elevated priority expires at</label>
                  <input
                    type="date"
                    {...field.props}
                    value={
                      field.input
                        ? new Date(field.input).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(
                        value === "" ? undefined : new Date(value),
                      );
                    }}
                    className="ml-1 w-50 pl-2 p-1 border border-border-grey rounded bg-black"
                  />
                  {field.errors && (
                    <p className="text-red-500">{field.errors}</p>
                  )}
                </div>
              )}
            </Field>
            {/* path name translations are not currently used
        <Field of={pathForm} path={['trl_path_name_fi']} >
          {(field) => (
            <TextInput label="Path name (fi)" {...field.props} input={field.input} required onChange={event => {
              field.onChange(event.target.value);
            }} errors={field.errors} />
          )}
        </Field>
        <Field of={pathForm} path={['trl_path_name_en']} >
          {(field) => (
            <TextInput label="Path name (en)" {...field.props} input={field.input} required onChange={event => {
              field.onChange(event.target.value);
            }} errors={field.errors} />
          )}
        </Field> */}
          </div>
        )}

        {!isEditMode && (
          <CreateStepList
            form={pathForm as FormStore<typeof CreatePathSchema>}
            onDraftChange={saveCurrentDraft}
          />
        )}
        <div className={`flex gap-2 ${isEditMode ? "mt-4 justify-end" : "absolute right-5 bottom-5"}`}>
          <button type="button" className="px-4 py-2 border border-border-grey rounded cursor-pointer" onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className="px-4 py-2 border border-border-grey rounded enabled:cursor-pointer disabled:opacity-50" onClick={handleReset} disabled={!pathForm.isDirty}>
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-lab-green-dark text-white rounded enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!pathForm.isDirty || !pathForm.isValid}
          >
            Save Path
          </button>
        </div>
        {pathError && <p className="text-red-500">{pathError.message}</p>}
      </Form>
      {isEditMode && <EditStepList pathData={pathData} />}
      {pendingAction && (
        <ConfirmDialog
          title={pendingAction === "cancel" ? "Discard path changes?" : "Reset path form?"}
          description={pendingAction === "cancel" ? "Your unsaved changes and saved path draft will be removed." : "The form will return to its original values and the saved draft will be removed."}
          confirmLabel={pendingAction === "cancel" ? "Discard changes" : "Reset form"}
          onConfirm={confirmAction}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </div>
  );
};
