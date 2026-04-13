import { useQuery } from "@tanstack/react-query";
import { fetchAllImagesByType, fetchImagesByType } from "@api/images";

export const useGetImagesByType = (type: string) => {
        const query = useQuery({ queryKey: ["images", type], queryFn: () => fetchImagesByType(type) });
        return query;
}

export const useGetAllImagesByType = (type: string) => {
        const query = useQuery({ queryKey: ["all_images", type], queryFn: () => fetchAllImagesByType(type) });
        return query;
}