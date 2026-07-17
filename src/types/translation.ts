// response to POST /translations, and GET|PUT /translations/:key?lang=fi
export interface Translation {
    translation_key: string;
    translation_id: number;
    language_code: string;
    type: string | null;
    text_value: string;
}

export interface AppTranslations {
    [lang: string]: AppTranslation[] | null;
}

export interface AppTranslation {
    translation_key: string;
    text_value: string;
}