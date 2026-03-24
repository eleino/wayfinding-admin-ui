import type { CreateLocationDTO } from '@apptypes/dtos/create-location.dto';
import apiClient from './client';
import type { LocationType } from '@apptypes/location';
import type { UpdateLocationDTO } from '@apptypes/dtos/update-location.dto';

// Fetches locations in a building (GET /buildings/:id/locations)
export const fetchLocations = async (building_id: number): Promise<LocationType[]> => {
  const response = await apiClient.get(`buildings/${building_id}/locations`);
  return response.json();
}

export const fetchLocationById = async (id: string): Promise<LocationType> => {
  const response = await apiClient.get(`locations/${id}`);
  return response.json();
}

export const fetchLocationDestinations = async (id: string, lang?: string, accessibility_level?: string): Promise<LocationType[]> => {
    // parameters are lang, accessibility_level, and optionally org_id
  const response = await apiClient.get(`locations/${id}/available-destinations?lang=${lang}&accessibility_level=${accessibility_level}`);
  return response.json();
}

export const createLocation = async (building_id: number, location: CreateLocationDTO): Promise<LocationType> => {
  const response = await apiClient.post(`buildings/${building_id}/locations`, { body: JSON.stringify(location) });
  return response.json();
}

export const updateLocation = async (id: string, location: UpdateLocationDTO): Promise<LocationType> => {
  const response = await apiClient.put(`locations/${id}`, { body: JSON.stringify(location) });
  return response.json();
}

export const deleteLocation = async (id: string): Promise<void> => {
  await apiClient.delete(`locations/${id}`);
}