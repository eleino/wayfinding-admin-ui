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

// response from GET /images/:type
export interface ImageResponse {
    data: Image[];
    meta: ImageMeta;
}

// response from POST /images/upload
export interface UploadedImage {
    entity: {
        image_key: string;
        file_path: string;
    },
    url: string;
}