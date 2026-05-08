import { CreatePathSchema } from "@schemas/path.schema";
import type { FormStore } from "@formisch/react";
import { Field } from "@formisch/react";
import type { ListLocation } from "@apptypes/location";

type CreateStepProps = {
    form: FormStore<typeof CreatePathSchema>;
    stepIndex: number;
    locationList: ListLocation[] | undefined;
};
export const CreateStep = (props: CreateStepProps) => {
    const { form, stepIndex, locationList } = props;
    return (
        <div>
            <Field of={form} path={['steps', stepIndex, 'step_order']}>
                {(field) => {
                    if (field.input !== stepIndex + 1) {
                        field.onChange(stepIndex + 1);
                    }
                    return (
                    <div>Step {field.input}</div>
                )}}
            </Field>
            <Field of={form} path={['steps', stepIndex, 'location_id']}>
                {(field) => (
                    <div>
                        <label className="ml-1">Location</label>
                        {locationList ?
                            <select {...field.props} value={field.input} required onChange={event => {
                            field.onChange(Number(event.target.value));
                        }}>
                            <option value="">Select a location</option>
                            {locationList.map(location => (
                                <option key={location.id} value={location.id}>{location.name}</option>
                            ))}
                        </select> : <p className="text-red-500">Could not load locations.</p>}
                        {field.errors && <p className="text-red-500">{field.errors}</p>}
                    </div>
                )}
            </Field>
            <Field of={form} path={['steps', stepIndex, 'distance_to_next_meters']}>
                {(field) => (
                    <div>
                        <label className="ml-1">Distance to next step (meters)</label>
                        <input type="number" {...field.props} value={field.input} required min="0" onChange={event => {
                            field.onChange(Number(event.target.value));
                        }}/>
                        {field.errors && <p className="text-red-500">{field.errors}</p>}
                    </div>
                )}
            </Field>
            <Field of={form} path={['steps', stepIndex, 'video_timestamp_seconds']}>
                {(field) => (
                    <div>
                        <label className="ml-1">Video timestamp (seconds, optional)</label>
                        <input type="number" {...field.props} value={field.input || ''} min="0" onChange={event => {
                            const value = event.target.value;
                            field.onChange(value === '' ? undefined : Number(value));
                        }}/>
                        {field.errors && <p className="text-red-500">{field.errors}</p>}
                    </div>
                )}
            </Field>
        </div>
    );
};