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

export interface UploadedImage {
    entity: {
        image_key: string;
        file_path: string;
    },
    url: string;
}