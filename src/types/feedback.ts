export const feedbackStatuses = ["pending", "viewed", "resolved"] as const;

export type FeedbackStatus = (typeof feedbackStatuses)[number];

// status: "pending" | "viewed" | "resolved"
// GET /feedback/general?status=pending
export interface Feedback {
  feedback_id: number;
  feedback_text: string;
  status: FeedbackStatus;
  submitted_at: string;
  updated_at: string;
}
