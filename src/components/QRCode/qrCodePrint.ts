interface QRCodePrintDocumentOptions {
  imageUrl: string;
  label: string;
}

export const getQRCodeFontSize = (text: string) => {
  const length = text.length || 1;
  const baseSize = 96;
  const calculatedSize = Math.max(56, baseSize - length * 0.8);
  return `${calculatedSize}pt`;
};

export const populateQRCodePrintDocument = (
  printDocument: Document,
  { imageUrl, label }: QRCodePrintDocumentOptions,
) => {
  const style = printDocument.createElement("style");
  style.textContent = `
    @page { size: A4; margin: 0; }
    body { margin: 0; display: flex; justify-content: center; }
    .a4-container {
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
    }
    .qr-image {
      max-width: 100%;
      height: 45%;
      object-fit: contain;
      margin-top: 10mm;
    }
    .label-text {
      margin-top: 10mm;
      font-family: sans-serif;
      font-size: ${getQRCodeFontSize(label)};
      overflow-wrap: anywhere;
      font-weight: bold;
    }
  `;

  const container = printDocument.createElement("div");
  container.className = "a4-container";

  const image = printDocument.createElement("img");
  image.src = imageUrl;
  image.alt = "QR Code";
  image.className = "qr-image";

  const labelElement = printDocument.createElement("span");
  labelElement.className = "label-text";
  labelElement.textContent = label;

  container.append(image, labelElement);
  printDocument.title = "Print QR Code";
  printDocument.head.replaceChildren(style);
  printDocument.body.replaceChildren(container);
};
