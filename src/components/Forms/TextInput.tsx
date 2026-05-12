import type { FieldElementProps } from "@formisch/react";
import { normalizeString } from "@utils/normalizeString";

interface TextInputProps extends FieldElementProps {
  label?: string;
  input: string | undefined;
  errors: [string, ...string[]] | null;
  required?: boolean;
  placeholder?: string;
  name: string;
}

export const TextInput = ({ ...props }: TextInputProps) => {
  const { name, required, label, input, errors } = props;
  return (
    <div className="mb-4 w-full">
      <label htmlFor={normalizeString(name)} className="block mb-1 ml-1 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        {...props}
        name={normalizeString(name)}
        value={input}
        required={required}
        aria-invalid={!!errors}
        aria-errormessage={`${normalizeString(name)}-error`}
        className="w-120 p-2 border border-border-grey rounded bg-black"
      />
      {errors && <div className="text-red-500">{errors[0]}</div>}
    </div>
  );
};
