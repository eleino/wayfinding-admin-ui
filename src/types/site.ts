export interface SiteTranslations {
    translation_key: string;
    text_value: string;
}
export interface Site {
    id: number;
    address: string;
    image_url: string;
    trl_site_name_key: string;
    trl_site_desc_key: string;
    trl_site_welcome_msg_key: string;
    translations: {
        fi?: SiteTranslations[];
        en?: SiteTranslations[];
    }
}

export interface SiteListItem {
    id: number;
    name: string;
}
