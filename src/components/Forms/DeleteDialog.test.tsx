import { expect, test, vi } from "vitest";
import { renderWithQuery } from "test/render";
import { DeleteDialog } from "./DeleteDialog";

test("does not submit a surrounding form and exposes pending and error states", async () => {
  const onCancel = vi.fn();
  const onConfirm = vi.fn();
  const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
  const screen = await renderWithQuery(
    <form onSubmit={onSubmit}>
      <DeleteDialog
        itemName="Step 2"
        isPending
        error={new Error("Deletion failed")}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </form>,
  );

  const dialog = screen.getByRole("dialog", { name: "Confirm deletion" });
  await expect.element(dialog).toHaveAttribute("aria-modal", "true");
  await expect.element(dialog.getByText("Deletion failed")).toBeInTheDocument();
  await expect.element(dialog.getByRole("button", { name: "Cancel" })).toBeDisabled();
  await expect.element(dialog.getByRole("button", { name: "Deleting..." })).toBeDisabled();
  expect(onSubmit).not.toHaveBeenCalled();
  expect(onCancel).not.toHaveBeenCalled();
  expect(onConfirm).not.toHaveBeenCalled();
});

test("confirmation and cancellation use non-submitting buttons", async () => {
  const onCancel = vi.fn();
  const onConfirm = vi.fn();
  const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
  const screen = await renderWithQuery(
    <form onSubmit={onSubmit}>
      <DeleteDialog
        itemName="Step 2"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </form>,
  );

  await screen.getByRole("button", { name: "Cancel" }).click();
  await screen.getByRole("button", { name: "Delete" }).click();
  expect(onCancel).toHaveBeenCalledOnce();
  expect(onConfirm).toHaveBeenCalledOnce();
  expect(onSubmit).not.toHaveBeenCalled();
});
