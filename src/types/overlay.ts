
// response to POST /overlays
export interface OverlayResponse {
    image_overlay_id: number;
    overlay_key: string;
    overlay_image_url: string;
    position_x_percent: number;
    position_y_percent: number;
    overlay_size: number;
    rotation_deg: number;
    rotation_x_deg: number;
}
