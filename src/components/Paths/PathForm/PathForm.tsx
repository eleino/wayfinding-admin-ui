import type { EditPathInput } from "@apptypes/path";
import { Field, Form, useForm, type FormStore } from "@formisch/react";
import { TextInput } from "@components/Forms/TextInput";
import { useGetOrganisations } from "@hooks/useOrganisations";
import { CreatePathSchema, EditPathSchema } from "@schemas/path.schema";
import { useLocation } from "@tanstack/react-router";
import { CreateStepList } from "./CreateStepList";

export const PathForm = (props: {
  pathData?: EditPathInput | null;
  handleSubmit: (updatedPathData: EditPathInput) => void;
}) => {
  const { search } = useLocation();
  const buildingId = search.buildingId;
  const { pathData, handleSubmit } = props;
  const isEditMode = !!pathData;
  const schema = isEditMode ? EditPathSchema : CreatePathSchema;
  const orgList = useGetOrganisations();
  const initialValues = pathData || {
    path_name: "",
    priority: 1,
    estimated_time_minutes: undefined,
    accessibility_level: 0,
    video_instruction_url: "",
    organizations: orgList ? orgList.data?.map(org => Number(org.id)) : [],
    steps: [],
  };
  const pathForm = useForm({
    schema,
    initialInput: initialValues,
  });
  if (!buildingId && !isEditMode) {
    return <p className="text-red-500">Error: You must select a building to create a new path.</p>;
  }
  if (!isEditMode && orgList.isLoading) {
    return <p>Loading organizations...</p>;
  }
  return (
    <div className="relative w-150 bg-sidebar-grey rounded p-2">
      <Form of={pathForm} onSubmit={(data) => {
        handleSubmit(data);
      }} className="space-y-4">
        <Field of={pathForm} path={['path_name']} >
          {(field) => (
            <TextInput label="Path name" {...field.props} input={field.input} required onChange={event => {
              field.onChange(event.target.value);
            }} errors={field.errors} />
          )}
        </Field>
        <Field of={pathForm} path={['priority']} >
          {(field) => (
            <div>
            <label className="ml-1">Priority</label>
            <input type="number" {...field.props} value={field.input} required onChange={event => {
              field.onChange(Number(event.target.value));
            }}/>
            {field.errors && <p className="text-red-500">{field.errors}</p>}
            </div>
          )}
        </Field>
          <Field of={pathForm} path={['estimated_time_minutes']} >
          {(field) => (
            <div>
            <label className="ml-1">Estimated time (minutes)</label>
            <input type="number" {...field.props} value={field.input || ""} onChange={event => {
              const value = event.target.value;
              field.onChange(value === "" ? undefined : Number(value));
            }}/>
            {field.errors && <p className="text-red-500">{field.errors}</p>}
            </div>
          )}
        </Field>
        <Field of={pathForm} path={['accessibility_level']} >
          {(field) => (
            <div>
            <label className="ml-1">Accessibility level</label>
            <input type="number" {...field.props} value={field.input} required onChange={event => {
              field.onChange(Number(event.target.value));
            }}/>
            {field.errors && <p className="text-red-500">{field.errors}</p>}
            </div>
          )}
        </Field>
        <Field of={pathForm} path={['video_instruction_url']} >
          {(field) => (
            <TextInput label="Video instruction URL" {...field.props} input={field.input} onChange={event => {
              field.onChange(event.target.value);
            }} errors={field.errors} />
          )}
        </Field>
        <Field of={pathForm} path={['organizations']} >
          {(field) => (
            <div>
              <label className="ml-1">Allowed organizations</label>
              {orgList.isLoading ? <p>Loading organizations...</p> :
              <div className="flex flex-col">
                {orgList.data?.map(org => (
                  <label key={org.id} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={org.id}
                      checked={field.input?.includes(Number(org.id)) || false}
                      onChange={event => {
                        const orgId = Number(event.target.value);
                        if (event.target.checked) {
                          field.onChange([...(field.input || []), orgId]);
                        } else {
                          field.onChange((field.input || []).filter(id => id !== orgId));
                        }
                      }}
                    />
                    <span className="ml-2">{orgList?.data?.find(orgData => Number(orgData.id) === Number(org.id))?.name || org.id}</span>
                  </label>
                ))}
              </div>}
              {field.errors && <p className="text-red-500">{field.errors}</p>}
            </div>
          )}
        </Field>
        {!isEditMode &&
        <CreateStepList form={pathForm as FormStore<typeof CreatePathSchema>} />}
        <button type="submit" className="px-4 py-2 bg-lab-blue text-white rounded absolute right-5 bottom-5">
          Save Path
        </button>
      </Form>
    </div>
  );
};
