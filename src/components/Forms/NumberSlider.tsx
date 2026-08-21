export const NumberSlider = (props: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  range?: { min: number; max: number };
  orientation?: string; // e.g. "horizontal-tb", "vertical-lr", "vertical-rl", "sideways-lr", "sideways-rl"
}) => {
  const {
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    range,
    orientation = "horizontal-tb",
  } = props;

  const currentMin = range?.min ?? min;
  const currentMax = range?.max ?? max;
  const isVertical = orientation.startsWith("vertical");
  const mediumVerticalWritingClass =
    orientation === "vertical-rl"
      ? "md:writing-vertical-rl"
      : "md:writing-vertical-lr";
  
  const adjustValues = (change: number) => {
    const newValue = Number(value) + change;
    if (newValue >= currentMin && newValue <= currentMax) {
      onChange(newValue);
    }
  }

  const buttonClass = `
    flex items-center justify-center 
    w-5 h-5 rounded border border-lab-blue cursor-pointer
    text-lab-turquoise hover:bg-lab-turquoise hover:text-white 
    transition-colors disabled:opacity-30 disabled:hover:bg-transparent 
    disabled:hover:text-lab-turquoise disabled:cursor-default aspect-square
  `;
  return (
    <div
      className={`flex flex-col gap-1 text-center ${isVertical ? `w-12 items-center h-full md:w-auto ${mediumVerticalWritingClass}` : ""}`}
    >
      <label
        className={`text-sm text-gray-300 ${isVertical ? `w-full text-xs leading-tight writing-horizontal-tb md:w-auto md:text-sm ${mediumVerticalWritingClass}` : `writing-${orientation}`}`}
      >
        {label}
      </label>
      <div
        className={`flex items-center font-bold ${isVertical ? `h-auto md:h-full flex-col md:flex-row ${mediumVerticalWritingClass}` : `writing-${orientation}`}`}
      >
        <button
          className={buttonClass}
          onClick={() => adjustValues(-1)}
          disabled={value <= currentMin}
          type="button"
        >
          <span className="writing-horizontal-tb">−</span>
        </button>
        <input
          type="range"
          min={currentMin}
          max={currentMax}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={isVertical ? `h-18 w-5 writing-${orientation} md:h-full md:w-full` : `w-full writing-${orientation}`}
        />
        <button
          className={buttonClass}
          onClick={() => adjustValues(1)}
          disabled={value >= currentMax}
          type="button"
        >
          <span className="">+</span>
        </button>
      </div>
      <div
        className={`text-sm text-lab-turquoise bg-lab-turquoise/10 px-2 pt-0.5 rounded writing-horizontal-tb self-center w-12 min-w-12`}
      >
        {value}
      </div>
    </div>
  );
};
