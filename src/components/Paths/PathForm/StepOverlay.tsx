import { ImageDropBox } from "@components/Forms/ImageDropBox";
import { useField, type FormStore } from "@formisch/react";
import { EditStepSchema } from "@schemas/step.schema";
import { useState } from "react";
import { NumberSlider } from "@components/Forms/NumberSlider";
import { interpolateRangeX, interpolateRangeY } from "@utils/interpolateRange";
import type { ImageResponse } from "@apptypes/image";

interface StepOverlayProps {
  overlayUrl?: string;
  imageUrl?: string;
  form: FormStore<typeof EditStepSchema>;
  direction: "on_approach" | "to_next";
  setOverlayKey: (key: string) => void;
  overlayImages: ImageResponse | undefined;
}

export const StepOverlay = (props: StepOverlayProps) => {

  const { overlayUrl, imageUrl, form, direction, setOverlayKey, overlayImages } = props;
  // image can be an image file, or an existing image url
  const imageField = useField(form, {
    path: [`image_${direction}_file`],
  });
  const overlayField = useField(form, {
    path: [`overlay_${direction}`],
  });
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    imageUrl,
  );

  const [selectedOverlay, setSelectedOverlay] = useState<{
    url: string | undefined;
    key: string | undefined;
  }>({ url: props.overlayUrl, key: undefined });
  const [useOverlay, setUseOverlay] = useState<boolean>(!!overlayUrl);

const activeOverlayKey = selectedOverlay.key ?? 
  overlayImages?.data.find((img) => img.url === selectedOverlay.url)?.key;


  const handleOverlaySelect = (
    overlayUrl: string,
    overlayKey: string | undefined,
  ) => {
    setSelectedOverlay({ url: overlayUrl, key: overlayKey });
    if (overlayKey) setOverlayKey(overlayKey);
  };

  const handleOverlayChange = (changes: Partial<typeof overlayField.input>) => {
    overlayField.onChange({
      ...overlayField.input,
      ...changes,
    });
  };


  return (
    <div className="pb-10">
      <h2>Change image</h2>
      <ImageDropBox
        imageUrl={props.imageUrl}
        onFileSelect={(file) => {
          imageField.onChange(file);
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
          } else {
            setPreviewImage(imageUrl);
          }
        }}
      />
      {previewImage && !useOverlay && (
        <button
          className="mt-2 px-4 py-2 bg-lab-blue text-white rounded"
          onClick={() => setUseOverlay(true)}
        >
          Add Overlay
        </button>
      )}
      {previewImage && useOverlay && (
        <div className="flex mt-4 flex-col">
          <p>Select an overlay:</p>
          <div className="flex flex-row mt-2">
            {overlayImages?.data?.map((overlay) => (
              <div
                key={overlay.key}
                className="mr-4 cursor-pointer"
                onClick={() => handleOverlaySelect(overlay.url, overlay.key)}
              >
                <img
                  src={overlay.url}
                  alt={overlay.key}
                  className={`w-24 h-24 object-contain ${selectedOverlay.url === overlay.url ? "border-4 border-lab-blue" : "border-2 border-gray-300"}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {previewImage && useOverlay && (
        <div className="grid grid-cols-[auto_auto_auto] grid-rows-[auto_auto] gap-4 items-center mt-5">
            <div className="flex flex-col gap-4 items-center justify-center writing-vertical-lr">
              <NumberSlider
                label="Rotation X"
                value={overlayField.input.rotation_x_deg!}
                onChange={(value) =>
                  handleOverlayChange({ rotation_x_deg: value })
                }
                min={-180}
                max={180}
                orientation="vertical-lr"
              />
              <NumberSlider
                label="Position Y"
                value={overlayField.input.position_y_percent!}
                onChange={(value) =>
                  handleOverlayChange({ position_y_percent: value })
                }
                range={interpolateRangeY(
                  overlayField.input.overlay_size!,
                  activeOverlayKey === "OVERLAY_STRAIGHT_ARROW"
                )}
                orientation="vertical-lr"
              />
            </div>

            <div className="relative w-100 h-auto top-0 left-0">
              <img
                src={previewImage}
                alt="Preview"
                className="relative w-full h-fullobject-contain"
              />
              {selectedOverlay && (
                <img
                  src={selectedOverlay.url}
                  alt="Selected Overlay"
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: `${overlayField.input.overlay_size}%`,
                    height: "auto",
                    transform: `
                translate(${overlayField.input.position_x_percent}%, ${overlayField.input.position_y_percent}%)
                perspective(6cm)
                rotateX(${overlayField.input.rotation_x_deg}deg) 
                rotate(${overlayField.input.rotation_deg}deg)
            `,
                    pointerEvents: "none",
                    zIndex: 100,
                  }}
                />
              )}
            </div>
            
          <div className="flex flex-col justify-center gap-8">
            <NumberSlider
              label="Overlay size"
              value={overlayField.input.overlay_size!}
              onChange={(value) => handleOverlayChange({ overlay_size: value })}
              min={10}
              max={30}
            />
                        <button
              className="mt-2 px-2 py-2 bg-lab-blue text-white rounded"
              onClick={() => setUseOverlay(false)}
            >
              Remove Overlay
            </button>
            </div>
            
              <div className="col-start-2 flex flex-row gap-2 justify-center">
                <NumberSlider
                  label="Position X"
                  value={overlayField.input.position_x_percent!}
                  onChange={(value) =>
                    handleOverlayChange({ position_x_percent: value })
                  }
                  range={interpolateRangeX(
                    overlayField.input.overlay_size!,
                    activeOverlayKey === "OVERLAY_STRAIGHT_ARROW",
                  )}
                />
                <NumberSlider
                  label="Rotation"
                  value={overlayField.input.rotation_deg!}
                  onChange={(value) =>
                    handleOverlayChange({ rotation_deg: value })
                  }
                  min={-180}
                  max={180}
                />
              </div>


          </div>
      )}
    </div>
  );
};
