import type { SiteListItem } from "./site";
export interface OrganisationType {
    id: string;
    name: string;
    logoUrl: string | null;
}

export interface ChildOrganisation {
    id: string;
    name: string;
}

// Note: on backend these are currently only set for LUT (org 5)
export interface OrgTheme {
    palette: {
        primary: {
            main: string;
        }
        secondary: {
            main: string;
        }
    }
}
export interface OrgSettings {
    organization_id: number;
    logo_image_key_light: string;
    logo_image_key_dark: string;
    theme_json: {
        dark: OrgTheme;
        light: OrgTheme;
        default: string;
    }
}

// GET /organizations/:orgId/overview
export interface OrganisationOverview {
    organization: {
        organization_id: number;
        name: string;
        slug: string;
    };
    children: ChildOrganisation[];
    sites: SiteListItem[];
    settings: OrgSettings;
    meta: {
        sites: {
            total: number;
            limit: number;
        }
    }
}
