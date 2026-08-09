import { useSearch } from "@tanstack/react-router";
import { useGetPathById, useUpdatePath } from "@hooks/usePaths";
import { PathForm } from "@components/Paths/PathForm/PathForm";
import type { EditPathInput } from "@schemas/path.schema";
import type { UpdatePathDTO } from "@apptypes/dtos/update-path.dto";
import type { SearchParams } from "@schemas/router.schema";
export const EditPathView = () => {
    const search = useSearch({ from: '__root__' }) as SearchParams;
    const pathId = search.pathId;
    // const buildingId = search.buildingId;
    const created = search.created;
    const pathDataQuery = useGetPathById(pathId);
    const path = pathDataQuery.data?.path;
    const initPathData = {
        path_name: path?.name || "",
        priority: path?.priority || 1,
        estimated_time_minutes: path?.estimated_time_minutes || 0,
        accessibility_level: path?.accessibility_level || 0,
        video_instruction_url: path?.video_instruction_url || "",

        elevated_priority_starts_at: path?.elevated_priority_starts_at ? new Date(path.elevated_priority_starts_at) : undefined,

        elevated_priority_expires_at: path?.elevated_priority_expires_at ? new Date(path.elevated_priority_expires_at) : undefined,

        organizations: path?.allowed_organizations.map(org => org.organization_id) || [],

        steps: pathDataQuery.data?.steps?.map(step => ({
            id: step.id,
            name: step.name, // the location's name
            step_order: step.order,
            location_id: step.location_id,
            distance_to_next_meters: step.distance_to_next_meters,
        })) || [],
    }
    const updatePathMutation = useUpdatePath();

    const handleSubmit = (updatedPathData: EditPathInput) => {
        if (!pathId) return;
        const pathData: UpdatePathDTO = {
            priority: updatedPathData.priority,
            estimated_time_minutes: updatedPathData.estimated_time_minutes,
            accessibility_level: updatedPathData.accessibility_level,
            video_instruction_url: updatedPathData.video_instruction_url,
            elevated_priority_starts_at: updatedPathData.elevated_priority_starts_at,
            elevated_priority_expires_at: updatedPathData.elevated_priority_expires_at,
        }
        // only send name if it has changed to avoid name conflict on backend
        if (updatedPathData.path_name !== initPathData.path_name) {
            pathData.name = updatedPathData.path_name;
        }
        if (updatedPathData.organizations !== initPathData.organizations) {
            pathData.organizations = updatedPathData.organizations;
        }

        updatePathMutation.mutate({ pathId:pathId, pathData }, {
            onError: (error) => {
                console.error("Error updating path:", error);
            }
        });
    }

    if (pathDataQuery.isLoading) {
        return <p>Loading path data...</p>;
    }
    if (pathDataQuery.isError || !initPathData) {
        return <p className="text-red-500">Error loading path data</p>;
    }
    return (
        <div className="p-4">
            <h1 className="">Edit Path</h1>
            {created && <p className="text-lab-green-dark mb-4">Path created successfully! You can now edit the path details and step instructions.</p>}
            <PathForm pathData={pathDataQuery.data} handleSubmit={handleSubmit} pathError={updatePathMutation.error} />
        </div>
    );
}
