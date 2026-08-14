import type { ListBuilding } from "./building";
import type { AppTranslation } from "./translation";

// GET /organizations/:orgId/sites?lang=fi
export interface Site {
    id: number;
    address: string;
    image_url: string;
    trl_site_name_key: string;
    trl_site_desc_key: string;
    trl_site_welcome_msg_key: string;
    translations: {
        [lang: string]: AppTranslation[];
    }
}

// part of the response to GET /organizations/:orgId/overview?lang=fi
export interface SiteListItem {
    id: number;
    name: string;
}

// GET /sites/:siteId/overview
export interface SiteOverview {
    site: {
        site_id: number;
        name: string;
        organization: string;
        address: string;
        latitude: string;
        longitude: string;
        img_site_key: string;
        trl_site_name_key: string;
        trl_site_desc_Key: string;
        trl_site_welcome_msg_key: string;
    };
    buildings: ListBuilding[];
    meta: {
        buildings: {
            total: number;
            limit: number;
        }
    };
}
