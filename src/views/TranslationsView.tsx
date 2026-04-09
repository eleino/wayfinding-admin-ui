import { useGetAppTranslations } from "@hooks/useTranslations";

const TranslationsView = () => {
  const finnishTranslations = useGetAppTranslations("fi");
  const englishTranslations = useGetAppTranslations("en");

  if (finnishTranslations.isLoading || englishTranslations.isLoading) {
    return <div>Loading translations...</div>;
  }

  if (finnishTranslations.isError || englishTranslations.isError) {
    return <div>Error loading translations.</div>;
  }
  return (
    <div className="p-5 bg-sidebar-grey">
      <h1>Translations</h1>
      <p className="py-3">Here's a list of the generic app translations, see Locations and Paths for their specific translations.</p>
      {finnishTranslations.data?.fi!.map((translation) => {
        const englishTranslation = englishTranslations.data?.en!.find(
          (en) => en.translation_key === translation.translation_key,
        );
        return (
          <div key={translation.translation_key} className="mb-4 p-2 border border-gray-300 rounded">
            <p>
              <strong>Key:</strong> {translation.translation_key}
            </p>
            <p>
              <strong>Finnish:</strong> {translation.text_value}
            </p>
            <p>
              <strong>English:</strong>{" "}
              {englishTranslation ? englishTranslation.text_value : "N/A"}
            </p>
          </div>
        );
      })}
    </div>
  );
};
export default TranslationsView;