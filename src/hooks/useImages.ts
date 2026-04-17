import { useQuery } from "@tanstack/react-query";
import { fetchAllImagesByType, fetchImagesByType, fetchImagesByTypeAndPage } from "@api/images";

export const useGetImagesByType = (type: string, options = {}) => {
        const query = useQuery({ queryKey: ["images", type], queryFn: () => fetchImagesByType(type), enabled: !!type, ...options });
        return query;
}

export const useGetAllImagesByType = (type: string, options = {}) => {
        const query = useQuery({ queryKey: ["all_images", type], queryFn: () => fetchAllImagesByType(type), ...options });
        return query;
}

export const useGetImagesByTypeAndPage = (type: string, page: number, options = {}) => {
        const query = useQuery({ queryKey: ["images", type, page], queryFn: () => fetchImagesByTypeAndPage(type, page), ...options });
        return query;
}