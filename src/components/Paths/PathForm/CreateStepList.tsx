import { FieldArray, insert, move, getInput, remove } from "@formisch/react";
import type { FormStore } from "@formisch/react";
import { useGetLocations } from "@hooks/useLocations";
import { CreatePathSchema } from "@schemas/path.schema";
import { useLocation } from "@tanstack/react-router";
import { CreateStep } from "./CreateStep";
import { Draggable, DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useState } from "react";

type CreateStepListProps = {
  form: FormStore<typeof CreatePathSchema>;
};

export const CreateStepList = (props: CreateStepListProps) => {
  const { form } = props;
  const { search } = useLocation();
  const buildingId = search.buildingId;
  const locationList = useGetLocations(buildingId);
  const [pathLength, setPathLength] = useState(0);

  const calcPathLength = () => {
    const steps = getInput(form, { path: ["steps"] });
    if (steps) {
      const totalLength = steps.reduce((sum, step) => sum + (step.distance_to_next_meters || 0), 0);
      setPathLength(totalLength);
    }
  }
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Steps</h3>
      {/* <p className="text-red-500 py-1"><strong>Important! After the path is saved</strong>, you cannot change the order of the steps or the location associated with a step anymore.</p> */}
      <p>Total path length: {pathLength.toFixed(2)} meters</p>
      {locationList.isLoading ? (
        <p>Loading locations...</p>
      ) : (
        <div className="p-4">
        <FieldArray of={form} path={["steps"]}>
          {(stepArray) => (
            <DragDropContext
              onDragEnd={(result) => {
                if (!result.destination) return;
                move(form, {
                  path: ["steps"],
                  from: result.source.index,
                  to: result.destination.index,
                });
              }}
            >
              <Droppable droppableId="steps">
                {(dropProvided) => (
                  <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
                    {stepArray.items.map((stepItem, stepIndex) => (
                      <Draggable
                        key={stepItem}
                        draggableId={stepItem}
                        index={stepIndex}
                      >
                        {(dragProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                          >
                            <CreateStep
                              key={stepItem}
                              form={form}
                              stepIndex={stepIndex}
                              locationList={locationList.data}
                              calcPathLength={calcPathLength}
                              onRemove={() => remove(form, { path: ["steps"], at: stepIndex })}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {dropProvided.placeholder}
                  </div>
                )}
              </Droppable>
              {stepArray.errors && <p className="text-red-500">{stepArray.errors}</p>}
            </DragDropContext>
          )}
        </FieldArray>
        </div>
      )}
      <button
        type="button"
        className="mt-2 px-4 py-2 bg-lab-blue text-white rounded"
        onClick={() => {
          insert(form, {
            path: ["steps"],
            initialInput: {
              step_order: 0,
              location_id: undefined,
              distance_to_next_meters: 0,
              video_timestamp_seconds: 0,
            },
          });
        }}
      >
        Add Step
      </button>
      <p className="pt-5 text-sm text-gray-500 w-100">
        Hint: You can drag and drop steps to reorder them.<br />
        You will be able to add images and instructions to steps once the path is saved.
      </p>
    </div>
  );
};
