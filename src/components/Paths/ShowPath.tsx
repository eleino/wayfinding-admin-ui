import PathUsageChart from "@components/Dashboard/PathUsageChart";
import { DeleteDialog } from "@components/Forms/DeleteDialog";
import { useGetLocationById } from "@hooks/useLocations";
import { useGetAllPathMetrics } from "@hooks/useMetrics";
import { useDeletePath, useGetPathById } from "@hooks/usePaths";
import { useGetPathInstructionsAllLangs } from "@hooks/useSteps";
import { useGetTranslationsAllLangs } from "@hooks/useTranslations";
import type { SearchParams } from "@schemas/router.schema";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { getPast30DaysDateRange } from "@utils/dateRange";
import { useState } from "react";
import {
  PathStepBox,
  type InstructionOverride,
  type LocalizedStepInstructions,
} from "./PathStepBox";

const DetailItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
    <dd className="mt-1 text-sm text-gray-100">{children}</dd>
  </div>
);

const formatDateTime = (value: Date | null) =>
  value ? new Date(value).toLocaleString() : "Not scheduled";

export const ShowPath = (props: {
  pathId: number | undefined;
  searchParams: SearchParams;
}) => {
  const { pathId, searchParams } = props;
  const pathQuery = useGetPathById(pathId, { enabled: !!pathId });
  const loadedPath = pathQuery.data?.path;
  const { startDate, endDate } = getPast30DaysDateRange();
  const metricsQuery = useGetAllPathMetrics(
    loadedPath?.building_id ?? null,
    startDate,
    endDate,
  );
  const instructionsQuery = useGetPathInstructionsAllLangs(
    pathId ?? null,
    loadedPath?.start_location_id,
    { enabled: !!pathId && !!loadedPath?.start_location_id },
  );
  const startLocationQuery = useGetLocationById(loadedPath?.start_location_id, {
    enabled: !!loadedPath?.start_location_id,
  });
  const startLocationMessageKey =
    startLocationQuery.data?.location.trl_current_location_msg_key;
  const startLocationTranslationsQuery = useGetTranslationsAllLangs(
    startLocationMessageKey,
    { enabled: !!startLocationMessageKey },
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const deletePathMutation = useDeletePath();
  const queryClient = useQueryClient();

  const handleDeletePath = () => {
    deletePathMutation.mutate(pathId, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        queryClient.invalidateQueries({
          queryKey: ["paths", pathQuery.data?.path.building_id],
        });
        setTimeout(() => {
          navigate({
            to: "/paths",
            search: {
              orgId: searchParams.orgId,
              siteId: searchParams.siteId,
              buildingId: searchParams.buildingId,
            },
            replace: true,
          });
        }, 1000);
      },
      onError: (error: Error) => {
        console.error("Error deleting path:", error);
      },
    });
  };

  if (pathQuery.isLoading) return <p>Loading path details...</p>;
  if (pathQuery.isError) {
    return (
      <p className="text-red-500">
        Error loading path details: {pathQuery.error.message}
      </p>
    );
  }
  if (!pathQuery.data) return <p>No path data available.</p>;
  if (deletePathMutation.isPending) return <p>Deleting path...</p>;
  if (deletePathMutation.isError) {
    return (
      <p className="text-red-500">
        Error deleting path: {deletePathMutation.error.message}
      </p>
    );
  }
  if (deletePathMutation.isSuccess) {
    return (
      <p className="text-lab-green-dark">
        Path deleted successfully. Redirecting to paths list...
      </p>
    );
  }

  const { path, steps = [] } = pathQuery.data;
  const pathMetrics = metricsQuery.data?.find(
    (item) => item.path_id === path.path_id,
  );
  const startLocationImageUrl = startLocationQuery.data?.image?.url;
  const startInstruction: InstructionOverride = {
    image: startLocationImageUrl
      ? { url: startLocationImageUrl, overlay: null }
      : null,
    translations: (startLocationTranslationsQuery.data ?? []).map(
      (translation) => ({
        languageCode: translation.language_code,
        text: translation.text_value,
      }),
    ),
  };
  const startInstructionIsLoading =
    startLocationQuery.isLoading || startLocationTranslationsQuery.isLoading;
  const startInstructionIsError =
    startLocationQuery.isError || startLocationTranslationsQuery.isError;

  const getStepInstructions = (stepOrder: number) =>
    (instructionsQuery.data ?? []).flatMap<LocalizedStepInstructions>(
      (localizedInstructions) => {
        const languageCode = Object.keys(
          localizedInstructions.destination.translations,
        )[0];
        const step = localizedInstructions.steps.find(
          (item) => item.step_order === stepOrder,
        );

        return languageCode && step ? [{ languageCode, step }] : [];
      },
    );

  return (
    <div className="mx-auto w-full max-w-5xl">
      <Link
        to="/paths"
        search={{
          orgId: searchParams.orgId,
          siteId: searchParams.siteId,
          buildingId: searchParams.buildingId,
        }}
        className="mb-4 inline-block text-lab-green-dark hover:underline"
      >
        &larr; Back to paths list
      </Link>

      <header className="rounded-xl border border-border-grey bg-sidebar-grey p-5 shadow">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold">{path.name}</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  path.is_active
                    ? "bg-lab-green-dark/20 text-lab-green-dark"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {path.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Path #{path.path_id} · {steps.length} {steps.length === 1 ? "step" : "steps"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/paths/edit"
              search={{ ...searchParams, pathId: pathId! }}
              className="rounded bg-lab-blue px-4 py-2 text-sm text-white hover:text-lab-turquoise"
            >
              Edit path
            </Link>
            <button
              type="button"
              className="cursor-pointer rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete path
            </button>
          </div>
        </div>

        {showDeleteDialog && (
          <DeleteDialog
            itemName={path.name}
            onConfirm={handleDeletePath}
            onCancel={() => setShowDeleteDialog(false)}
          />
        )}

        <dl className="mt-6 grid gap-x-8 gap-y-5 border-t border-border-grey pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem label="Start location">#{path.start_location_id}</DetailItem>
          <DetailItem label="End location">#{path.end_location_id}</DetailItem>
          <DetailItem label="Distance">
            {path.distance_meters === null ? "Not set" : `${path.distance_meters} m`}
          </DetailItem>
          <DetailItem label="Estimated time">{path.estimated_time_minutes} min</DetailItem>
          <DetailItem label="Priority">{path.priority}</DetailItem>
          <DetailItem label="Accessibility level">{path.accessibility_level}</DetailItem>
          <DetailItem label="Elevated priority starts">
            {formatDateTime(path.elevated_priority_starts_at)}
          </DetailItem>
          <DetailItem label="Elevated priority ends">
            {formatDateTime(path.elevated_priority_expires_at)}
          </DetailItem>
          <DetailItem label="Allowed organisations">
            {path.allowed_organizations.length > 0
              ? path.allowed_organizations.map((organization) => organization.name).join(", ")
              : "All organisations"}
          </DetailItem>
          <DetailItem label="Video instructions">
            {path.video_instruction_url ? (
              <a
                href={path.video_instruction_url}
                target="_blank"
                rel="noreferrer"
                className="text-lab-turquoise hover:underline"
              >
                Open video
              </a>
            ) : (
              "Not set"
            )}
          </DetailItem>
          <DetailItem label="Translation key">
            {path.trl_path_name_key || "Not set"}
          </DetailItem>
        </dl>
      </header>

      <section className="mt-6 rounded-xl border border-border-grey bg-sidebar-grey p-5 shadow">
        <div>
          <h2 className="text-xl font-semibold">Path usage</h2>
          <p className="mt-1 text-sm text-gray-400">
            Past 30 days · {startDate} – {endDate}
          </p>
        </div>

        {metricsQuery.isLoading ? (
          <p className="mt-5 text-gray-400">Loading path usage...</p>
        ) : metricsQuery.isError ? (
          <p className="mt-5 text-red-300" role="alert">
            Path usage could not be loaded.
          </p>
        ) : (
          <>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border-grey bg-black/20 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Path started
                </p>
                <p className="mt-1 text-3xl font-bold text-lab-turquoise">
                  {pathMetrics?.usage_count ?? 0}
                </p>
              </div>
              <div className="rounded-lg border border-border-grey bg-black/20 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Path completed
                </p>
                <p className="mt-1 text-3xl font-bold text-lab-green-dark">
                  {pathMetrics?.finished_count ?? 0}
                </p>
              </div>
            </div>
            {pathMetrics?.metrics.length ? (
              <div className="mt-5 h-64 min-w-0">
                <PathUsageChart pathMetrics={pathMetrics.metrics} compact />
              </div>
            ) : (
              <p className="mt-5 text-sm text-gray-400">
                No path activity in this period.
              </p>
            )}
          </>
        )}
      </section>

      <section className="mt-6" aria-labelledby="path-steps-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="path-steps-heading" className="text-xl font-semibold">
              Steps and instructions
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              All instructions are shown in the configured languages.
            </p>
          </div>
          <span className="text-sm text-gray-400">{steps.length} total</span>
        </div>

        {instructionsQuery.isLoading || startInstructionIsLoading ? (
          <p className="rounded-xl border border-border-grey bg-sidebar-grey p-5 text-gray-400">
            Loading all step instructions...
          </p>
        ) : instructionsQuery.isError || startInstructionIsError ? (
          <p
            className="rounded-xl border border-red-500/40 bg-sidebar-grey p-5 text-red-300"
            role="alert"
          >
            Step instructions could not be loaded.
          </p>
        ) : steps.length > 0 ? (
          <div className="space-y-4">
            {steps.map((step) => (
              <PathStepBox
                key={step.id}
                step={step}
                instructions={getStepInstructions(step.order)}
                onApproachOverride={
                  step.order === steps[0]?.order ? startInstruction : undefined
                }
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-border-grey bg-sidebar-grey p-5 text-gray-400">
            No steps available for this path.
          </p>
        )}
      </section>
    </div>
  );
};
