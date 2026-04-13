export interface Image {
    key: string;
    url: string;
}
export interface ImageMeta {
    images: {
        limit: string;
        total: number;
    }
}

export interface ImageResponse {
    data: Image[];
    meta: ImageMeta;
}