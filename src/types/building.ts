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

// returned by GET /sites/:siteId/buildings
export interface ListBuilding {
  id: number;
  name: string;
}

// returned by GET /sites/:siteId/buildings/names
export interface ListBuildingNamesAPI {
  building_id: number;
  image_url: string | null;
  trl_building_name_key: string;
  translations: {
    fi?: [
      {
        translation_key: string;
        text_value: string;
      }
    ],
    en?: [
      {
        translation_key: string;
        text_value: string;
      }
    ]
  };
}