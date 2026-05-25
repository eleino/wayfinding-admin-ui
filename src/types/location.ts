import type { AppTranslation } from "./translation";

export interface Location {
    location_id: number;
    name: string;
    building_id: number;
    is_entry_location: boolean;
    qr_url: string | null;
    img_location_key: string;
    floor_number: number;
    trl_location_name_key: string;
    trl_current_location_msg_key: string;
    trl_location_desc_key: string;
}
export interface LocationImage {
    url: string | null;
    overlay: string | null;
}

// GET /locations/:locationId/overview
export interface LocationWithImage {
    location: Location;
    image: LocationImage | null;
}

// GET /buildings/:buildingId/locations
export interface ListLocation {
    id: number;
    name: string;
}

// GET /buildings/:buildingId/enterances?lang=fi
export interface EntranceLocation {
    location_id: number;
    image_url: string;
    trl_location_name_key: string;
    translations: {
        fi?: AppTranslation[];
        en?: AppTranslation[];
    }
}

export interface EndLocation {
    path_id: number;
    step_order: number;
    distance_meters: number|null;
    estimated_time_minutes: number;
    video_instruction_url: string;
    location_id: number;
    is_exit: boolean;
    trl_location_name_key: string;
    translations: {
        fi?: AppTranslation;
        en?: AppTranslation;
    }
}

// GET /locations/:location_id/destinations?accessibility_level=0&lang=fi&org_id=1
// accessibility_level and lang must be included in the query params
export interface LocationDestinations {
    current_location:
    {
        location_id: number;
        image_url: string;
        trl_current_location_msg_key: string;
        translations: {
            fi?: AppTranslation;
            en?: AppTranslation;
        }
    };
    end_locations: EndLocation[];
}

// GET /locations/:locationId/qr
// or
// GET /locations/:locationId/qr?pathId=2
// QR code is returned as image/png content type
export type LocationQR = Blob | null;

export interface EditLocationInput {
    location_name: string;
    // building_id: number;
    is_entry_location: boolean;
    floor_number: number;
    trl_location_name_en: string;
    trl_location_name_fi: string;
    trl_at_current_location_msg_en: string;
    trl_at_current_location_msg_fi: string;
    imageUrl?: string | null;
    imageFile?: File | undefined;
}