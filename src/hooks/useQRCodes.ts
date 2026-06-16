import { getQRCode } from "@api/qr";
import { useQuery } from "@tanstack/react-query";

export const useGetQRCode = (locationId: number | null, pathId?: number, options = {}) => {
    if (!locationId) {
        throw new Error("Location ID is required to fetch QR code.");
    }
  const query = useQuery({ queryKey: ["qrCode", locationId, pathId], queryFn: () => getQRCode(locationId, pathId), enabled: !!locationId, ...options });
  return query;
};