import type { OverlayResponse } from "@apptypes/overlay";
import apiClient from "./client";
import type { CreateOverlayDto } from "@apptypes/dtos/create-overlay.dto";

// overlays are fetched using fetchImagesByType with type "overlay"

export const createOverlay = async (dto: CreateOverlayDto): Promise<OverlayResponse> => {
  const response = await apiClient.post("overlays", {
    json: dto
  });
  return response.json();
};

export const updateOverlay = async (overlayKey: string, dto: Partial<CreateOverlayDto>): Promise<OverlayResponse> => {
  const response = await apiClient.put(`overlays/${overlayKey}`, {
    json: dto
  });
  return response.json();
};

export const deleteOverlay = async (overlayKey: string): Promise<void> => {
  await apiClient.delete(`overlays/${overlayKey}`);
};