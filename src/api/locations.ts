import type { CreateLocationDTO } from "@apptypes/dtos/create-location.dto";
import apiClient from "./client";
import type { EntranceLocation, ListLocation, Location, LocationDeletionImpact, LocationDestinations, LocationWithImage } from "@apptypes/location";
import type { UpdateLocationDTO } from "@apptypes/dtos/update-location.dto";

// Fetches locations in a building (GET /buildings/:id/locations)
// TODO: implement pagination?
export const fetchLocations = async (
  building_id: number | undefined,
): Promise<ListLocation[]> => {
  if (!building_id) {
    throw new Error("Building ID is required to fetch locations.");
  }
  const response = await apiClient.get(`buildings/${building_id}/locations?page=1&limit=1000`);
  const json: { data: ListLocation[] } = await response.json();
  return json.data;
};

export const fetchLocationById = async (id: number|undefined): Promise<LocationWithImage> => {
  if (!id) {
    throw new Error("Location ID is required to fetch location details.");
  }
  const response = await apiClient.get(`locations/${id}/overview`);
  return response.json();
};

export const fetchLocationDestinations = async (
  id: number | undefined,
  lang?: string,
  accessibility_level?: string,
): Promise<LocationDestinations> => {
  if (!id) {
    throw new Error("Location ID is required to fetch available destinations.");
  }
  // parameters are lang, accessibility_level, and optionally org_id
  const response = await apiClient.get(
    `locations/${id}/destinations?lang=${lang}&accessibility_level=${accessibility_level}`,
  );
  return response.json();
};

export const fetchEntryLocations = async (
  building_id: number | undefined, lang = "fi"
): Promise<EntranceLocation[]> => {
  if (!building_id) {
    throw new Error("Building ID is required to fetch entry locations.");
  }
  const response = await apiClient.get(`buildings/${building_id}/enterances?lang=${lang}`);
  return response.json();
};

export const createLocation = async (
  building_id: number | undefined,
  location: CreateLocationDTO,
): Promise<Location> => {
  const response = await apiClient.post(`buildings/${building_id}/locations`, {
    json: location,
  });
  return response.json();
};

export const updateLocation = async (
  id: number | undefined,
  location: UpdateLocationDTO,
): Promise<Location> => {
  const response = await apiClient.put(`locations/${id}`, {
    json: location,
  });
  return response.json();
};

export const fetchLocationDeletionImpact = async (
  id: number,
): Promise<LocationDeletionImpact> => {
  const response = await apiClient.get(`locations/${id}/deletion-impact`);
  return response.json();
};

export const deleteLocation = async (
  id: number,
  cascadePaths = false,
): Promise<void> => {
  await apiClient.delete(
    `locations/${id}?cascadePaths=${cascadePaths ? "true" : "false"}`,
  );
};
