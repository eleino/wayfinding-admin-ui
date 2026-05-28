
const turn_range = {
  x: [
    { size: 10, min: -500, max: 400 },
    { size: 20, min: -260, max: 160 },
    { size: 30, min: -180, max: 80 },
  ],
  y: [
    { size: 10, min: -350, max: 250 },
    { size: 20, min: -170, max: 70 },
    { size: 30, min: -115, max: 15 },
  ],
};

const straight_range = {
  x: [
    { size: 10, min: -500, max: 400 },
    { size: 20, min: -260, max: 160 },
    { size: 30, min: -180, max: 80 },
  ],
  y: [
    { size: 10, min: -180, max: 70 },
    { size: 20, min: -90, max: -10 },
    { size: 30, min: -65, max: -40 },
  ],
};

export const interpolateRangeX = (size: number, isStraightArrow: boolean) => {
  const range = isStraightArrow ? straight_range : turn_range;
  let lower = range.x[0];
  let upper = range.x[range.x.length - 1];
  for (let i = 0; i < range.x.length; i++) {
    if (size < range.x[i].size) {
      lower = range.x[i - 1];
      upper = range.x[i];
      break;
    }
  }
  const t = (size - lower.size) / (upper.size - lower.size);
  const x_min = lower.min + t * (upper.min - lower.min);
  const x_max = lower.max + t * (upper.max - lower.max);
  return {
    min: Math.floor(x_min),
    max: Math.floor(x_max),
  };
};

export const interpolateRangeY = (size: number, isStraightArrow: boolean) => {
  const range = isStraightArrow ? straight_range : turn_range;
  let lower = range.y[0];
  let upper = range.y[range.y.length - 1];
  for (let i = 0; i < range.y.length; i++) {
    if (size < range.y[i].size) {
      lower = range.y[i - 1];
      upper = range.y[i];
      break;
    }
  }
  const t = (size - lower.size) / (upper.size - lower.size);
  const y_min = lower.min + t * (upper.min - lower.min);
  const y_max = lower.max + t * (upper.max - lower.max);
  return {
    min: Math.floor(y_min),
    max: Math.floor(y_max),
  };
};
