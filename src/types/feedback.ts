export const feedbackStatuses = ["pending", "viewed", "resolved"] as const;

export type FeedbackStatus = (typeof feedbackStatuses)[number];

interface FeedbackBase {
  feedback_id: number;
  feedback_text: string;
  status: FeedbackStatus;
  submitted_at: string;
  updated_at: string;
}

export interface GeneralFeedback extends FeedbackBase {
  feedback_type: "general";
}

export interface PathFeedback extends FeedbackBase {
  feedback_type: "path";
  path_id: number;
}

export type Feedback = GeneralFeedback | PathFeedback;
