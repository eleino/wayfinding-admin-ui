import { ImageDropBox } from "@components/Forms/ImageDropBox";
import { setInput, useField, type FormStore } from "@formisch/react";
import { EditStepSchema } from "@schemas/step.schema";
import { useCallback, useEffect, useRef, useState } from "react";
import { NumberSlider } from "@components/Forms/NumberSlider";
import {
  calculateOverlayPositionRanges,
  type PositionRange,
} from "@utils/overlayPositionRange";
import type { ImageResponse } from "@apptypes/image";
import type { ExistingImageGroup } from "@apptypes/image";
import type { EditStepOverlay } from "@schemas/step.schema";

interface StepOverlayProps {
  overlayUrl?: string;
  overlayKey?: string;
  imageUrl?: string;
  form: FormStore<typeof EditStepSchema>;
  direction: "on_approach" | "to_next";
  overlayImages: ImageResponse | undefined;
  existingImageGroups: ExistingImageGroup[];
  existingImagesLoading?: boolean;
  existingImagesError?: Error | null;
}

export const StepOverlay = (props: StepOverlayProps) => {
  const { overlayUrl, imageUrl, form, overlayKey, direction, overlayImages } =
    props;
  // image can be an image file, or an existing image url
  const imageField = useField(form, {
    path: [`image_${direction}_file`],
  });
  const removeImageField = useField(form, {
    path: [`remove_image_${direction}`],
  });
  const existingImageField = useField(form, {
    path: [`existing_image_${direction}_key`],
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
  }>({ url: overlayUrl, key: overlayKey });
  const [useOverlay, setUseOverlay] = useState<boolean>(!!overlayUrl);
  const previewImageRef = useRef<HTMLImageElement>(null);
  const overlayImageRef = useRef<HTMLImageElement>(null);
  const [positionRanges, setPositionRanges] = useState<{
    x: PositionRange;
    y: PositionRange;
  }>({
    x: { min: -1000, max: 1000 },
    y: { min: -1000, max: 1000 },
  });

  // Update position ranges based on the current size of the preview image and overlay
  const updatePositionRanges = useCallback(() => {
    const image = previewImageRef.current;
    const overlay = overlayImageRef.current;
    if (!image || !overlay) return;

    const imageBounds = image.getBoundingClientRect();
    const transformedOverlayBounds = overlay.getBoundingClientRect();
    // overlay size changes when it's rotated, and it also depends on the size of the preview image
    // so we need to calculate the transformed overlay bounds
    const ranges = calculateOverlayPositionRanges({
      imageWidth: imageBounds.width,
      imageHeight: imageBounds.height,
      overlayWidth: overlay.offsetWidth,
      overlayHeight: overlay.offsetHeight,
      transformedOverlayWidth: transformedOverlayBounds.width,
      transformedOverlayHeight: transformedOverlayBounds.height,
    });

    if (ranges) setPositionRanges(ranges);
  }, []);

  // Update position ranges on mount and whenever the size of the preview image or overlay changes
  useEffect(() => {
    const image = previewImageRef.current;
    const overlay = overlayImageRef.current;
    if (!image || !overlay) return;

    // Use requestAnimationFrame to ensure the DOM has updated before calculating the position ranges
    const frameId = requestAnimationFrame(updatePositionRanges);
    // Use ResizeObserver to watch for changes in the size of the preview image and overlay
    const resizeObserver = new ResizeObserver(updatePositionRanges);
    resizeObserver.observe(image);
    resizeObserver.observe(overlay);

    return () => {
      // Clean up the observer and cancel the animation frame on unmount
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [
    previewImage,
    selectedOverlay.url,
    overlayField.input?.overlay_size,
    overlayField.input?.rotation_deg,
    overlayField.input?.rotation_x_deg,
    updatePositionRanges,
  ]);

  const handleOverlaySelect = (
    overlayUrl: string,
    overlayKey: string | undefined,
  ) => {
    setSelectedOverlay({ url: overlayUrl, key: overlayKey });
    handleOverlayChange({ image_key: overlayKey || "" });
  };

  const makeDefaultOverlay = (): EditStepOverlay => ({
    image_key: selectedOverlay.key ?? "",
    position_x_percent: 0,
    position_y_percent: -20,
    rotation_deg: 0,
    rotation_x_deg: 0,
    overlay_size: 20,
  });

  const handleOverlayChange = (changes: Partial<EditStepOverlay>) => {
    const current = overlayField.input ?? makeDefaultOverlay();

    overlayField.onChange({
      image_key: changes.image_key ?? current.image_key,
      position_x_percent:
        changes.position_x_percent ?? current.position_x_percent,
      position_y_percent:
        changes.position_y_percent ?? current.position_y_percent,
      rotation_deg: changes.rotation_deg ?? current.rotation_deg,
      rotation_x_deg: changes.rotation_x_deg ?? current.rotation_x_deg,
      overlay_size: changes.overlay_size ?? current.overlay_size,
    });
  };

  const handleOverlayRemove = () => {
    setUseOverlay(false);
    // setOverlayKey("");
    handleOverlayChange({ image_key: "" });
  };

  const handleOverlayAdd = () => {
    setUseOverlay(true);
    if (!overlayField.input) {
      if (!selectedOverlay.key) {
      setSelectedOverlay({
        url: overlayImages?.data?.[0]?.url,
        key: overlayImages?.data?.[0]?.key,
      });
    }
      setInput(form, {
        path: [`overlay_${direction}`],
        input: { // selected or first overlay image, or default values if none selected
          image_key: selectedOverlay.key || overlayImages?.data?.[0]?.key || "",
          overlay_size: 20,
          position_x_percent: 0,
          position_y_percent: -20,
          rotation_deg: 0,
          rotation_x_deg: 0,
        },
      });
    } else if (selectedOverlay.key) {
      // re-add the overlay if one was previously set
      handleOverlayChange({ image_key: selectedOverlay.key });
    }
  };

  return (
    <section className="min-w-0 pb-10">
      <h2 className="text-lg font-semibold">Change image</h2>
      <ImageDropBox
        imageUrl={props.imageUrl}
        onFileSelect={(file) => {
          imageField.onChange(file);
          if (file) {
            removeImageField.onChange(false);
            const reader = new FileReader();
            reader.onloadend = () => {
              setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
          } else {
            setPreviewImage(imageUrl);
          }
        }}
        onExistingImageRemove={() => {
          removeImageField.onChange(true);
          setPreviewImage(undefined);
        }}
        onExistingImageSelect={(image) => {
          existingImageField.onChange(image?.key);
          if (image) {
            imageField.onChange(undefined);
            removeImageField.onChange(false);
            setPreviewImage(image.url);
          }
        }}
        existingImageGroups={props.existingImageGroups}
        existingImagesLoading={props.existingImagesLoading}
        existingImagesError={props.existingImagesError}
      />
      {previewImage && !useOverlay && (
        <button
          type="button"
          className="mt-2 px-4 py-2 bg-lab-blue text-white rounded"
          onClick={() => {
            handleOverlayAdd();
          }}
        >
          Add Overlay
        </button>
      )}
      {previewImage && useOverlay && (
        <div className="mt-4 flex flex-col">
          <p>Select an overlay:</p>
          <div className="mt-2 flex gap-2">
            {overlayImages?.data?.map((overlay) => (
              <button
                type="button"
                key={overlay.key}
                aria-pressed={selectedOverlay.url === overlay.url}
                aria-label={`Select overlay ${overlay.key}`}
                className={`cursor-pointer rounded border-2 w-30 h-30 flex justify-center p-1 ${selectedOverlay.url === overlay.url ? "border-lab-blue" : "border-gray-300"}`}
                onClick={() => handleOverlaySelect(overlay.url, overlay.key)}
              >
                <img
                  src={overlay.url}
                  alt={overlay.key}
                  className="h-25 object-contain p-2"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      {previewImage && useOverlay && (
        <>
          <h2 className="text-lg font-semibold mt-10">
            Adjust overlay position and rotation
          </h2>
          <div className="mt-5 grid grid-cols-[auto_auto] items-center gap-3 md:gap-5 md:grid-cols-[auto_minmax(18rem,25rem)_minmax(10rem,1fr)]">
            <div className="flex flex-col items-center justify-center h-full gap-4 md:col-start-1 md:row-start-1 md:writing-vertical-lr">
              <NumberSlider
                label="Rotation X"
                value={overlayField.input!.rotation_x_deg!}
                onChange={(value) =>
                  handleOverlayChange({ rotation_x_deg: value })
                }
                min={-180}
                max={180}
                orientation="vertical-lr"
              />
              <NumberSlider
                label="Position Y"
                value={overlayField.input!.position_y_percent!}
                onChange={(value) =>
                  handleOverlayChange({ position_y_percent: value })
                }
                range={positionRanges.y}
                orientation="vertical-lr"
              />
            </div>

            <div className="relative mx-auto w-full md:col-start-2 md:row-start-1 max-w-100">
              <img
                ref={previewImageRef}
                src={previewImage}
                alt="Preview"
                className="relative h-auto w-full object-contain"
                onLoad={updatePositionRanges}
              />
              {selectedOverlay.url && (
                <img
                  ref={overlayImageRef}
                  src={selectedOverlay.url}
                  alt=""
                  className="absolute"
                  onLoad={updatePositionRanges}
                  style={{
                    top: "50%",
                    left: "50%",
                    width: `${overlayField.input!.overlay_size!}%`,
                    height: "auto",
                    transform: `
                translate(${overlayField.input!.position_x_percent!}%, ${overlayField.input!.position_y_percent!}%)
                perspective(6cm)
                rotateX(${overlayField.input!.rotation_x_deg!}deg) 
                rotate(${overlayField.input!.rotation_deg!}deg)
            `,
                    pointerEvents: "none",
                    zIndex: 100,
                  }}
                />
              )}
            </div>

            <div className="col-span-1 flex flex-col gap-4 col-start-2">
              <div>
              <NumberSlider
                label="Position X"
                value={overlayField.input!.position_x_percent!}
                onChange={(value) =>
                  handleOverlayChange({ position_x_percent: value })
                }
                range={positionRanges.x}
              />
              <NumberSlider
                label="Rotation"
                value={overlayField.input!.rotation_deg!}
                onChange={(value) =>
                  handleOverlayChange({ rotation_deg: value })
                }
                min={-180}
                max={180}
              />
              </div>
            </div>
            <div className="col-span-1 grid gap-4 col-start-2 sm:grid-cols-2 md:col-start-3 md:row-start-1 md:col-span-1 md:grid-cols-1">
              <NumberSlider
                label="Overlay size"
                value={overlayField.input!.overlay_size!}
                onChange={(value) =>
                  handleOverlayChange({ overlay_size: value })
                }
                min={10}
                max={30}
              />
              <button
                type="button"
                className="rounded bg-lab-blue px-3 py-2 text-white"
                onClick={handleOverlayRemove}
              >
                Remove Overlay
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};
