import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchAllAppTranslations, fetchTranslationByKey, createTranslation, updateTranslation, deleteTranslation } from "@api/translations";
import type { HTTPError } from "ky";
import type { CreateTranslationDto } from "@apptypes/dtos/create-translation.dto";
import type { UpdateTranslationDTO } from "@apptypes/dtos/update-translation.dto";

// TODO: make app language-agnostic, there can be languages beyond en+fi
// a potential compromise to displaying all translations for all languages is to allow selecting 1 language
// and displaying that + finnish translations
// we receive list of languages from 
// GET /init/app
/* which returns:
{
    "settings": {
        "id": 1,
        "default_language": "fi",
        "maintenance_mode": false,
        "app_name": "Wayfinding",
        "version": "0.1.0",
        "created_at": "2025-09-22T06:55:20.117Z",
        "updated_at": "2025-09-22T06:55:20.117Z"
    },
    "languages": [
        {
            "code": "en",
            "name": "English"
        },
        {
            "code": "fi",
            "name": "Finnish"
        }
    ]
}
    */

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

export const useUpdateTranslation = (options = {}) => {
    const mutation = useMutation({
        mutationFn: ({ translationKey, lang, translation }: { translationKey: string; lang: string; translation: UpdateTranslationDTO }) => updateTranslation(translationKey, translation, lang),
        ...options,
    });
    return mutation;
}

export const useDeleteTranslation = (options = {}) => {
    const mutation = useMutation({
        mutationFn: ({ translationKey, lang }: { translationKey: string; lang: string }) => deleteTranslation(translationKey, lang),
        ...options,
    });
    return mutation;
}