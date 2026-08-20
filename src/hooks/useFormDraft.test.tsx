import { Field, Form, setInput, useForm } from "@formisch/react";
import { render } from "vitest-browser-react";
import { describe, expect, test, vi } from "vitest";
import * as v from "valibot";
import { FormDraftAutosaver } from "./useFormDraft";

const DraftSchema = v.object({ name: v.string() });

describe("FormDraftAutosaver", () => {
  test("saves after a nested form value changes", async () => {
    const save = vi.fn();

    const TestForm = () => {
      const form = useForm({
        schema: DraftSchema,
        initialInput: { name: "Initial" },
      });

      return (
        <Form of={form} onSubmit={() => undefined}>
          <FormDraftAutosaver form={form} save={save} />
          <Field of={form} path={["name"]}>
            {(field) => <input aria-label="Name" {...field.props} value={field.input} />}
          </Field>
          <button
            type="button"
            onClick={() => setInput(form, { path: ["name"], input: "Updated" })}
          >
            Update name
          </button>
        </Form>
      );
    };

    const screen = await render(<TestForm />);
    await screen.getByRole("button", { name: "Update name" }).click();

    await vi.waitFor(() => {
      expect(save).toHaveBeenCalledWith({ name: "Updated" });
    });
  });
});
