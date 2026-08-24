import {
  deleteFeedback,
  fetchGeneralFeedback,
  fetchPathFeedback,
  updateFeedbackStatus,
} from "@api/feedback";
import type { FeedbackStatus } from "@apptypes/feedback";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { combineFeedbackByMostRecent } from "@utils/feedback";

const feedbackQueryKey = ["feedback"];

/**
 * Custom hook to fetch recent feedback from the API.
 * It retrieves feedback for all statuses and combines them into a single array,
 * sorted by the most recent submission date.
 * @returns An object containing the query result, including data, loading state, and error state.
 */
export const useGetRecentFeedback = () =>
  useQuery({
    queryKey: feedbackQueryKey,
    queryFn: () =>
      Promise.all([fetchGeneralFeedback(), fetchPathFeedback()]),
    select: combineFeedbackByMostRecent,
  });

/**
 * Custom hook to update the status of a feedback item.
 * It uses a mutation to send the update request to the API and invalidates the feedback query on success.
 * @returns An object containing the mutation result, including status, error state, and mutation function.
 */
export const useUpdateFeedbackStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      feedbackId,
      status,
    }: {
      feedbackId: number;
      status: FeedbackStatus;
    }) => updateFeedbackStatus(feedbackId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: feedbackQueryKey }),
  });
};

/**
 * Custom hook to delete a feedback item.
 * It uses a mutation to send the delete request to the API and invalidates the feedback query on success.
 * @returns An object containing the mutation result, including status, error state, and mutation function.
 */
export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFeedback,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: feedbackQueryKey }),
  });
};
