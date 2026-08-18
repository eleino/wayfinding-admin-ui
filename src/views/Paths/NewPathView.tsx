import { PathForm } from "@components/Paths/PathForm/PathForm";
import type { EditPathInput } from "@schemas/path.schema";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useSelectionStore } from "@storage/store";
import { useCreatePath } from "@hooks/usePaths";
import { useContext } from "react";
import { AuthContext } from "@auth/authContext";
import { useDraftStore } from "@storage/drafts";

export const NewPathView = () => {
  const { search } = useLocation();
  const buildingId = search.buildingId;
  const savedBuildingId =
    useSelectionStore((state) => state.buildingId) || buildingId;
  const savedSiteId = useSelectionStore((state) => state.siteId);
  const savedOrgId = useSelectionStore((state) => state.orgId);

  const createPathMutation = useCreatePath();
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);
  const dismissDraft = useDraftStore((state) => state.dismissDraft);

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
        onSuccess: (data) => {
          if (userId) dismissDraft(userId, "path");
          const newPathId = data.path_id;
          queryClient.invalidateQueries({ queryKey: ["paths"] });
          navigate({
            to: "/paths/edit",
            search: {
              orgId: savedOrgId,
              siteId: savedSiteId,
              buildingId: savedBuildingId,
              pathId: newPathId,
              created: true,
            },
            replace: true,
          });
        },
      },
    );
  };
  return (
    <div className="p-4">
      <h1 className="">Create New Path</h1>
      <Link
        to="/paths"
        search={{
          orgId: savedOrgId,
          siteId: savedSiteId,
          buildingId: savedBuildingId,
        }}
        className="text-lab-green-dark p-2"
      >
        ← Back to paths list
      </Link>
      <div className="bg-sidebar-grey  p-2 rounded shadow-md">
        <PathForm
          handleSubmit={handleSubmit}
          onCancel={() => navigate({ to: "/paths", search: { orgId: savedOrgId, siteId: savedSiteId, buildingId: savedBuildingId } })}
        />
        {createPathMutation.isError && (
          <p className="text-red-500 mt-2">
            Error creating path:{" "}
            {createPathMutation.error.message || "Unknown error"}
          </p>
        )}
        <p className="text-sm text-gray-400 px-2">
          Once the path is created, you can edit its details and steps.
        </p>
      </div>
    </div>
  );
};
