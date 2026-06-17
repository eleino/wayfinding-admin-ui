import { useGetQRCode } from "@hooks/useQRCodes";
import { useEffect, useMemo, useState } from "react";

export const QRCode = (props: { locationId: number; pathId?: number }) => {
  const { locationId, pathId } = props;
  const qrCodeQuery = useGetQRCode(locationId, pathId); // returns blob
  const [QRCodeText, setQRCodeText] = useState<string>("");

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

  // Calculate font size based on text length
  const getFontSize = (text: string) => {
    const length = text.length || 1;
    const baseSize = 96;
    const calculatedSize = Math.max(
      56,
     baseSize - (length * 0.8),
    );
    return `${calculatedSize}pt`;
  };

  const a4Styles = `
    width: 210mm;
    height: 297mm;
    padding: 20mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background: white;
    color: black;
    text-align: center;
  `;

  const handlePrint = () => {
    if (!imgUrl) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const htmlContent = `
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              @page { size: A4; margin: 0; }
              body { margin: 0; display: flex; justify-content: center; }
              .a4-container { ${a4Styles} }
              .qr-image { 
                max-width: 100%; 
                height: 45%; 
                object-fit: contain;
                margin-top: 10mm;
              }
              .label-text { 
                margin-top: 10mm;
                font-family: sans-serif;
                font-size: ${getFontSize(QRCodeText)};
                overflow-wrap: anywhere;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="a4-container">
              <img src="${imgUrl}" class="qr-image" />
              <span class="label-text">${QRCodeText}</span>
            </div>
          </body>
        </html>
    `;
      printWindow.document.documentElement.innerHTML = htmlContent;
      printWindow.document.close();
      printWindow.focus();
      // Small timeout to ensure image loads before print dialog
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
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
      />
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
                    fontSize: getFontSize(QRCodeText),
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

      <button
        onClick={handlePrint}
        className="mt-2 p-2 bg-lab-blue text-white rounded w-40 self-center"
      >
        Print QR Code
      </button>
    </div>
  );
};
