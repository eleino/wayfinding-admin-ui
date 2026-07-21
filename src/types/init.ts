
export interface AppInitSettings {
    id: number;
    default_language: string;
    maintenance_mode: boolean;
    app_name: string;
    version: string;
    created_at: string;
    updated_at: string;
}

export interface AppInitLanguage {
    code: string;
    name: string;
}

// GET /init/app
export interface AppInit {
    settings: AppInitSettings;
    languages: AppInitLanguage[];
}