import { useGetQRCode } from "@hooks/useQRCodes";
import { useEffect, useMemo, useState } from "react";
import {AlertDialog, type AlertDialogType } from "@components/Forms/AlertDialog";
import { getQRCodeFontSize, populateQRCodePrintDocument } from "./qrCodePrint";

export const QRCode = (props: { locationId: number; pathId?: number }) => {
  const { locationId, pathId } = props;
  const qrCodeQuery = useGetQRCode(locationId, pathId); // returns blob
  const [QRCodeText, setQRCodeText] = useState<string>("Scan QR");
  const [showAlert, setShowAlert] = useState<AlertDialogType | null>(null);

  const MAX_CHARACTERS = 60;
  const PREVIEW_SCALE = 0.3;
  const PREVIEW_WIDTH = 210 * PREVIEW_SCALE;
  const PREVIEW_HEIGHT = 297 * PREVIEW_SCALE;

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

  const handlePrint = () => {
    if (!imgUrl) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.opener = null;
      populateQRCodePrintDocument(printWindow.document, {
        imageUrl: imgUrl,
        label: QRCodeText,
      });
      printWindow.focus();
      // Small timeout to ensure image loads before print dialog
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleCopyImage = () => {
    if (!imgUrl) return;
    fetch(imgUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]);
        setShowAlert({ title: "Qr Code copied", description: "QR code image copied to clipboard!" });
      })
      .catch((err) => {
        console.error("Failed to copy image: ", err);
        setShowAlert({ title: "Error", description: "Failed to copy QR code image." });
      });
  };

  if (qrCodeQuery.isLoading) {
    return <p>Loading QR code...</p>;
  }
  if (qrCodeQuery.isError) {
    return <p>Error loading QR code: {qrCodeQuery.error.message}</p>;
  }

  return (
    <div className="mt-2 flex flex-col gap-1">
      <label>
        Text to display:
        <span className="text-sm text-gray-400 ml-1">
          (max {MAX_CHARACTERS} characters)
        </span>
      </label>
      <input
        type="text"
        className="border border-border-grey bg-black p-1 rounded"
        value={QRCodeText}
        maxLength={MAX_CHARACTERS}
        onChange={(e) => setQRCodeText(e.target.value)}
        onFocus={(e) => e.target.select()}
      />
      <div className="relative">
      <span className="mt-2 text-sm text-gray-400 ml-1">Preview (approximate):</span>
      <div className="border border-border-grey shadow-lg overflow-hidden flex justify-center p-6 bg-sidebar-grey">
        <div
          style={{
            width: `${PREVIEW_WIDTH}mm`,
            height: `${PREVIEW_HEIGHT}mm`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "210mm",
              height: "297mm",
              zoom: PREVIEW_SCALE,
            }}
            className="bg-white text-black p-[20mm] flex flex-col items-center justify-center text-center shadow-md box-border"
          >
            {imgUrl && (
              <>
                <img
                  src={imgUrl}
                  alt="QR Code"
                  style={{ height: "45%", minHeight: "45%", objectFit: "contain", marginTop: "10mm" }}
                />
                <span
                  style={{
                    fontSize: getQRCodeFontSize(QRCodeText),
                    marginTop: "10mm",
                    fontFamily: "sans-serif",
                    overflowWrap: "anywhere",
                    fontWeight: "bold",
                  }}
                >
                  {QRCodeText}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-2 justify-center">
        {showAlert && (
          <AlertDialog
            title={showAlert.title}
            description={showAlert.description}
            onConfirm={() => setShowAlert(null)}
          />
        )}
        <button
          onClick={handlePrint}
          className="p-2 bg-lab-blue text-white rounded w-40 self-center cursor-pointer"
        >
          Print QR Code
        </button>
        <button
          onClick={handleCopyImage}
          className="p-2 bg-lab-blue text-white rounded w-40 self-center cursor-pointer"
        >
          Copy QR Code
        </button>
      </div>
      </div>
    </div>
  );
};
