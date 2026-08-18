import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SearchParams } from "@schemas/router.schema";

export type DraftKind = "location" | "path" | "step-instruction";

export type DraftRoute =
  | "/locations/new"
  | "/locations/edit"
  | "/paths/new"
  | "/paths/edit";

export interface SavedDraft {
  kind: DraftKind;
  label: string;
  route: DraftRoute;
  search: SearchParams;
  values: Record<string, unknown>;
  updatedAt: string;
}

interface DraftState {
  draftsByUser: Record<string, Partial<Record<DraftKind, SavedDraft>>>;
  saveDraft: (userId: number, draft: SavedDraft) => void;
  dismissDraft: (userId: number, kind: DraftKind) => void;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      draftsByUser: {},
      saveDraft: (userId, draft) => {
        console.log("Saving draft for user", userId, draft);
        set((state) => ({
          draftsByUser: {
            ...state.draftsByUser,
            [userId]: {
              ...state.draftsByUser[userId],
              [draft.kind]: draft,
            },
          },
        }))},
      dismissDraft: (userId, kind) =>
        set((state) => {
          const userDrafts = { ...state.draftsByUser[userId] };
          delete userDrafts[kind];
          return {
            draftsByUser: {
              ...state.draftsByUser,
              [userId]: userDrafts,
            },
          };
        }),
    }),
    {
      name: "form-drafts",
      version: 1,
    },
  ),
);

/** Files cannot be restored by browsers, so deliberately omit them from drafts. */
export const serialiseDraftValues = <T extends Record<string, unknown>>(
  values: T,
): Record<string, unknown> =>
  JSON.parse(
    JSON.stringify(values, (_key, value) =>
      value instanceof File ? undefined : value,
    ),
  ) as Record<string, unknown>;

export const isDraftForRoute = (
  draft: SavedDraft | undefined,
  route: DraftRoute,
  search: SearchParams,
) =>
  draft?.route === route &&
  draft.search.locationId === search.locationId &&
  draft.search.pathId === search.pathId &&
  (draft.kind !== "step-instruction" || draft.search.stepId === search.stepId) &&
  draft.search.buildingId === search.buildingId;
