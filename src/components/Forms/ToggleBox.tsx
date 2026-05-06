import type { FieldElementProps } from "@formisch/react";
import { normalizeString } from "@utils/normalizeString";

interface ToggleBoxProps extends FieldElementProps {
    checked: boolean | undefined;
    onChecked: (checked: boolean) => void;
    children?: React.ReactNode;
}
/**
 * Checkbox in toggle form
 * @param checked - is the toggle on or off
 * @param onChecked - callback when toggle is changed, returns the new value
 * @param children - optional label to be shown next to the toggle
 * @param props - additional props for the input element (ie. field.props from formisch)
 */
export const ToggleBox = ({ checked, onChecked, children, ...props }: ToggleBoxProps) => {

    const handleToggle = () => {
        onChecked(!checked);
    };
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor={normalizeString(props.name)} className="flex rounded-xl items-center cursor-pointer focus-within:ring-2 focus-within:ring-lab-blue">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChecked(e.target.checked)}
        className="sr-only"
        aria-label={normalizeString(props.name)}
        aria-checked={checked}
      />
      <span className={`w-10 h-5 rounded-xl relative border border-border-grey cursor-pointer ${checked ? 'bg-lab-turquoise' : 'bg-black'}`}
      onClick={handleToggle}>
        <span className={`h-3.5 w-3.5 mx-1 top-1/2 -translate-y-1/2 rounded-full absolute bg-white transition-all duration-300 ${checked ? 'right-0' : 'left-0'}`}></span>
    </span>
    </label>
    {children}
    </div>
  );
};