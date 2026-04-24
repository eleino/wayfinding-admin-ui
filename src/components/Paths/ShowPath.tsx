import type { SearchParams } from "@apptypes/searchParams";
import { useGetPathById } from "@hooks/usePaths";
import { PathStepBox } from "./PathStepBox";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { createPath } from "@utils/createPath";

export const ShowPath = (props: { pathId: number | null, searchParams: SearchParams }) => {
  const { pathId } = props;
  const pathQuery = useGetPathById(pathId, {
    enabled: !!pathId,
  });
  const [expandedStepIds, setExpandedStepIds] = useState<number[]>([]);

  const toggleStepExpansion = (stepId: number) => {
    setExpandedStepIds((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  if (pathQuery.isLoading) {
    return <p>Loading path details...</p>;
  }

  if (pathQuery.isError) {
    return <p>Error loading path details: {pathQuery.error.message}</p>;
  }

  if (!pathQuery.data) {
    return <p>No path data available.</p>;
  }
  const path = pathQuery.data.path;
  const steps = pathQuery.data.steps;

  return (
    <>
    <Link to={createPath("/paths", props.searchParams.orgId || undefined, props.searchParams.siteId || undefined, props.searchParams.buildingId || undefined)} className="text-lab-green-dark mb-4 inline-block">
      &larr; Back to paths list
    </Link>
    <div className="bg-sidebar-grey p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">{path.name}</h2>
      <p className="text-gray-300">Start location: {path.start_location_id}</p>
      <p className="text-gray-300">End location: {path.end_location_id}</p>
      <p className="text-gray-300">Active: {path.is_active ? "Yes" : "No"}</p>
      <p className="text-gray-300">Priority: {path.priority}</p>
      <p className="text-gray-300">Elevated priority starts at: {path.elevated_priority_starts_at ? new Date(path.elevated_priority_starts_at).toLocaleString() : "N/A"}</p>
      <p className="text-gray-300">Elevated priority expires at: {path.elevated_priority_expires_at ? new Date(path.elevated_priority_expires_at).toLocaleString() : "N/A"}</p>
      <p className="text-gray-300">Accessibility level: {path.accessibility_level}</p>
      <p className="text-gray-300">Video instruction URL: {path.video_instruction_url || "N/A"}</p>
      <p className="text-gray-300">Translation key: {path.trl_path_name_key}</p>
        <p className="text-gray-300">Distance: {path.distance_meters} meters</p>
        <p className="text-gray-300">Estimated time: {path.estimated_time_minutes} minutes</p>
        <h3 className="text-lg font-semibold">Steps:</h3>
        <ul className="list-disc list-inside">
          {steps && steps.length > 0 ? (
            steps.map((step) => (
              <li key={step.id} className="text-gray-300 mb-1 list-none cursor-pointer" onClick={() => toggleStepExpansion(step.id)}><span className={expandedStepIds.includes(step.id) ? "w-2 h-2 border-lab-green-dark border-r-2 border-b-2 transform rotate-45 inline-block m-1" : "w-2 h-2 border-lab-green-dark border-r-2 border-t-2 transform rotate-45 inline-block m-1"}></span>
                {step.name} (Order: {step.order})
                {expandedStepIds.includes(step.id) && <PathStepBox stepId={step.id} />}
              </li>
            ))
          ) : (
            <p className="text-gray-300">No steps available for this path.</p>
          )}
        </ul>
    </div>
    </>
  );
}