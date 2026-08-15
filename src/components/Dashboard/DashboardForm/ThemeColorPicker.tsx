import { useId, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { FormError, inputClassName } from "./shared";

export const ThemeColorPicker = ({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) => {
  const pickerId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const hasCustomColor = !!value;

  return (
    <div className="rounded border border-border-grey bg-black/30 p-3">
      <p className="block text-sm font-medium">
        {label}
      </p>
      <div className="mt-2 flex min-h-10 items-center gap-3">
        {hasCustomColor ? (
          <>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={pickerId}
              onClick={() => setIsOpen((open) => !open)}
              className="flex cursor-pointer items-center gap-3 rounded border border-border-grey px-2 py-1.5 hover:border-lab-turquoise"
            >
              <span
                aria-hidden="true"
                className="h-7 w-10 rounded border border-white/40"
                style={{ backgroundColor: value }}
              />
              <span className="font-mono text-sm text-gray-300">{value}</span>
              <span className="text-xs text-lab-turquoise">
                {isOpen ? "Close picker" : "Edit color"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onChange("");
              }}
              className="ml-auto cursor-pointer rounded border border-border-grey px-2 py-1 text-xs hover:border-red-400 hover:text-red-300"
            >
              Remove color
            </button>
          </>
        ) : (
          <button
            type="button"
            aria-controls={pickerId}
            onClick={() => {
              onChange("#000000");
              setIsOpen(true);
            }}
            className="cursor-pointer rounded border border-lab-turquoise px-3 py-1.5 text-sm text-lab-turquoise hover:bg-lab-turquoise/10"
          >
            Set custom color
          </button>
        )}
      </div>
      {hasCustomColor && isOpen && (
        <div
          id={pickerId}
          role="group"
          aria-label={`${label} picker`}
          className="mt-3 max-w-64 rounded border border-border-grey bg-black p-3"
        >
          <HexColorPicker
            color={value}
            onChange={onChange}
            style={{ width: "100%", height: "180px" }}
          />
          <label
            htmlFor={`${pickerId}-hex`}
            className="mt-3 block text-xs font-medium text-gray-300"
          >
            Hex value
            <HexColorInput
              id={`${pickerId}-hex`}
              color={value}
              onChange={onChange}
              prefixed
              aria-label={`${label} hex value`}
              className={inputClassName}
            />
          </label>
        </div>
      )}
      <FormError message={error} />
    </div>
  );
};