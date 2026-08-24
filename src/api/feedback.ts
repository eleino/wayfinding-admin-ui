import apiClient from "./client";
import type {
  Feedback,
  FeedbackStatus,
  GeneralFeedback,
  PathFeedback,
} from "@apptypes/feedback";

type GeneralFeedbackResponse = Omit<GeneralFeedback, "feedback_type">;
type PathFeedbackResponse = Omit<PathFeedback, "feedback_type">;

export const fetchGeneralFeedback = async (): Promise<Feedback[]> => {
  const response = await apiClient.get("feedback/general");
  const feedback = await response.json<GeneralFeedbackResponse[]>();
  return feedback.map((item) => ({ ...item, feedback_type: "general" }));
};

export const fetchPathFeedback = async (): Promise<Feedback[]> => {
  const response = await apiClient.get("feedback/paths");
  const feedback = await response.json<PathFeedbackResponse[]>();
  return feedback.map((item) => ({ ...item, feedback_type: "path" }));
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
