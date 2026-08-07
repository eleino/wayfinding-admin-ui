import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchAllAppTranslations,
  fetchTranslationByKey,
  createTranslation,
  updateTranslation,
  deleteTranslation,
} from "@api/translations";
import type { CreateTranslationDto } from "@apptypes/dtos/create-translation.dto";
import type { UpdateTranslationDTO } from "@apptypes/dtos/update-translation.dto";
import { useLanguages } from "./useAppInit";

export const useGetTranslation = (
  key: string | undefined,
  lang: string,
  options = {},
) => {
  const query = useQuery({
    queryKey: ["translation", key, lang],
    queryFn: () => fetchTranslationByKey(key, lang),
    enabled: !!key && !!lang,
    ...options,
  });
  return query;
};

// fetch translations for a given key in all languages
export const useGetTranslationsAllLangs = (
  key: string | undefined,
  options: { enabled?: boolean } = {},
) => {
  const languageList = useLanguages();
  const query = useQuery({
    queryKey: ["translationsAllLangs", key],
    queryFn: async () => {
      if (!languageList.data) return [];
      const langs = languageList.data.map((lang) => lang.code);
      const translations = await Promise.all(
        langs.map((lang) => fetchTranslationByKey(key, lang)),
      );
      return translations;
    },
    ...options,
    enabled: !!key && !!languageList.data && options.enabled !== false,
  });
  return query;
};

export const useGetAppTranslations = (lang: string, options = {}) => {
  const query = useQuery({
    queryKey: ["appTranslations", lang],
    queryFn: () => fetchAllAppTranslations(lang),
    enabled: !!lang,
    ...options,
  });
  return query;
};

export const useGetAppTranslationsAllLangs = (options = {}) => {
  const languageList = useLanguages();
  const query = useQuery({
    queryKey: ["appTranslationsAllLangs"],
    queryFn: async () => {
      if (!languageList.data) return [];
      const langs = languageList.data.map((lang) => lang.code);
      const translations = await Promise.all(
        langs.map((lang) => fetchAllAppTranslations(lang)),
      );
      return translations;
    },
    enabled: !!languageList.data,
    ...options,
  });
  return query;
};

export const useCreateTranslation = (options = {}) => {
  const mutation = useMutation({
    mutationFn: (translation: CreateTranslationDto) =>
      createTranslation(translation),
    ...options,
  });
  return mutation;
};

export const useUpdateTranslation = (options = {}) => {
  const mutation = useMutation({
    mutationFn: ({
      translationKey,
      lang,
      translation,
    }: {
      translationKey: string;
      lang: string;
      translation: UpdateTranslationDTO;
    }) => updateTranslation(translationKey, translation, lang),
    ...options,
  });
  return mutation;
};

export const useDeleteTranslation = (options = {}) => {
  const mutation = useMutation({
    mutationFn: ({
      translationKey,
      lang,
    }: {
      translationKey: string;
      lang: string;
    }) => deleteTranslation(translationKey, lang),
    ...options,
  });
  return mutation;
};
