import type { Feedback } from "@apptypes/feedback";

/**
 * Combines multiple arrays of feedback into a single array, sorted by the most recent submission date.
 * @param feedbackGroups - An array of arrays containing feedback objects.
 * @returns A single array of feedback objects, sorted by the most recent submission date.
 */
export const combineFeedbackByMostRecent = (
  feedbackGroups: Feedback[][],
): Feedback[] =>
  feedbackGroups
    .flat()
    .sort(
      (a, b) =>
        new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime(),
    );
