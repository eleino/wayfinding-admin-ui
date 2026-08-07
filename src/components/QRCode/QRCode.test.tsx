import { describe, expect, test } from "vitest";
import { populateQRCodePrintDocument } from "./qrCodePrint";

describe("populateQRCodePrintDocument", () => {
  test("renders the label as text instead of executable markup", () => {
    const printDocument = document.implementation.createHTMLDocument();
    const maliciousLabel =
      '</span><img src="invalid" onerror="window.hacked=true">';

    populateQRCodePrintDocument(printDocument, {
      imageUrl: "blob:qr-code",
      label: maliciousLabel,
    });

    expect(printDocument.querySelector(".label-text")?.textContent).toBe(
      maliciousLabel,
    );
    expect(printDocument.querySelectorAll("img")).toHaveLength(1);
    expect(printDocument.querySelector("[onerror]")).toBeNull();
  });
});
