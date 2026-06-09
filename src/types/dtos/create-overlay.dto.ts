export interface CreateOverlayDto {
    overlay_key: string;
    image_key: string;
    position_x_percent: number;
    position_y_percent: number;
    overlay_size: number;
    rotation_deg: number;
    rotation_x_deg: number;
}