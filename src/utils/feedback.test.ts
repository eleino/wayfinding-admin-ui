import { describe, expect, test } from "vitest";
import type { Feedback } from "@apptypes/feedback";
import { combineFeedbackByMostRecent } from "./feedback";

const createFeedback = (feedbackId: number, submittedAt: string): Feedback => ({
  feedback_id: feedbackId,
  feedback_text: `Feedback ${feedbackId}`,
  status: "pending",
  submitted_at: submittedAt,
  updated_at: submittedAt,
});

describe("combineFeedbackByMostRecent", () => {
  test("flattens status groups and orders feedback from newest to oldest", () => {
    const older = createFeedback(1, "2026-08-01T09:00:00.000Z");
    const newest = createFeedback(2, "2026-08-04T09:00:00.000Z");
    const middle = createFeedback(3, "2026-08-02T09:00:00.000Z");
    const groups = [[older, newest], [middle]];

    expect(combineFeedbackByMostRecent(groups)).toEqual([newest, middle, older]);
    expect(groups).toEqual([[older, newest], [middle]]);
  });
});
