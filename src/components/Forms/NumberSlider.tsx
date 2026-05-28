
export const NumberSlider = (props: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  range?: { min: number; max: number };
  orientation?: string; // e.g. "horizontal-tb", "vertical-lr", "vertical-rl", "sideways-lr", "sideways-rl"
}) => {
  const { label, value, onChange, min = 0, max = 100, range, orientation = "horizontal-tb" } = props;

  return (
    <div className="flex flex-col gap-1 text-center">
      <label className={`text-sm text-gray-300 writing-${orientation}`}>{label}</label>
      <div className={`flex items-center gap-1 writing-${orientation}`}>
        <span className="text-lg font-bold text-lab-turquoise cursor-pointer ml-1 mb-1" onClick={() => {if (value > (range?.min ?? min)) onChange(value - 1)}}>
          -
        </span>
      <input
        type="range"
        min={range?.min ?? min}
        max={range?.max ?? max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full writing-${orientation}`}
      /><span className="text-lg font-bold text-lab-turquoise cursor-pointer" onClick={() => {if (value < (range?.max ?? max)) onChange(value + 1)}}>
          +
        </span></div>
      <span className={`text-sm text-gray-300 writing-horizontal-tb self-center`}>{value}</span>
    </div>
  );
}