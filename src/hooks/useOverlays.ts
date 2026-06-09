import { useMutation } from "@tanstack/react-query";
import { createOverlay, updateOverlay, deleteOverlay } from "@api/overlays";
import type { CreateOverlayDto } from "@apptypes/dtos/create-overlay.dto";

export const useCreateOverlay = (options = {}) => {
  const mutation = useMutation({
    mutationFn: (dto: CreateOverlayDto) => createOverlay(dto),
    ...options
  });
  return mutation;
};

export const useUpdateOverlay = (options = {}) => {
  const mutation = useMutation({
    mutationFn: ({ overlayKey, dto }: { overlayKey: string, dto: Partial<CreateOverlayDto> }) => updateOverlay(overlayKey, dto),
    ...options
  });
  return mutation;
};

export const useDeleteOverlay = (options = {}) => {
  const mutation = useMutation({
    mutationFn: (overlayKey: string) => deleteOverlay(overlayKey),
    ...options
  });
  return mutation;
}