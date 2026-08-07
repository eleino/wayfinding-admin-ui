export interface PositionRange {
  min: number;
  max: number;
}

interface OverlayPositionRangeInput {
  imageWidth: number;
  imageHeight: number;
  overlayWidth: number;
  overlayHeight: number;
  transformedOverlayWidth: number;
  transformedOverlayHeight: number;
}

const calculateAxisRange = (
  imageSize: number,
  overlaySize: number,
  transformedOverlaySize: number,
): PositionRange => {
  const minimum =
    ((transformedOverlaySize / 2 - imageSize / 2 - overlaySize / 2) /
      overlaySize) *
    100;
  const maximum =
    ((imageSize / 2 - transformedOverlaySize / 2 - overlaySize / 2) /
      overlaySize) *
    100;

  if (minimum > maximum) {
    // The transformed overlay is larger than the image on this axis, so its
    // centered position is the closest possible fit.
    return { min: -50, max: -50 };
  }

  return {
    min: Math.ceil(minimum),
    max: Math.floor(maximum),
  };
};

export const calculateOverlayPositionRanges = ({
  imageWidth,
  imageHeight,
  overlayWidth,
  overlayHeight,
  transformedOverlayWidth,
  transformedOverlayHeight,
}: OverlayPositionRangeInput): { x: PositionRange; y: PositionRange } | null => {
  if (
    imageWidth <= 0 ||
    imageHeight <= 0 ||
    overlayWidth <= 0 ||
    overlayHeight <= 0 ||
    transformedOverlayWidth <= 0 ||
    transformedOverlayHeight <= 0
  ) {
    return null;
  }

  return {
    x: calculateAxisRange(
      imageWidth,
      overlayWidth,
      transformedOverlayWidth,
    ),
    y: calculateAxisRange(
      imageHeight,
      overlayHeight,
      transformedOverlayHeight,
    ),
  };
};
