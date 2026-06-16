import { useGetQRCode } from "@hooks/useQRCodes";
import { useEffect, useMemo } from "react";

export const QRCode = (props: { locationId: number; pathId?: number }) => {
  const { locationId, pathId } = props;
  const qrCodeQuery = useGetQRCode(locationId, pathId); // returns blob

const imgUrl = useMemo(() => {
  if (!qrCodeQuery.data) return null;
  return URL.createObjectURL(qrCodeQuery.data);
}, [qrCodeQuery.data]);

// Clean up the URL when the component unmounts or data changes
useEffect(() => {
  return () => {
    if (imgUrl) URL.revokeObjectURL(imgUrl);
  };
}, [imgUrl]);

  if (qrCodeQuery.isLoading) {
    return <p>Loading QR code...</p>;
  }
  if (qrCodeQuery.isError) {
    return <p>Error loading QR code: {qrCodeQuery.error.message}</p>;
  }

  return (
    <div className="mt-2">
      {imgUrl && (
        <div>
          <img src={imgUrl} alt="QR Code" />


        </div>
      )}
    </div>
  );
};
