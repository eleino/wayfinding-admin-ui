export interface Location {
    id: number;
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
    url: string;
    overlay: string | null;
}

export interface LocationWithImage {
    location: Location;
    image: LocationImage | null;
}