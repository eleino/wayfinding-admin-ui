import type { Translation } from "@apptypes/translation";
import apiClient from "./client";

export const fetchTranslationByKey = async (key: string | undefined, lang: string): Promise<Translation> => {
  if (!key) {
    throw new Error("Translation key is required");
  }
  const response = await apiClient.get(`translations/${key}?lang=${lang}`);
  return response.json();
};