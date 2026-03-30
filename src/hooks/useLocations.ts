import { useQuery } from "@tanstack/react-query"
import { fetchLocationById, fetchLocationDestinations, fetchLocations } from "@api/locations";

// so we need orgid to fetch siteid, and siteid to fetch buildingid, and buildingid to fetch locations
// so maybe a selection list for org, site, building, and then fetch locations based on building selection?
export const useFetchLocations = (buildingId: number|null, options = {}) => {
    const query = useQuery({ queryKey: ["locations", buildingId], queryFn: () => fetchLocations(buildingId), enabled: !!buildingId, ...options });
    return query;
}

export const useFetchLocationById = (id: number|null, options = {}) => {
    const query = useQuery({ queryKey: ["location", id], queryFn: () => fetchLocationById(id), enabled: !!id, ...options });
    return query;
}

export const useFetchLocationDestinations = (id: number|null, lang?: string, accessibility_level?: string, options = {}) => {
    const query = useQuery({ queryKey: ["locationDestinations", id, lang, accessibility_level], queryFn: () => fetchLocationDestinations(id, lang, accessibility_level), enabled: !!id, ...options });
    return query;
}