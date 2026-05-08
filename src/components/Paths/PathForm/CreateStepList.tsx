import { FieldArray, insert, move } from "@formisch/react";
import type { FormStore } from "@formisch/react";
import { useGetLocations } from "@hooks/useLocations";
import { CreatePathSchema } from "@schemas/path.schema";
import { useLocation } from "@tanstack/react-router";
import { CreateStep } from "./CreateStep";
import { Draggable, DragDropContext, Droppable } from "@hello-pangea/dnd";

type CreateStepListProps = {
  form: FormStore<typeof CreatePathSchema>;
};

export const CreateStepList = (props: CreateStepListProps) => {
  const { form } = props;
  const { search } = useLocation();
  const buildingId = search.buildingId;
  const locationList = useGetLocations(buildingId);
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Steps</h3>
      {locationList.isLoading ? (
        <p>Loading locations...</p>
      ) : (
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
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {dropProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </FieldArray>
      )}
      <button
        type="button"
        className="mt-2 px-4 py-2 bg-lab-green-dark text-white rounded"
        onClick={() => {
          insert(form, {
            path: ["steps"],
            initialInput: {
              step_order: undefined,
              location_id: undefined,
              distance_to_next_meters: undefined,
              video_timestamp_seconds: undefined,
            },
          });
        }}
      >
        Add Step
      </button>
    </div>
  );
};
