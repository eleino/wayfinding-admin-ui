import { useLanguages } from "@hooks/useAppInit";
import { useGetAppTranslationsAllLangs } from "@hooks/useTranslations";
import { useMemo } from "react";

const TranslationsView = () => {
  const languageList = useLanguages();
  const appTranslations = useGetAppTranslationsAllLangs();
  // we want to be able to list all translations for each key
  // so we need to group the translations by key, and then by language
  const groupedTranslations = useMemo(() => {
    if (!appTranslations.data || !languageList.data) return {};
    const grouped: { [key: string]: { [lang: string]: string } } = {};
    for (const langTranslations of appTranslations.data) {
      for (const [lang, translations] of Object.entries(langTranslations)) {
        if (!translations) continue;
        for (const translation of translations) {
          if (!grouped[translation.translation_key]) {
            grouped[translation.translation_key] = {};
          }
          grouped[translation.translation_key][lang] = translation.text_value;
        }
      }
    }
    return grouped;
  }, [appTranslations.data, languageList.data]);

  if (appTranslations.isLoading || languageList.isLoading) {
    return <div>Loading translations...</div>;
  }

  if (appTranslations.isError || languageList.isError) {
    return <div>Error loading translations.</div>;
  }
  if (!appTranslations.data || appTranslations.data.length === 0) {
    return <div>No translations available.</div>;
  }
  if (!languageList.data || languageList.data.length === 0) {
    return <div>No languages available.</div>;
  }
  return (
    <div className="p-5 bg-sidebar-grey">
      <h1>Translations</h1>
      <p className="py-3">Here's a list of the app translations, see Locations and Paths for their specific translations.</p>
      {Object.entries(groupedTranslations).map(([key, translations]) => (
        <div key={key} className="mb-1 p-2 border border-border-grey rounded bg-black">
          <p className="text-lab-turquoise">
            <strong>Key:</strong> {key}
          </p>
          {languageList.data?.map((lang) => (
            <p key={lang.code}>
              <strong>{lang.name}:</strong> {translations[lang.code] || <span className="text-red-500">Translation not available</span>}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};
export default TranslationsView;