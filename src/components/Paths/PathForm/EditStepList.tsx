// show a list of EditStep components, list should allow shuffling the order and adding new steps but only if user has turned on rearranging steps, otherwise only editing existing step information is possible.
import { StepArraySchema } from "@schemas/step.schema"
import { useForm, FieldArray, getInput, move, Form } from "@formisch/react";
import { useGetLocations } from "@hooks/useLocations";
import { useLocation } from "@tanstack/react-router";
import { Draggable, DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useState } from "react";
import { useGetPathInstructions, useUpdateSteps } from "@hooks/useSteps";
import type { EditPathInput } from "@apptypes/path";
import { EditStep } from "./EditStep";
import { ToggleBox } from "@components/Forms/ToggleBox";

export const EditStepList = (props: { pathData: EditPathInput }) => {
    const { pathData } = props;
    const [allowRearranging, setAllowRearranging] = useState(false);
    const { search } = useLocation();
    const buildingId = search.buildingId;
    const pathId = search.pathId;
    const locationList = useGetLocations(buildingId);
    const pathInstructionsFi = useGetPathInstructions(pathId, "fi");
    const pathInstructionsEn = useGetPathInstructions(pathId, "en");
    const updateStepsMutation = useUpdateSteps();

    // should we pass path instructions as they are to individual steps and map them there to the correct step or process the data here and pass only relevant instruction to each step?

    const form = useForm({
        schema: StepArraySchema,
        initialInput: {
            steps: pathData?.steps || [],
        }
        },
    );

    const calcPathLength = () => {
        const steps = getInput(form, { path: ["steps"] });
        if (steps) {
          const totalLength = steps.reduce((sum, step) => sum + (step.distance_to_next_meters || 0), 0);
          return totalLength.toFixed(2);
        }
        return "0.00";
      }

      const handleSubmit = () => {
        const stepsData = getInput(form, { path: ["steps"] });
        if (!pathId || !stepsData) {
            console.error("Error: Missing path ID or steps data for updating steps.");
            return;
        }
        updateStepsMutation.mutate({ pathId, stepsData }, {
            onSuccess: () => {
                console.log("Steps updated successfully");
            },
            onError: (error) => {
                console.error("Error updating steps:", error);
            }
        });
      }
      const handleToggle = () => {
        setAllowRearranging(!allowRearranging);
    }

    if (!buildingId || !pathId) {
        return <p className="text-red-500">Error: You must select a building and a path to edit a path.</p>;
    }
    if (locationList.isLoading || pathInstructionsFi.isLoading || pathInstructionsEn.isLoading) {
        return <p>Loading path data...</p>;
    }
    return (
        <div>
            Edit Path Steps
            <div className="my-4">
                <span>Allow rearranging steps:</span>
                <div className="flex items-center space-x-2">
                      <label htmlFor="rearrange" className="flex rounded-xl items-center cursor-pointer focus-within:ring-2 focus-within:ring-lab-blue">
                      <input
                        type="checkbox"
                        checked={allowRearranging}
                        onChange={(e) => setAllowRearranging(e.target.checked)}
                        className="sr-only"
                        aria-label="Allow rearranging steps"
                        aria-checked={allowRearranging}
                      />
                      <span className={`w-10 h-5 rounded-xl relative border border-border-grey cursor-pointer ${allowRearranging ? `bg-red-300` : 'bg-black'}`}
                      onClick={handleToggle}>
                        <span className={`h-3.5 w-3.5 mx-1 top-1/2 -translate-y-1/2 rounded-full absolute bg-white transition-all duration-300 ${allowRearranging ? 'right-0' : 'left-0'}`}></span>
                    </span>
                    </label>
                    <span>{allowRearranging ? "Yes (allows rearranging, adding, and removing steps)" : "No"}</span>
                    </div>
                    <p className="text-sm text-red-500 mt-1">
                        Important! Rearranging steps will affect the instruction keys used for steps.<br />
                        It is advised to do any rearranging before editing the instructions.
                    </p>
            </div>
            <Form of={form} onSubmit={handleSubmit}>
                <p>Total path length: {calcPathLength()} meters</p>
                    <FieldArray of={form} path={["steps"]}>
                    {(stepArray) => (
                        <DragDropContext
                        
                        onDragEnd={(result) => {
                            if (!result.destination) return;
                            move(form, {
                                path: ["steps"],
                                from: result.source.index,
                                to: result.destination.index
                            });
                        }}>
                            <Droppable droppableId="steps">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {stepArray.items.map((stepItem, stepIndex) => (
                                            <Draggable key={stepItem} draggableId={stepItem} index={stepIndex} isDragDisabled={!allowRearranging}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <EditStep key={stepItem} locationList={locationList.data} stepIndex={stepIndex} calcPathLength={calcPathLength}
                                                        pathData={pathData} pathInstructionsFi={pathInstructionsFi.data} pathInstructionsEn={pathInstructionsEn.data}
                                                        allowRearranging={allowRearranging} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </FieldArray>
                <button type="submit">Save Steps</button>
            </Form>
        </div>
    )
}