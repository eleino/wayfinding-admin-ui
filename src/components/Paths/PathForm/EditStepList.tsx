import { StepArraySchema } from "@schemas/step.schema";
import {
  useForm,
  FieldArray,
  getInput,
  move,
  Form,
  remove,
  insert,
  reset,
  setInput,
} from "@formisch/react";
import { useGetEntryLocations, useGetLocations } from "@hooks/useLocations";
import { useLocation } from "@tanstack/react-router";
import { Draggable, DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useEffect, useRef, useState } from "react";
import {
  useGetPathInstructionsAllLangs,
  useUpdateSteps,
} from "@hooks/useSteps";
import type { PathApiResponse } from "@apptypes/path";
import { EditStep } from "./EditStep";
import {
  AlertDialog,
  type AlertDialogType,
} from "@components/Forms/AlertDialog";
import type { UpdateStepDTO } from "@apptypes/dtos/update-step.dto";
import { PathEditStepsProvider } from "../PathContext/PathEditStepsContext";
import { useLanguages } from "@hooks/useAppInit";
import { FormDraftAutosaver, useFormDraft } from "@hooks/useFormDraft";
import { isDraftForRoute } from "@storage/drafts";
import type { SearchParams } from "@schemas/router.schema";
import { ConfirmDialog } from "@components/Forms/ConfirmDialog";

