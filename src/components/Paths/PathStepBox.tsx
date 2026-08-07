import type { PathStep } from "@apptypes/path";
import type {
  StepInstructionImage,
  StepInstructionsItem,
} from "@apptypes/step";

export interface LocalizedStepInstructions {
  languageCode: string;
  step: StepInstructionsItem;
}

export interface InstructionOverride {
  image: StepInstructionImage | null;
  translations: Array<{
    languageCode: string;
    text: string;
  }>;
}

const InstructionImage = ({
  image,
  alt,
}: {
  image: StepInstructionImage;
  alt: string;
}) => (
  <div
    className="relative mt-3 h-auto w-full rounded-lg border border-border-grey bg-black/30"
    data-testid="instruction-image-container"
  >
    <img
      src={image.url}
      alt={alt}
      className="relative left-0 top-0 h-auto w-full rounded-lg object-contain"
    />
    {image.overlay && (
      <img
        src={image.overlay.overlay_image_url}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute"
        data-testid="instruction-overlay"
        style={{
          top: "50%",
          left: "50%",
          width: `${image.overlay.overlay_size}%`,
          height: "auto",
          transform: `translate(${image.overlay.position_x_percent}%, ${image.overlay.position_y_percent}%) perspective(6cm) rotateX(${image.overlay.rotation_x_deg}deg) rotate(${image.overlay.rotation_deg}deg)`,
          zIndex: 100,
        }}
      />
    )}
  </div>
);

const InstructionPreview = ({
  title,
  direction,
  instructions,
  instructionOverride,
}: {
  title: string;
  direction: "on_approach" | "to_next";
  instructions: LocalizedStepInstructions[];
  instructionOverride?: InstructionOverride;
}) => {
  const baseInstruction = instructions[0]?.step;
  const translationKey =
    direction === "on_approach"
      ? baseInstruction?.trl_instruction_on_approach_key
      : baseInstruction?.trl_instruction_to_next_key;
  const image = instructionOverride
    ? instructionOverride.image
    : direction === "on_approach"
      ? baseInstruction?.img_on_approach
      : baseInstruction?.img_to_next;
  const translations = instructionOverride
    ? instructionOverride.translations
    : instructions
        .map(({ languageCode, step }) => ({
          languageCode,
          text:
            step.translations[languageCode]?.find(
              (translation) => translation.translation_key === translationKey,
            )?.text_value ?? "",
        }))
        .filter((translation) => translation.text);

  return (
    <div className="rounded-lg border border-border-grey bg-black/20 p-6">
      <h4 className="font-semibold text-lab-turquoise">{title}</h4>
      {translations.length > 0 ? (
        <div className="mt-2 space-y-2">
          {translations.map(({ languageCode, text }) => (
            <p key={languageCode} className="text-sm text-gray-200">
              <span className="mr-2 font-semibold uppercase text-gray-400">
                {languageCode}
              </span>
              {text}
            </p>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-gray-400">No instruction text.</p>
      )}
      {image ? (
        <InstructionImage image={image} alt={`${title} instruction`} />
      ) : (
        <p className="mt-3 text-sm text-gray-500">No instruction image.</p>
      )}
    </div>
  );
};

export const PathStepBox = ({
  step,
  instructions,
  onApproachOverride,
}: {
  step: PathStep;
  instructions: LocalizedStepInstructions[];
  onApproachOverride?: InstructionOverride;
}) => (
  <article className="rounded-xl border border-border-grey bg-sidebar-grey p-5 shadow">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lab-blue font-bold">
          {step.order}
        </span>
        <div>
          <h3 className="font-semibold text-white">{step.name}</h3>
          <p className="text-sm text-gray-400">Location #{step.location_id}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-gray-300">
        <span className="rounded-full bg-black/40 px-3 py-1">
          {step.distance_to_next_meters} m to next
        </span>
        <span className="rounded-full bg-black/40 px-3 py-1">
          Video at {step.video_timestamp_seconds} s
        </span>
      </div>
    </div>

    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <InstructionPreview
        title="On approach"
        direction="on_approach"
        instructions={instructions}
        instructionOverride={onApproachOverride}
      />
      <InstructionPreview
        title="To next step"
        direction="to_next"
        instructions={instructions}
      />
    </div>
  </article>
);
