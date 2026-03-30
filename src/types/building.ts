export interface BuildingType {
  id: number;
  name: string;
  site_id: number;
  total_floors: number;
  trl_building_name_key: string;
  trl_building_desc_key: string;
  allowed_organizations: {
    organization_id: number;
    name: string;
  }[];
}