export const EditStepList = (props: { pathData: PathApiResponse }) => {
  const { pathData } = props;
  const [allowRearranging, setAllowRearranging] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);
  const { search } = useLocation();
  const buildingId = search.buildingId;
  const pathId = search.pathId;
  const locationList = useGetLocations(buildingId);
  const entryLocations = useGetEntryLocations(buildingId);
  const pathInstructions = useGetPathInstructionsAllLangs(
    pathId,
    pathData.path.start_location_id,
  );
  const updateStepsMutation = useUpdateSteps();
  const [showAlert, setShowAlert] = useState<AlertDialogType | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const languageList = useLanguages();
  const draftSearch = { ...search, stepId: undefined } as SearchParams;
  const { draft, save: saveDraft, dismiss: dismissDraft } = useFormDraft({
    kind: "path",
    label: `Edit path steps: ${pathData.path.name}`,
    route: "/paths/edit",
    search: draftSearch,
  });

  const steps = pathData.steps?.map((step) => ({
    step_order: step.order,
    location_id: step.location_id,
    distance_to_next_meters: step.distance_to_next_meters,
    video_timestamp_seconds: step.video_timestamp_seconds,
  }));

  const savedSteps = draft && isDraftForRoute(draft, "/paths/edit", draftSearch)
    ? (draft.values.steps as typeof steps | undefined)
    : undefined;
  const form = useForm({
    schema: StepArraySchema,
    initialInput: {
      steps: steps || [],
    },
  });
  const hasRestoredDraft = useRef(false);
  // restore draft values if they exist and haven't been restored yet
  useEffect(() => {
    if (!savedSteps || hasRestoredDraft.current) return;
    setInput(form, { input: { steps: savedSteps } });
    hasRestoredDraft.current = true;
  }, [form, savedSteps]);
  const saveCurrentDraft = () =>
    saveDraft({
      ...(draft?.values ?? {}),
      steps: getInput(form, { path: ["steps"] }),
    });

  const handleReset = () => {
    setShowResetConfirm(true);
  };
  const confirmReset = () => {
    reset(form, { initialInput: { steps: steps || [] } });
    dismissDraft();
    setShowResetConfirm(false);
  };

  const haveStepDataDetails =
    (pathData.steps &&
      pathData.steps.every((step) => step.location_id !== undefined)) ||
    false;

  const calcPathLength = () => {
    const steps = getInput(form, { path: ["steps"] });
    if (steps) {
      const totalLength = steps.reduce(
        (sum, step) => sum + (step.distance_to_next_meters || 0),
        0,
      );
      return totalLength;
    }
    return "0";
  };

  const handleStepsSubmit = (data: { steps: UpdateStepDTO[] }) => {
    const stepsData = data.steps.map((step) => ({
      location_id: step.location_id,
      step_order: step.step_order,
      distance_to_next_meters: step.distance_to_next_meters,
      video_timestamp_seconds: step.video_timestamp_seconds,
    }));
    if (!pathId || !stepsData) {
      console.error("Error: Missing path ID or steps data for updating steps.");
      return;
    }
    setMutationLoading(true);
    updateStepsMutation.mutate(
      { pathId, stepsData },
      {
        onSuccess: (_savedSteps, { stepsData }) => {
          // Invalidate the query to refetch the updated steps data
          reset(form, { initialInput: stepsData, path: ["steps"] });
          dismissDraft();
          setMutationLoading(false);
          setShowAlert({
            title: "Steps updated successfully",
            description: "The steps have been updated successfully.",
            type: "success",
          });
        },
        onError: (error) => {
          console.error("Error updating steps:", error);
          setMutationLoading(false);
          setShowAlert({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "An unknown error occurred while updating steps.",
            type: "error",
          });
        },
      },
    );
  };
  const handleToggle = () => {
    // check whether we have the necessary data from backend to be able to rearrange steps
    if (
      !pathData.steps ||
      !pathData.steps.every((step) => step.location_id !== undefined)
    ) {
      setShowAlert({
        title: "Rearranging Not Available",
        description: "Rearranging steps is not currently available.",
        type: "error",
      });
      return;
    }
    if (form.isDirty && allowRearranging) {
      // if we allow toggling without saving, the instruction keys for steps may be incorrect if any rearranging was done
      setShowAlert({
        title: "Unsaved Changes",
        description:
          "You have unsaved changes. Save or cancel them before toggling off rearranging mode.",
        type: "info",
      });
      return;
    }
    setAllowRearranging(!allowRearranging);
  };

  if (!buildingId || !pathId) {
    return (
      <p className="text-red-500">
        Error: You must select a building and a path to edit a path.
      </p>
    );
  }
  if (locationList.isLoading || pathInstructions.isLoading) {
    return <p>Loading path data...</p>;
  }
  return (
    <div className="mt-20">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold my-4">Edit Path Steps</h2>
        <span
          className="text-white border border-lab-turquoise rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
          onClick={() =>
            setShowAlert({
              title: "Info",
              description:
                "Rearranging mode allows you to reorder, add, and remove steps, and change a step's location.\n\nNormal mode allows you to change step instructions.\n\nIf an instruction text is missing, that part of the instructions (ie. 'on approach' or 'to next') won't be shown to users on the frontend.\n\nPlease include an image for each instruction you want to display to users to help them navigate.\nAdding an overlay helps show users which way to go and where to turn.",
              type: "info"
            })
          }
        >
          ?
        </span>
      </div>
      <div className="my-4 relative">
        <span className="font-bold">Allow rearranging steps:</span>
        <div className="flex items-center space-x-2">
          <label
            htmlFor="rearrange"
            className="flex rounded-xl items-center cursor-pointer focus-within:ring-2 focus-within:ring-lab-blue"
          >
            <input
              type="checkbox"
              checked={allowRearranging}
              onChange={(e) => setAllowRearranging(e.target.checked)}
              className="sr-only"
              aria-label="Allow rearranging steps"
              aria-checked={allowRearranging}
            />
            <span
              className={`w-10 h-5 rounded-xl relative border border-border-grey cursor-pointer ${allowRearranging ? `bg-red-300` : "bg-black"}`}
              onClick={handleToggle}
            >
              <span
                className={`h-3.5 w-3.5 mx-1 top-1/2 -translate-y-1/2 rounded-full absolute bg-white transition-all duration-300 ${allowRearranging ? "right-0" : "left-0"}`}
              ></span>
            </span>
          </label>
          <span>
            {allowRearranging
              ? "Yes (allows rearranging, adding, and removing steps)"
              : "No"}
          </span>
          {showAlert && (
            <AlertDialog
              title={showAlert.title}
              description={showAlert.description}
              onConfirm={() => setShowAlert(null)}
              type={showAlert.type || "error"}
            />
          )}
        </div>
        <p className="text-sm text-red-500 mt-1">
          Important! Rearranging steps will affect the instruction keys used for
          steps.
          <br />
          It is advised to do any rearranging before editing the instructions if
          necessary.
        </p>
      </div>
      <FormDraftAutosaver
        form={form}
        save={saveDraft}
        mapValues={(values) => ({ ...(draft?.values ?? {}), steps: values.steps })}
      />
      <Form
        of={form}
        onSubmit={handleStepsSubmit}
      >
        <p className="pb-2">Total path length: {calcPathLength()} meters</p>
        <PathEditStepsProvider
          value={{
            form,
            locationList: locationList.data,
            entryLocations: entryLocations.data,
            pathData,
            pathInstructions: pathInstructions.data,
            allowRearranging,
            languageList: languageList.data,
          }}
        >
          <FieldArray of={form} path={["steps"]}>
            {(stepArray) => {
              return (
                <DragDropContext
                  onDragEnd={(result) => {
                    if (
                      !result.destination ||
                      result.source.index === 0 ||
                      result.destination.index === 0
                    )
                      return; // prevent dragging the first step which must be an entry location
                    move(form, {
                      path: ["steps"],
                      from: result.source.index,
                      to: result.destination.index,
                    });
                    saveCurrentDraft();
                  }}
                >
                  <Droppable droppableId="steps">
                    {(dropProvided) => (
                      <div
                        {...dropProvided.droppableProps}
                        ref={dropProvided.innerRef}
                      >
                        {stepArray.items.map((stepItem, stepIndex) => (
                          <Draggable
                            key={stepItem}
                            draggableId={stepItem}
                            index={stepIndex}
                            isDragDisabled={
                              !allowRearranging || stepIndex === 0
                            }
                          >
                            {(dragProvided) => {
                              const providedStyle =
                                dragProvided.draggableProps.style;
                              const style = {
                                ...providedStyle,
                                // disable transform/transition for the first step to prevent it from moving when other steps are dragged on top of it
                                transform:
                                  stepIndex === 0
                                    ? "none"
                                    : providedStyle?.transform,
                                transition:
                                  stepIndex === 0
                                    ? "none"
                                    : providedStyle?.transition,
                              };

                              return (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  style={style}
                                >
                                  <EditStep
                                  key={stepItem}
                                  stepIndex={stepIndex}
                                  haveStepDataDetails={haveStepDataDetails}
                                  openInstructionStepId={search.stepId}
                                    onRemove={() =>
                                      {
                                        remove(form, {
                                          path: ["steps"],
                                          at: stepIndex,
                                        });
                                        saveCurrentDraft();
                                      }
                                    }
                                  />
                                </div>
                              );
                            }}
                          </Draggable>
                        ))}
                        {dropProvided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  {stepArray.errors && (
                    <div className="text-sm text-red-500 mt-1">
                      {stepArray.errors[0]}
                    </div>
                  )}
                </DragDropContext>
              );
            }}
          </FieldArray>
        </PathEditStepsProvider>
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className={`px-4 py-2 ${allowRearranging ? "bg-lab-blue cursor-pointer" : "bg-sidebar-grey border border-border-grey"} text-white rounded disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={!allowRearranging}
          onClick={() => {
              insert(form, {
                path: ["steps"],
                initialInput: {
                  step_order: 0,
                  location_id: 0,
                  distance_to_next_meters: 0,
                  video_timestamp_seconds: 0,
                },
              });
              saveCurrentDraft();
            }}
          >
            Add Step
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-border-grey text-white rounded enabled:cursor-pointer disabled:opacity-50"
            onClick={handleReset}
            disabled={!form.isDirty}
          >
            Reset Steps
          </button>
          {mutationLoading && (
            <span className="text-sm text-gray-400 ml-2">Saving...</span>
          )}

          <button
            type="submit"
            className={`px-4 py-2 bg-lab-green-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white rounded`}
            disabled={!form.isDirty}
          >
            Save Steps
          </button>
        </div>
      </Form>
      {showResetConfirm && (
        <ConfirmDialog
          title="Reset path steps?"
          description="The steps will return to their original values and the saved path draft will be removed."
          confirmLabel="Reset steps"
          onConfirm={confirmReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  );
};
