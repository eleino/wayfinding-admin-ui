import { ImageDropBox } from "@components/Forms/ImageDropBox";
import { useField, type FormStore } from "@formisch/react";
import { EditStepSchema } from "@schemas/step.schema";
import { useGetImagesByType } from "@hooks/useImages";
import { useState } from "react";
import { NumberSlider } from "@components/Forms/NumberSlider";
import { interpolateRangeX, interpolateRangeY } from "@utils/interpolateRange";

interface StepOverlayProps {
  overlayUrl?: string;
  imageUrl?: string;
  form: FormStore<typeof EditStepSchema>;
  direction: "on_approach" | "to_next";
  setOverlayKey: (key: string) => void;
}

export const StepOverlay = (props: StepOverlayProps) => {
  // image can be an image file, or an existing image url
  const imageField = useField(props.form, {
    path: [`image_${props.direction}_file`],
  });
  const overlayField = useField(props.form, {
    path: [`overlay_${props.direction}`],
  });
  const overlayImages = useGetImagesByType("overlay");
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    props.imageUrl,
  );
  const [selectedOverlay, setSelectedOverlay] = useState<{url: string | undefined, key: string | undefined}>(
    {url: props.overlayUrl, key: undefined}
  );
  const [useOverlay, setUseOverlay] = useState<boolean>(!!props.overlayUrl);

  const handleOverlaySelect = (overlayUrl: string, overlayKey: string | undefined) => {
    setSelectedOverlay({url: overlayUrl, key: overlayKey});
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
            setPreviewImage(props.imageUrl);
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
            {overlayImages.data?.data.map((overlay) => (
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
        <div className="mt-4 flex flex-row gap-2 relative">
          <div className="my-20 ml-22">
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
          </div>
          <div className="flex flex-col justify-center gap-8">
            <NumberSlider
              label="Overlay size"
              value={overlayField.input.overlay_size!}
              onChange={(value) => handleOverlayChange({ overlay_size: value })}
              min={10}
              max={30}
            />
            <div className="absolute bottom-0 flex justify-center pr-40 w-full left-0">
              <NumberSlider
                label="Position X"
                value={overlayField.input.position_x_percent!}
                onChange={(value) =>
                  handleOverlayChange({ position_x_percent: value })
                }
                range={interpolateRangeX(overlayField.input.overlay_size!, selectedOverlay.key === "OVERLAY_STRAIGHT_ARROW")}
              />
            </div>
            <div className="absolute left-0 h-full top-0 flex justify-center writing-vertical-lr">
              <NumberSlider
                label="Position Y"
                value={overlayField.input.position_y_percent!}
                onChange={(value) =>
                  handleOverlayChange({ position_y_percent: value })
                }
                range={interpolateRangeY(overlayField.input.overlay_size!, (selectedOverlay.key === "OVERLAY_STRAIGHT_ARROW" || selectedOverlay.key === undefined))}
                orientation="vertical-lr"
              />
            </div>
            <div className="absolute left-0 top-0 flex w-full justify-center pr-40">
            <NumberSlider
              label="Rotation"
              value={overlayField.input.rotation_deg!}
              onChange={(value) => handleOverlayChange({ rotation_deg: value })}
              min={-180}
              max={180}
            />
            </div>
            <NumberSlider
              label="Rotation X"
              value={overlayField.input.rotation_x_deg!}
              onChange={(value) =>
                handleOverlayChange({ rotation_x_deg: value })
              }
              min={-180}
              max={180}
            />
            <button
              className="mt-2 px-4 py-2 bg-lab-blue text-white rounded"
              onClick={() => setUseOverlay(false)}
            >
              Remove Overlay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
