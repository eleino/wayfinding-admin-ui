import { useQuery } from "@tanstack/react-query";
import { fetchImagesByType } from "@api/images";

export const useGetImagesByType = (type: string) => {
        const query = useQuery({ queryKey: ["images", type], queryFn: () => fetchImagesByType(type) });
        return query;
}