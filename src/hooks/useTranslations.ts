import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchAllAppTranslations, fetchTranslationByKey, createTranslation } from "@api/translations";
import type { HTTPError } from "ky";
import type { CreateTranslationDto } from "@apptypes/dtos/create-translation.dto";

export const useGetTranslation = (key: string | undefined, lang: string, options = {}) => {
    const query = useQuery({ queryKey: ["translation", key, lang], queryFn: () => fetchTranslationByKey(key, lang), enabled: !!key && !!lang, ...options });
    return query;
};

// for fetching both en and fi translations for a given key at the same time
export const useGetTranslationsEnFi = (key: string | undefined, options = {}) => {
    const query = useQuery({ queryKey: ["translationsEnFi", key], queryFn: () => Promise.all([fetchTranslationByKey(key, "en"), fetchTranslationByKey(key, "fi")]), enabled: !!key,
    retry: retryOn404, ...options });
    return query;
};

export const useGetAppTranslations = (lang: string, options = {}) => {
    const query = useQuery({ queryKey: ["appTranslations", lang], queryFn: () => fetchAllAppTranslations(lang), enabled: !!lang, ...options });
    return query;
}

const retryOn404 = (failureCount: number, error: HTTPError) => {
    if (error?.response.status === 404) return false;
    return failureCount < 3; // Retry up to 3 times for non-404 errors
}

export const useCreateTranslation = (options = {}) => {
    const mutation = useMutation({
        mutationFn: (translation: CreateTranslationDto) => createTranslation(translation),
        ...options,
    });
    return mutation;
}