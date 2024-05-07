import { LineSegment } from "./types";

export const findVirtualRoomBounds = (
  objectX: number,
  objectY: number,
  mirrorX: number,
  mirrorY: number
) => {
  const dx = mirrorX - objectX;
  const dy = mirrorY - objectY;

  const slope = dy / dx;
  const newX = 10000;
  const newY = slope * 10000 + objectY - slope * objectX;
  return { newX, newY };
};

export const findRoomBounds = (
  objectX: number,
  objectY: number,
  mirrorX: number,
  mirrorY: number,
  reflectionDistance: number
) => {
  const dx = mirrorX - objectX;
  const dy = mirrorY - objectY;

  const slope = dy / dx;
  const reflectedX = reflectionDistance;
  const reflectedY = -1 * slope * reflectedX + mirrorY + slope * mirrorX;
  return { reflectedX, reflectedY };
};

export const findLightRayPointsRecursive = (
  objectX: number,
  objectY: number,
  mirrorX: number,
  mirrorY: number,
  mirrors: { x: number; yMin: number; yMax: number }[],
  currentMirrorIndex = 0
): { x: number; y: number }[] => {
  const dx = mirrorX - objectX;
  const dy = mirrorY - objectY;

  const slope = dy / dx;
  const reflectedX = mirrors[currentMirrorIndex ? 0 : 1].x;
  const reflectedY = -1 * slope * reflectedX + mirrorY + slope * mirrorX;

  // Base case: Check if out of mirror bounds or if there are no more mirrors
  if (
    reflectedY < mirrors[currentMirrorIndex ? 0 : 1].yMin ||
    reflectedY > mirrors[currentMirrorIndex ? 0 : 1].yMax
  ) {
    if (reflectedY < 200 || reflectedY > 400) {
      const reflectedX = currentMirrorIndex ? 0 : 2200;
      const reflectedY = -1 * slope * reflectedX + mirrorY + slope * mirrorX;
      return [{ x: reflectedX, y: reflectedY }];
    } // End recursion, returning the final point
    // else return [{ x: reflectedX, y: reflectedY }];
    return [{ x: reflectedX, y: reflectedY }]; // End recursion, returning the final point
  } else {
    // Recursive case: Calculate next reflection using next mirror
    const nextMirrorIndex = currentMirrorIndex ? 0 : 1; // Loop back to first mirror if needed
    return [
      { x: reflectedX, y: reflectedY },
      ...findLightRayPointsRecursive(
        mirrorX,
        mirrorY,
        reflectedX,
        reflectedY,
        mirrors,
        nextMirrorIndex
      ),
    ];
  }
};

const colors = [
  "#FF6347",
  "#4682B4",
  "#32CD32",
  "#FFD700",
  "#6A5ACD",
  "#FF69B4",
  "#00FA9A",
  "#FFA500",
  "#800080",
  "#00BFFF",
].reverse();

export const getReflectedLineSegments = (
  mirrorX: number,
  distTriangleToRightMirror: number,
  distTriangleToLeftMirror: number,
  spaceBetweenMirrors: number,
  points: { x: number; y: number }[]
): LineSegment[] => {
  const distanceTriangleFinalSegment =
    points.length % 2 === 0
      ? distTriangleToRightMirror
      : distTriangleToLeftMirror;

  const lineSegments = [];
  for (let i = 0; i < points.length - 1; i++) {
    const firstPoint = {
      x: mirrorX + i * spaceBetweenMirrors,
      y: points[i].y,
    };
    let secondPoint = {
      x: mirrorX + (i + 1) * spaceBetweenMirrors,
      y: points[i + 1].y,
    };
    if (i + 1 === points.length - 1) {
      secondPoint = {
        x: mirrorX + i * spaceBetweenMirrors + distanceTriangleFinalSegment,
        y: points[i + 1].y,
      };
    }
    const color =
      colors[(i + (colors.length - points.length + 1)) % colors.length];

    lineSegments.push({
      start: firstPoint,
      end: secondPoint,
      opacity: 0,
      color,
    });
  }
  return lineSegments;
};

export const calculateAngle = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.atan2(dy, dx);
};
