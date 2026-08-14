import { http, HttpResponse } from "msw";
import type { CreateTranslationDto } from "@apptypes/dtos/create-translation.dto";
import type { UpdateTranslationDTO } from "@apptypes/dtos/update-translation.dto";

type StoredTranslation = CreateTranslationDto & { translation_id: number };

const initialTranslations: StoredTranslation[] = [
  {
    translation_id: 1,
    translation_key: "APP_WELCOME",
    language_code: "fi",
    type: "app",
    text_value: "Tervetuloa",
  },
  {
    translation_id: 2,
    translation_key: "APP_WELCOME",
    language_code: "en",
    type: "app",
    text_value: "Welcome",
  },
  {
    translation_id: 3,
    translation_key: "APP_FINNISH_ONLY",
    language_code: "fi",
    type: "app",
    text_value: "Vain suomeksi",
  },
  {
    translation_id: 4,
    translation_key: "LOCATION_12_NAME",
    language_code: "fi",
    type: "location_name",
    text_value: "Kirjasto",
  },
  {
    translation_id: 5,
    translation_key: "CURRENT_LOCATION_12_MSG",
    language_code: "fi",
    type: "at_location_message",
    text_value: "Olet kirjastossa",
  },
  {
    translation_id: 6,
    translation_key: "STEP_9_APPROACH",
    language_code: "fi",
    type: "approach_instruction",
    text_value: "Käänny vasemmalle",
  },
  {
    translation_id: 7,
    translation_key: "STEP_9_NEXT",
    language_code: "fi",
    type: "to_next_instruction",
    text_value: "Jatka eteenpäin",
  },
  {
    translation_id: 8,
    translation_key: "SITE_10_NAME",
    language_code: "fi",
    type: "site_name",
    text_value: "Pääkampus",
  },
  {
    translation_id: 9,
    translation_key: "SITE_10_NAME",
    language_code: "en",
    type: "site_name",
    text_value: "Main Site",
  },
  {
    translation_id: 10,
    translation_key: "SITE_10_DESC",
    language_code: "fi",
    type: "site_desc",
    text_value: "Kampuksen kuvaus",
  },
  {
    translation_id: 11,
    translation_key: "SITE_10_WELCOME",
    language_code: "fi",
    type: "site_welcome",
    text_value: "Tervetuloa kampukselle",
  },
  {
    translation_id: 12,
    translation_key: "SITE_10_WELCOME",
    language_code: "en",
    type: "site_welcome",
    text_value: "Welcome to campus",
  },
  {
    translation_id: 13,
    translation_key: "BUILDING_100_NAME",
    language_code: "fi",
    type: "building_name",
    text_value: "Päärakennus",
  },
  {
    translation_id: 14,
    translation_key: "BUILDING_100_NAME",
    language_code: "en",
    type: "building_name",
    text_value: "Main Building",
  },
  {
    translation_id: 15,
    translation_key: "BUILDING_100_DESC",
    language_code: "fi",
    type: "building_desc",
    text_value: "Rakennuksen kuvaus",
  },
];

let translations = initialTranslations.map((translation) => ({
  ...translation,
}));

export const translationRequests = {
  created: [] as CreateTranslationDto[],
  updated: [] as Array<{
    translationKey: string;
    languageCode: string;
    textValue: string;
  }>,
  deleted: [] as Array<{ translationKey: string; languageCode: string }>,
};

export const resetTranslationMockData = () => {
  translations = initialTranslations.map((translation) => ({
    ...translation,
  }));
  translationRequests.created = [];
  translationRequests.updated = [];
  translationRequests.deleted = [];
};

export const translationHandlers = [
  http.get("*/init/app", () =>
    HttpResponse.json({
      settings: {
        id: 1,
        default_language: "fi",
        maintenance_mode: false,
        app_name: "Wayfinding",
        version: "1.0.0",
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
      languages: [
        { code: "fi", name: "Finnish" },
        { code: "en", name: "English" },
      ],
    }),
  ),

  http.get("*/translations/app", ({ request }) => {
    const languageCode = new URL(request.url).searchParams.get("lang") ?? "fi";
    return HttpResponse.json({
      [languageCode]: translations
        .filter(
          (translation) =>
            translation.type === "app" &&
            translation.language_code === languageCode,
        )
        .map(({ translation_key, text_value }) => ({
          translation_key,
          text_value,
        })),
    });
  }),

  http.get("*/translations/:key", ({ params, request }) => {
    const languageCode =
      new URL(request.url).searchParams.get("lang") ?? "fi";
    const translation = translations.find(
      (item) =>
        item.translation_key === String(params.key) &&
        item.language_code === languageCode,
    );
    return translation
      ? HttpResponse.json(translation)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.post("*/translations", async ({ request }) => {
    const body = (await request.json()) as CreateTranslationDto;
    translationRequests.created.push(body);
    const translation = {
      ...body,
      translation_id: Math.max(0, ...translations.map((item) => item.translation_id)) + 1,
    };
    translations.push(translation);
    return HttpResponse.json(translation, { status: 201 });
  }),

  http.put("*/translations/:key", async ({ params, request }) => {
    const languageCode =
      new URL(request.url).searchParams.get("lang") ?? "fi";
    const body = (await request.json()) as UpdateTranslationDTO;
    const translationKey = String(params.key);
    translationRequests.updated.push({
      translationKey,
      languageCode,
      textValue: body.text_value,
    });
    const translation = translations.find(
      (item) =>
        item.translation_key === translationKey &&
        item.language_code === languageCode,
    );
    if (!translation) return new HttpResponse(null, { status: 404 });
    translation.text_value = body.text_value;
    return HttpResponse.json(translation);
  }),

  http.delete("*/translations/:key", ({ params, request }) => {
    const languageCode =
      new URL(request.url).searchParams.get("lang") ?? "fi";
    const translationKey = String(params.key);
    translationRequests.deleted.push({ translationKey, languageCode });
    translations = translations.filter(
      (item) =>
        item.translation_key !== translationKey ||
        item.language_code !== languageCode,
    );
    return new HttpResponse(null, { status: 204 });
  }),
];
