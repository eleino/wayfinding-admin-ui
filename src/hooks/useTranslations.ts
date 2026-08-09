import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export const useCreateTranslationKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      translationKey,
      type,
      translations,
    }: {
      translationKey: string;
      type: string;
      translations: Array<
        Pick<CreateTranslationDto, "language_code" | "text_value">
      >;
    }) => {
      const filledTranslations = translations.filter(
        (translation) => translation.text_value.trim().length > 0,
      );
      return Promise.all(
        filledTranslations.map((translation) =>
          createTranslation({
            translation_key: translationKey,
            type,
            ...translation,
          }),
        ),
      );
    },
    onSuccess: (_data, { translationKey, type }) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["translation", translationKey],
        }),
        queryClient.invalidateQueries({
          queryKey: ["translationsAllLangs", translationKey],
        }),
        ...(type === "app"
          ? [
              queryClient.invalidateQueries({
                queryKey: ["appTranslationsAllLangs"],
              }),
            ]
          : []),
      ]),
  });
};

export const useSaveTranslationKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      translationKey,
      type,
      existingTranslations,
      translations,
    }: {
      translationKey: string;
      type: string;
      existingTranslations: Record<string, string>;
      translations: Array<
        Pick<CreateTranslationDto, "language_code" | "text_value">
      >;
    }) => {
      const filledTranslations = translations.filter(
        (translation) => translation.text_value.trim().length > 0,
      );
      const newTranslations = filledTranslations.filter(
        (translation) =>
          existingTranslations[translation.language_code] === undefined,
      );
      // filter out translations that haven't changed
      const changedTranslations = filledTranslations.filter((translation) => {
        const existingText = existingTranslations[translation.language_code];
        return (
          existingText !== undefined && existingText !== translation.text_value
        );
      });

      return Promise.all([
        ...newTranslations.map((translation) =>
          createTranslation({
            translation_key: translationKey,
            type,
            ...translation,
          }),
        ),
        ...changedTranslations.map((translation) =>
          updateTranslation(
            translationKey,
            { text_value: translation.text_value },
            translation.language_code,
          ),
        ),
      ]);
    },
    onSettled: (_data, _error, { translationKey, type }) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["translation", translationKey],
        }),
        queryClient.invalidateQueries({
          queryKey: ["translationsAllLangs", translationKey],
        }),
        ...(type === "app"
          ? [
              queryClient.invalidateQueries({
                queryKey: ["appTranslationsAllLangs"],
              }),
            ]
          : []),
      ]),
  });
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

export const useDeleteTranslationKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      translationKey,
      languageCodes,
    }: {
      translationKey: string;
      languageCodes: string[];
    }) => {
      await Promise.all(
        languageCodes.map((lang) => deleteTranslation(translationKey, lang)),
      );
    },
    onSuccess: (_, { translationKey }) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["translation", translationKey],
        }),
        queryClient.invalidateQueries({
          queryKey: ["translationsAllLangs", translationKey],
        }),
        queryClient.invalidateQueries({
          queryKey: ["appTranslationsAllLangs"],
        }),
      ]),
  });
};
