import type { CreateOverlayDto } from "@apptypes/dtos/create-overlay.dto";
import { http, HttpResponse } from "msw";

export const instructionRequests = {
  imageUploads: [] as Array<Record<string, string>>,
  overlayUpdates: [] as Array<{
    overlayKey: string;
    overlay: Partial<CreateOverlayDto>;
  }>,
  deletedOverlayKeys: [] as string[],
};

export const resetInstructionMockData = () => {
  instructionRequests.imageUploads = [];
  instructionRequests.overlayUpdates = [];
  instructionRequests.deletedOverlayKeys = [];
};

export const instructionHandlers = [
  http.post("*/images/upload", async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("file");
    const upload = Object.fromEntries(
      [...formData.entries()]
        .filter(([key]) => key !== "file")
        .map(([key, value]) => [key, String(value)]),
    );
    upload.fileName = file instanceof File ? file.name : "";
    instructionRequests.imageUploads.push(upload);

    return HttpResponse.json({
      entity: {
        image_key: upload.key,
        file_path: `steps/${upload.fileName}`,
      },
      url: `https://example.com/${upload.fileName}`,
    });
  }),

  http.put("*/overlays/:overlayKey", async ({ params, request }) => {
    const overlay = (await request.json()) as Partial<CreateOverlayDto>;
    const overlayKey = String(params.overlayKey);
    instructionRequests.overlayUpdates.push({ overlayKey, overlay });
    return HttpResponse.json({
      image_overlay_id: 1,
      overlay_key: overlayKey,
      overlay_image_url: "https://example.com/arrow.png",
      ...overlay,
    });
  }),

  http.delete("*/overlays/:overlayKey", ({ params }) => {
    instructionRequests.deletedOverlayKeys.push(String(params.overlayKey));
    return new HttpResponse(null, { status: 204 });
  }),
];
