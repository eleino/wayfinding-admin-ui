import type { ListLocation } from "./location";
import type { Path } from "./path";
import type { AppTranslation } from "./translation";

export interface BuildingType {
  id: number;
  name: string;
  site_id: number;
  total_floors: number;
  image_url: string | null;
  trl_building_name_key: string;
  trl_building_desc_key: string;
  allowed_organizations: {
    organization_id: number;
    name: string;
  }[];
}

export interface ListBuilding {
  id: number;
  name: string;
  image_url: string | null;
}

// returned by GET /sites/:siteId/buildings
export interface Buildings {
  data: ListBuilding[];
  meta: {
    buildings: {
      limit: number;
      total: number;
    }
  }
}

// returned by GET /sites/:siteId/buildings/names
export interface ListBuildingNamesAPI {
  building_id: number;
  image_url: string | null;
  trl_building_name_key: string;
  translations: {
    [lang: string]: AppTranslation[];
  };
}

// GET /buildings/:buildingId/overview
export interface BuildingOverview {
  building: {
    building_id: number;
    name: string;
    site_id: number;
    total_floors: number;
    img_building_key: string | null;
    trl_building_name_key: string;
    trl_building_desc_key: string;
    allowed_organizations: {
      organization_id: number;
      name: string;
    }[];
  };
  locations: ListLocation[];
  paths: Path[];
  meta: {
    locations: {
      total: number;
      limit: number;
    },
    paths: {
      total: number;
      limit: number;
    }
  };
};

// POST /sites/:siteId/buildings
export interface BuildingCreationResponse {
    building_id: number;
    name: string;
    site_id: number;
    total_floors: number;
    img_building_key: string;
    trl_building_name_key: string;
    trl_building_desc_key: string;
    allowed_organizations: {
        organization_id: number;
        name: string;
    }[];
}
