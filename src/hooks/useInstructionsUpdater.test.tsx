import type { EditStepInput } from "@schemas/step.schema";
import type { StepApiResponse } from "@apptypes/step";
import { beforeEach, describe, expect, test } from "vitest";
import { useLanguages } from "./useAppInit";
import { useInstructionsUpdater } from "./useInstructionsUpdater";
import {
  instructionRequests,
  resetInstructionMockData,
} from "test/handlers/instructions";
import {
  locationRequests,
  resetLocationMockData,
} from "test/handlers/locations";
import {
  resetTranslationMockData,
  translationRequests,
} from "test/handlers/translations";
import { renderWithQuery } from "test/render";

const initialOverlay = {
  image_key: "OVERLAY_LEFT",
  position_x_percent: 20,
  position_y_percent: 30,
  overlay_size: 25,
  rotation_deg: 0,
  rotation_x_deg: 0,
};

const initialData: EditStepInput = {
  trl_instruction_on_approach: [
    { lang: "fi", text: "Käänny vasemmalle" },
    { lang: "en", text: "" },
  ],
  trl_instruction_to_next: [
    { lang: "fi", text: "Jatka eteenpäin" },
    { lang: "en", text: "" },
  ],
  overlay_on_approach: initialOverlay,
  overlay_to_next: initialOverlay,
};

const updatedData: EditStepInput = {
  trl_instruction_on_approach: [
    { lang: "fi", text: "Käänny oikealle" },
    { lang: "en", text: "Turn right" },
  ],
  trl_instruction_to_next: [
    { lang: "fi", text: "" },
    { lang: "en", text: "" },
  ],
  image_on_approach_file: new File(["image"], "approach.png", {
    type: "image/png",
  }),
  existing_image_to_next_key: "MEDIA_STRAIGHT_AHEAD",
  overlay_on_approach: {
    ...initialOverlay,
    position_x_percent: 45,
    rotation_deg: 15,
  },
  overlay_to_next: undefined,
};

const stepData: StepApiResponse = {
  step: {
    path_step_id: 9,
    path_id: 4,
    location_id: 12,
    step_order: 2,
    distance_to_next_meters: 15,
    video_timestamp_seconds: 0,
    instructions: [
      {
        direction: "on_approach",
        img_key: "STEP_9_APPROACH_IMG",
        overlay_key: "STEP_9_APPROACH_OVERLAY",
        trl_instruction_key: "STEP_9_APPROACH",
        instructions: {
          image: { url: "", overlay: null },
          translation: "",
        },
      },
      {
        direction: "to_next",
        img_key: "STEP_9_NEXT_IMG",
        overlay_key: "STEP_9_NEXT_OVERLAY",
        trl_instruction_key: "STEP_9_NEXT",
        instructions: {
          image: { url: "", overlay: null },
          translation: "",
        },
      },
    ],
  },
};

const InstructionsUpdaterHarness = () => {
  const workflow = useInstructionsUpdater();
  const languages = useLanguages();

  return (
    <div>
      <button
        type="button"
        disabled={!languages.data}
        onClick={() =>
          void workflow.mutateAsync(updatedData, initialData, stepData)
        }
      >
        Save instructions
      </button>
      <output aria-label="Instruction update status">
        {workflow.error?.message ?? (workflow.data ? "saved" : "idle")}
      </output>
    </div>
  );
};

describe("useInstructionsUpdater", () => {
  beforeEach(() => {
    resetInstructionMockData();
    resetLocationMockData();
    resetTranslationMockData();
  });

  test("coordinates translation, image, and overlay changes for both directions", async () => {
    const screen = await renderWithQuery(<InstructionsUpdaterHarness />);
    const saveButton = screen.getByRole("button", {
      name: "Save instructions",
    });
    await expect.element(saveButton).toBeEnabled();
    await saveButton.click();

    await expect
      .element(screen.getByLabelText("Instruction update status"))
      .toHaveTextContent("saved");

    expect(translationRequests.updated).toEqual([
      {
        translationKey: "STEP_9_APPROACH",
        languageCode: "fi",
        textValue: "Käänny oikealle",
      },
    ]);
    expect(translationRequests.created).toEqual([
      {
        translation_key: "STEP_9_APPROACH",
        language_code: "en",
        type: "approach_instruction",
        text_value: "Turn right",
      },
    ]);
    expect(translationRequests.deleted).toEqual([
      { translationKey: "STEP_9_NEXT", languageCode: "fi" },
    ]);

    expect(instructionRequests.imageUploads).toEqual([
      {
        key: "STEP_9_APPROACH_IMG",
        type: "step",
        locationId: "12",
        fileName: "approach.png",
      },
    ]);
    expect(locationRequests.copiedImages).toEqual([
      {
        sourceKey: "MEDIA_STRAIGHT_AHEAD",
        key: "STEP_9_NEXT_IMG",
        type: "step",
        locationId: "12",
      },
    ]);
    expect(instructionRequests.overlayUpdates).toEqual([
      {
        overlayKey: "STEP_9_APPROACH_OVERLAY",
        overlay: updatedData.overlay_on_approach,
      },
    ]);
    expect(instructionRequests.deletedOverlayKeys).toEqual([
      "STEP_9_NEXT_OVERLAY",
    ]);
  });
});
