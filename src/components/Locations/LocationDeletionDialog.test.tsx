import { fireEvent, screen } from "@testing-library/react";
import { LocationDeletionDialog } from "./LocationDeletionDialog";
import type { LocationDeletionImpact } from "@apptypes/location";
import { renderWithQuery } from "test/render";

const impact: LocationDeletionImpact = {
  location: { location_id: 12, name: "Library" },
  can_delete_without_cascade: false,
  affected_paths: [{ path_id: 6, name: "To library", reason: "end_location" }],
  affected_path_steps: [],
  obsolete_resources: {
    images: [
      {
        image_key: "LOCATION_12_IMG",
        type: "location",
        file_path: "locations/12/location.png",
      },
    ],
    translations: [
      {
        translation_id: 1,
        translation_key: "LOCATION_12_NAME",
        language_code: "fi",
        type: "location_name",
        text_value: "Kirjasto",
      },
      {
        translation_id: 2,
        translation_key: "LOCATION_12_NAME",
        language_code: "en",
        type: "location_name",
        text_value: "Library",
      },
    ],
    overlays: [
      {
        image_overlay_id: 3,
        overlay_key: "FROM_11_TO_12",
        image_key: "OVERLAY_STRAIGHT_ARROW",
      },
    ],
  },
  missing_resource_keys: { images: [], translations: [], overlays: [] },
  cascade_counts: { organization_paths: 1, feedback: 0, metrics: 0 },
};

describe("LocationDeletionDialog", () => {
  it("lists the impact and requires an explicit destructive confirmation", async () => {
    const onConfirm = vi.fn();
    await renderWithQuery(
      <LocationDeletionDialog
        impact={impact}
        isLoading={false}
        error={null}
        isDeleting={false}
        deleteError={null}
        searchParams={{}}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText("To library")).toBeInTheDocument();
    expect(screen.getByText("LOCATION_12_IMG")).toBeInTheDocument();
    expect(screen.getByText("LOCATION_12_NAME")).toBeInTheDocument();
    expect(screen.getByText("FROM_11_TO_12")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", {
      name: "Delete location and 1 path",
    });
    const confirmCheckbox = screen.getByRole("checkbox", {
      name: "Yes, I want to delete this location and 1 path.",
    });

    expect(deleteButton).toBeDisabled();
    fireEvent.click(confirmCheckbox);
    expect(deleteButton).not.toBeDisabled();
    fireEvent.click(deleteButton);
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("disables confirmation while impact is loading", async () => {
    await renderWithQuery(
      <LocationDeletionDialog
        isLoading
        error={null}
        isDeleting={false}
        deleteError={null}
        searchParams={{}}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Delete location" }),
    ).toBeDisabled();
  });
});
