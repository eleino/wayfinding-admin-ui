import type { AppTranslations, Translation } from "@apptypes/translation";
import apiClient from "./client";

export const fetchTranslationByKey = async (key: string | undefined, lang: string): Promise<Translation> => {
  if (!key) {
    throw new Error("Translation key is required");
  }
  const response = await apiClient.get(`translations/${key}?lang=${lang}`);
  return response.json();
};

export const fetchAllAppTranslations = async (lang: string): Promise<AppTranslations> => {
  const response = await apiClient.get(`translations/app?lang=${lang}`);
  return response.json();
};