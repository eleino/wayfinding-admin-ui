import { useGetStepById } from "@hooks/useSteps";
import { StepInstructions } from "./StepInstructions";

export const PathStepBox = (props: { stepId: number }) => {
  const { stepId } = props;
  const stepQuery = useGetStepById(stepId, {
    enabled: !!stepId,
  });

  if (stepQuery.isLoading) {
    return <p>Loading step details...</p>;
  }

  if (stepQuery.isError) {
    return <p>Error loading step details: {stepQuery.error.message}</p>;
  }

  if (!stepQuery.data) {
    return <p>No step data available.</p>;
  }
  const step = stepQuery.data.step;
  

  return (
    <div className="bg-sidebar-grey p-4 rounded shadow mb-4 border-l-4 border-lab-blue">
      <h3 className="text-lg font-bold mb-2">Step {step.step_order}</h3>
      <p className="text-gray-300 mb-1">Location ID: {step.location_id}</p>
      <p className="text-gray-300 mb-1">Distance to next step: {step.distance_to_next_meters} meters</p>
      <p className="text-gray-300 mb-1">Video timestamp: {step.video_timestamp_seconds} seconds</p>
      <h4 className="text-md font-semibold mt-2 mb-1">Instructions:</h4>
      {step.instructions.map((instruction, index) => (
       <StepInstructions key={index} instruction={instruction} />
      ))}
    </div>
  );
};