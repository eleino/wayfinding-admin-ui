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
        [lang: string]: AppTranslation[];
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
        [lang: string]: AppTranslation[];
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
            [lang: string]: AppTranslation[];
        }
    };
    end_locations: EndLocation[];
}

export interface EditLocationInput {
    location_name: string;
    is_entry_location: boolean;
    floor_number: number;
    trl_location_name: {
        lang: string;
        text?: string;
    }[];
    trl_at_current_location_msg: {
        lang: string;
        text?: string;
    }[];
    // trl_location_desc: {
    //     [lang: string]: string;
    // }[];
    imageUrl?: string | null;
    imageFile?: File | undefined;
    removeImage?: boolean;
}

export type AffectedPathReason =
  | "start_location"
  | "end_location"
  | "step_location"
  | "resource_key";

  // GET /locations/:locationId/deletion-impact
export interface LocationDeletionImpact {
  location: {
    location_id: number;
    name: string;
  };
  can_delete_without_cascade: boolean;
  affected_paths: {
    path_id: number;
    name: string;
    reason: AffectedPathReason;
  }[];
  affected_path_steps: {
    path_step_id: number;
    path_id: number;
    location_id: number;
    step_order: number;
  }[];
  obsolete_resources: {
    images: {
      image_key: string;
      type: string;
      file_path: string;
    }[];
    translations: {
      translation_id: number;
      translation_key: string;
      language_code: string;
      type: string;
      text_value: string;
    }[];
    overlays: {
      image_overlay_id: number;
      overlay_key: string;
      image_key: string;
    }[];
  };
  missing_resource_keys: {
    images: string[];
    translations: string[];
    overlays: string[];
  };
  cascade_counts: {
    organization_paths: number;
    feedback: number;
    metrics: number;
  };
}
