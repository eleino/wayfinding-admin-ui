import type { AppTranslations, Translation } from "@apptypes/translation";
import apiClient from "./client";
import type { CreateTranslationDto } from "@apptypes/dtos/create-translation.dto";

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


// valid translation types are: app, site_name, site_desc, site_welcome, building_name, building_desc, location_name, at_location_message, location_desc* (not actually used anywhere), approach_instruction, to_next_instruction
export const createTranslation = async (translation: CreateTranslationDto): Promise<Translation> => {
  const response = await apiClient.post(`translations`, {
    json: translation,
  });
  return response.json();
}