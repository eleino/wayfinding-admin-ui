import { PathForm } from "@components/Paths/PathForm/PathForm";
import type { EditPathInput } from "@apptypes/path";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useSelectionStore } from "@storage/store";
import { createPath } from "@utils/createPath";
import { useCreatePath } from "@hooks/usePaths";

export const NewPathView = () => {
  const { search } = useLocation();
  const buildingId = search.buildingId;
  const savedBuildingId =
    useSelectionStore((state) => state.buildingId) || buildingId;
  const savedSiteId = useSelectionStore((state) => state.siteId);
  const savedOrgId = useSelectionStore((state) => state.orgId);
  const pathBack = createPath(
    "/paths",
    savedOrgId || undefined,
    savedSiteId || undefined,
    savedBuildingId || undefined,
  );
  const createPathMutation = useCreatePath();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const handleSubmit = (data: EditPathInput) => {
    const pathData = {
      name: data.path_name,
      priority: data.priority,
      estimated_time_minutes: data.estimated_time_minutes,
      accessibility_level: data.accessibility_level,
      video_instruction_url: data.video_instruction_url,
      organizations: data.organizations,
      steps: data.steps!,
    };
    if (!buildingId) {
      console.error("Error: No building ID found.");
      return;
    }
    createPathMutation.mutate(
      { buildingId, pathData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["paths"] });
          navigate({ to: pathBack });
        },
      },
    );
  };
  return (
    <div>
      <div>
        <Link to={pathBack} className="text-lab-green-dark p-2">
          ← Back to paths list
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Create New Path</h1>
      <PathForm handleSubmit={handleSubmit} />
    </div>
  );
};
