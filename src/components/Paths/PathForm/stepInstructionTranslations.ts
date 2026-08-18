type InstructionTranslation = { lang: string; text?: string };

export const fillTranslationsForLanguages = (
  languages: Array<{ code: string }> | undefined,
  translations: InstructionTranslation[] | undefined,
): InstructionTranslation[] => {
  if (!languages) return translations ?? [];

  return languages.map(({ code }) => {
    const translation = translations?.find(({ lang }) => lang === code);
    return { lang: code, text: translation?.text ?? "" };
  });
};
