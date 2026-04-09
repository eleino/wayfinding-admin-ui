export interface Translation {
    key: string;
    translation_id: number;
    language_code: string;
    type: string;
    text_value: string;
}

export interface AppTranslations {
    fi: AppTranslation[] | null;
    en: AppTranslation[] | null;
}

export interface AppTranslation {
    translation_key: string;
    text_value: string;
}