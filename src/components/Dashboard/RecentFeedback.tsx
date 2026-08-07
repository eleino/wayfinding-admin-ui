import { useState } from "react";
import {
  useDeleteFeedback,
  useGetRecentFeedback,
  useUpdateFeedbackStatus,
} from "@hooks/useFeedback";
import {
  feedbackStatuses,
  type Feedback,
  type FeedbackStatus,
} from "@apptypes/feedback";

const statusStyles: Record<FeedbackStatus, string> = {
  pending: "bg-amber-400/15 text-amber-300",
  viewed: "bg-lab-blue-light/15 text-lab-blue-light",
  resolved: "bg-lab-green/15 text-lab-green",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const FeedbackItem = ({ feedback }: { feedback: Feedback }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const updateStatusMutation = useUpdateFeedbackStatus();
  const removeFeedbackMutation = useDeleteFeedback();

  const updateStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as FeedbackStatus;
    updateStatusMutation.mutate(
      { feedbackId: feedback.feedback_id, status: newStatus },
      {
        onSuccess: () => {
          feedback.status = newStatus;
        },
      },
    );
  };

  const removeFeedback = (feedback_id: number) => {
    removeFeedbackMutation.mutate(feedback_id);
  };

  return (
    <li className="border border-black rounded p-2 mb-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${statusStyles[feedback.status]}`}
            >
              {feedback.status}
            </span>
            <time className="text-xs text-gray-400" dateTime={feedback.submitted_at}>
              {formatDate(feedback.submitted_at)}
            </time>
          </div>
          <p className={isExpanded ? "text-sm" : "line-clamp-2 text-sm"}>
            {feedback.feedback_text}
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 cursor-pointer text-sm text-lab-turquoise hover:underline"
          onClick={() => setIsExpanded((value) => !value)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? "Close" : "View"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="text-xs text-gray-400" htmlFor={`feedback-${feedback.feedback_id}-status`}>
            Status
          </label>
          <select
            id={`feedback-${feedback.feedback_id}-status`}
            value={feedback.status}
            disabled={updateStatusMutation.isPending}
            onChange={(event) =>
              updateStatus(event)
            }
            className="cursor-pointer rounded border border-border-grey bg-black px-2 py-1 text-sm capitalize"
          >
            {feedbackStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {updateStatusMutation.isError && (
            <span className="text-xs text-red-300" role="alert">
              The feedback status could not be updated. Please try again.
            </span>
          )}
          {updateStatusMutation.isPending && (
            <span className="text-xs text-gray-400">Updating status…</span>
          )}
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="ml-auto cursor-pointer rounded border border-red-500/60 px-2 py-1 text-sm text-red-300 hover:bg-red-500/10"
            >
              Remove
            </button>
          ) : (
            <div className="ml-auto flex items-center gap-2 text-sm">
              <span>Remove permanently?</span>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="cursor-pointer rounded border border-border-grey px-2 py-1"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={removeFeedbackMutation.isPending}
                onClick={() => removeFeedback(feedback.feedback_id)}
                className="cursor-pointer rounded bg-red-500 px-2 py-1 text-white disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          )}
          {removeFeedbackMutation.isError && (
            <p className="w-full text-xs text-red-300" role="alert">
              The feedback could not be removed. Please try again.
            </p>
          )}
        </div>
      )}
    </li>
  );
};

export const RecentFeedback = () => {
  const feedback = useGetRecentFeedback();

  return (
    <section className="flex min-h-105 flex-col rounded-xl border border-border-grey bg-sidebar-grey p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Recent feedback</h2>
          <p className="mt-1 text-sm text-gray-400">Latest general user comments</p>
        </div>
        {feedback.data && (
          <span className="rounded-full bg-black px-3 py-1 text-sm">
            {feedback.data.length}
          </span>
        )}
      </div>

      {feedback.isLoading && <p className="m-auto text-gray-400">Loading feedback…</p>}
      {feedback.isError && (
        <div className="m-auto text-center" role="alert">
          <p className="text-red-300">Feedback could not be loaded.</p>
          <button
            type="button"
            onClick={() => feedback.refetch()}
            className="mt-2 cursor-pointer text-sm text-lab-turquoise hover:underline"
          >
            Try again
          </button>
        </div>
      )}
      {feedback.data?.length === 0 && (
        <p className="m-auto text-gray-400">No feedback has been submitted yet.</p>
      )}
      {feedback.data && feedback.data.length > 0 && (
        <ul className="mt-3 max-h-80 overflow-y-auto pr-1">
          {feedback.data.slice(0, 8).map((item) => (
            <FeedbackItem key={item.feedback_id} feedback={item} />
          ))}
        </ul>
      )}
    </section>
  );
};
