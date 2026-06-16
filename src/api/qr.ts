import type { QRCode } from "@apptypes/qr";
import apiClient from "./client";

export const getQRCode = async (
  locationId: number,
  pathId?: number,
): Promise<QRCode> => {
  const response = await apiClient.get(`locations/${locationId}/qr${pathId ? `?pathId=${pathId}` : ""}`);
  return response.blob();
};