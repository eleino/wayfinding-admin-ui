import type { SearchParams } from "@schemas/router.schema";
import { useGetPathById } from "@hooks/usePaths";
import { PathStepBox } from "./PathStepBox";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { DeleteDialog } from "@components/Forms/DeleteDialog";
import { useDeletePath } from "@hooks/usePaths";
import { useQueryClient } from "@tanstack/react-query";

export const ShowPath = (props: { pathId: number | undefined, searchParams: SearchParams }) => {
  const { pathId, searchParams } = props;
  const pathQuery = useGetPathById(pathId, {
    enabled: !!pathId,
  });
  const [expandedStepIds, setExpandedStepIds] = useState<number[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const deletePathMutation = useDeletePath()
  const queryClient = useQueryClient();
  
  const handleDeletePath = () => {
    deletePathMutation.mutate(pathId, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        // navigate back to paths list after deletion, maybe after timeout so we can show a success message
        queryClient.invalidateQueries({ queryKey: ["paths", pathQuery.data?.path.building_id] });
        setTimeout(() => {
          navigate({ to: "/paths", search: {orgId: searchParams.orgId, siteId: searchParams.siteId, buildingId: searchParams.buildingId}, replace: true });
        }, 1000);
      },
      onError: (error: Error) => {
      console.error("Error deleting path:", error);
    },
  });
}

  const toggleStepExpansion = (stepId: number) => {
    setExpandedStepIds((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  if (pathQuery.isLoading) {
    return <p>Loading path details...</p>;
  }

  if (pathQuery.isError) {
    return <p className="text-red-500">Error loading path details: {pathQuery.error.message}</p>;
  }

  if (!pathQuery.data) {
    return <p>No path data available.</p>;
  }
  if (deletePathMutation.isPending) {
    return <p>Deleting path...</p>;
  }

  if (deletePathMutation.isError) {
    return <p className="text-red-500">Error deleting path: {deletePathMutation.error.message}</p>;
  }
  if (deletePathMutation.isSuccess) {
    return <p className="text-lab-green-dark">Path deleted successfully. Redirecting to paths list...</p>;
  }
  const path = pathQuery.data.path;
  const steps = pathQuery.data.steps;

  return (
    <>
    <Link to="/paths" search={{ orgId: searchParams.orgId, siteId: searchParams.siteId, buildingId: searchParams.buildingId }} className="text-lab-green-dark mb-4 inline-block">
      &larr; Back to paths list
    </Link>
    <div className="bg-sidebar-grey p-4 rounded shadow relative w-180">
      <div className="flex flex-row justify-between"><h2 className="text-xl font-bold mb-2">{path.name}</h2>
                  <div className="flex flex-row gap-2 text-center">
                    <button className="bg-red-500 rounded py-1 px-2 text-white cursor-pointer hover:bg-red-600" onClick={() => setShowDeleteDialog(true)}>
                      Delete Path
                    </button>
                    <button className="bg-lab-blue rounded py-1 px-2 no-underline cursor-pointer hover:text-lab-turquoise"><Link to="/paths/edit" search={{...props.searchParams, pathId: pathId!}}>
              Edit Path
            </Link></button></div></div>
            {showDeleteDialog && (
              <DeleteDialog
                itemName={path.name}
                onConfirm={() => handleDeletePath()}
                onCancel={() => setShowDeleteDialog(false)}
              />
            )}
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
        <p className="text-gray-300">Allowed organisations: {path.allowed_organizations.length !== 0 ? path.allowed_organizations.map((org, idx) => <span key={org.name}>{org.name}{idx < path.allowed_organizations.length - 1 ? ", " : ""}</span>) : "N/A"}</p>
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