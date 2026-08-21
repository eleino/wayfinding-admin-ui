import type { FieldElementProps } from "@formisch/react";
import { normalizeString } from "@utils/normalizeString";

interface TextInputProps extends FieldElementProps {
  label?: string;
  input: string | undefined;
  errors: [string, ...string[]] | null;
  required?: boolean;
  placeholder?: string;
  name: string;
  containerClassName?: string;
  inputClassName?: string;
}

export const TextInput = ({
  name,
  required,
  label,
  input,
  errors,
  containerClassName = "mb-4 w-full",
  inputClassName = "w-full max-w-120 rounded border border-border-grey bg-black p-2",
  ...fieldProps
}: TextInputProps) => {
  const normalizedName = normalizeString(name);

  return (
    <div className={containerClassName}>
      <label htmlFor={normalizedName} className="mb-1 ml-1 block font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        {...fieldProps}
        id={normalizedName}
        name={normalizedName}
        value={input ?? ""}
        required={required}
        aria-invalid={!!errors}
        aria-errormessage={errors ? `${normalizedName}-error` : undefined}
        className={inputClassName}
      />
      {errors && (
        <div id={`${normalizedName}-error`} className="text-red-500" role="alert">
          {errors[0]}
        </div>
      )}
    </div>
  );
};
