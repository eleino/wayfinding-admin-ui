import { TranslationsManager } from "@components/Translations/TranslationsManager";
import { useLanguages } from "@hooks/useAppInit";
import { useGetAppTranslationsAllLangs } from "@hooks/useTranslations";

const TranslationsView = () => {
  const languageList = useLanguages();
  const appTranslations = useGetAppTranslationsAllLangs();

  if (appTranslations.isLoading || languageList.isLoading) {
    return <div>Loading translations...</div>;
  }
  if (appTranslations.isError || languageList.isError) {
    return <div role="alert">Error loading translations.</div>;
  }
  if (!languageList.data || languageList.data.length === 0) {
    return <div>No languages available.</div>;
  }

  return (
    <main className="min-h-full w-full min-w-0 p-5">
      <h1>Translations</h1>
      <p className="mb-5">
        Manage app translations here. Location and path-specific translations
        are managed in their own views.
      </p>
      <TranslationsManager
        languages={languageList.data}
        translationsByLanguage={appTranslations.data ?? []}
      />
    </main>
  );
};

export default TranslationsView;
