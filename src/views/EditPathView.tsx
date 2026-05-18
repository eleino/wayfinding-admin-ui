import { useLocation, useNavigate } from "@tanstack/react-router";
import { useGetPathById, useUpdatePath } from "@hooks/usePaths";
import { PathForm } from "@components/Paths/PathForm/PathForm";
import type { EditPathInput } from "@apptypes/path";
export const EditPathView = () => {
    const { search } = useLocation();
    const pathId = search.pathId;
    const buildingId = search.buildingId;
    const pathDataQuery = useGetPathById(pathId ? parseInt(pathId) : null);
    const pathData = {
        path_name: pathDataQuery.data?.path.name || "",
        priority: pathDataQuery.data?.path.priority || 1,
        estimated_time_minutes: pathDataQuery.data?.path.estimated_time_minutes || undefined,
        accessibility_level: pathDataQuery.data?.path.accessibility_level || 0,
        video_instruction_url: pathDataQuery.data?.path.video_instruction_url || "",
        organizations: pathDataQuery.data?.path.allowed_organizations.map(org => org.organization_id) || [],
        steps: pathDataQuery.data?.steps?.map(step => ({
            id: step.id,
            name: step.name, // for now, we display only location name in the overview, get the actual location id in edit mode for the step
            step_order: step.order,
            location_id: 0, // TODO change backend to provide location ids in path overview
            distance_to_next_meters: 0, // perhaps this data as well if we want to actually show it in the list of steps
        })) || [],
    }
    const updatePathMutation = useUpdatePath();
    const navigate = useNavigate();

    const handleSubmit = (updatedPathData: EditPathInput) => {
        if (!pathId) return;
        // updatePathMutation.mutate({ pathId: parseInt(pathId), updatedPathData }, {
        //     onSuccess: () => {
        //         navigate(`/paths?buildingId=${pathData?.building_id}`);
        //     },
        //     onError: (error) => {
        //         console.error("Error updating path:", error);
        //     }
        // });
    }

    if (pathDataQuery.isLoading) {
        return <p>Loading path data...</p>;
    }
    if (pathDataQuery.isError || !pathData) {
        return <p className="text-red-500">Error loading path data</p>;
    }
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Path</h1>
            <PathForm pathData={pathData} handleSubmit={handleSubmit} />
        </div>
    );
}