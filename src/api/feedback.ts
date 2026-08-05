import apiClient from "./client";
import type { Feedback, FeedbackStatus } from "@apptypes/feedback";

export const fetchGeneralFeedback = async (
  status: FeedbackStatus,
): Promise<Feedback[]> => {
  const response = await apiClient.get(`feedback/general?status=${status}`);
  return response.json();
};

export const updateFeedbackStatus = async (
  feedbackId: number,
  status: FeedbackStatus,
): Promise<Feedback> => {
  const response = await apiClient.put(`feedback/${feedbackId}/status`, {
    json: { status },
  });
  return response.json();
};

export const deleteFeedback = async (feedbackId: number): Promise<void> => {
  await apiClient.delete(`feedback/${feedbackId}`);
};
