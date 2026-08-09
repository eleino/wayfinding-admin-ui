export const translationInputClassName =
  "w-full rounded border border-border-grey bg-black px-3 py-2 text-white outline-none focus:border-lab-turquoise";

export const getTranslationErrorMessage = (
  error: unknown,
  fallback: string,
) => (error instanceof Error && error.message ? error.message : fallback);
