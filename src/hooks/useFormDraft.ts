import { useCallback, useContext, useEffect, useRef } from "react";
import { type FormStore, useField } from "@formisch/react";
import { AuthContext } from "@auth/authContext";
import {
  serialiseDraftValues,
  type DraftKind,
  type DraftRoute,
  type SavedDraft,
  useDraftStore,
} from "@storage/drafts";
import type { SearchParams } from "@schemas/router.schema";

type DraftMetadata = {
  kind: DraftKind;
  label: string;
  route: DraftRoute;
  search: SearchParams;
};

export const useFormDraft = (metadata: DraftMetadata) => {
  const { userId } = useContext(AuthContext);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // keeping metadata in a ref so the delayed save callback has the latest values
  const metadataRef = useRef(metadata);
  // update the ref after metadata changes, without triggering a re-render of the component using this hook
  useEffect(() => {
    metadataRef.current = metadata;
  }, [metadata]);
  const saveDraft = useDraftStore((state) => state.saveDraft);
  const dismissDraft = useDraftStore((state) => state.dismissDraft);
  const draft = useDraftStore((state) =>
    userId ? state.draftsByUser[userId]?.[metadata.kind] : undefined,
  );

  const save = useCallback(
    (values: Record<string, unknown>) => {
      if (!userId) return;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        saveDraft(userId, {
          ...metadataRef.current,
          values: serialiseDraftValues(values),
          updatedAt: new Date().toISOString(),
        });
      }, 400);
    },
    [saveDraft, userId],
  );

  const dismiss = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (inputTimeoutRef.current) clearTimeout(inputTimeoutRef.current);
    if (userId) dismissDraft(userId, metadata.kind);
  }, [dismissDraft, metadata.kind, userId]);

  // Formisch updates field state after the native input event bubbles. Read it
  // on the next turn so the draft includes the character just entered.
  const saveAfterInput = useCallback(
    (readValues: () => Record<string, unknown>) => {
      if (inputTimeoutRef.current) clearTimeout(inputTimeoutRef.current);
      inputTimeoutRef.current = setTimeout(() => save(readValues()), 0);
    },
    [save],
  );

  // Clear any pending timeouts when the component using this hook unmounts
  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (inputTimeoutRef.current) clearTimeout(inputTimeoutRef.current);
    },
  );

  return { draft: draft as SavedDraft | undefined, save, saveAfterInput, dismiss };
};

export const FormDraftAutosaver = (props: {
  form: FormStore;
  save: (values: Record<string, unknown>) => void;
  mapValues?: (values: Record<string, unknown>) => Record<string, unknown>;
}) => {
  const { form, save, mapValues = (values) => values } = props;
  // Formisch v1's path types exclude the root path, but the runtime still
  // resolves [] to the root store. Unlike getInput, useField also installs the
  // React signal listener needed to re-render when any nested value changes.
  const rootField = useField(form, { path: [] as never });
  const values = rootField.input as Record<string, unknown>;
  const snapshot = JSON.stringify(values, (_key, value) =>
    value instanceof File ? undefined : value,
  );
  // Keep the latest values and mapValues function in refs so the effect below always has the latest values without needing to re-run the effect on every change.
  const valuesRef = useRef(values);
  const mapValuesRef = useRef(mapValues);
  useEffect(() => {
    valuesRef.current = values;
    mapValuesRef.current = mapValues;
  }, [mapValues, values]);

  // Save the form draft whenever the form values change
  useEffect(() => {
    if (form.isDirty) save(mapValuesRef.current(valuesRef.current));
  }, [form, save, snapshot]);

  return null;
};
