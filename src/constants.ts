import { getTrianglePoints } from "./utils";

export const lineLength = 200;
export const rightMirrorX = 400;
export const leftMirrorX = 200;
export const mirrorSpacing = rightMirrorX - leftMirrorX;
export const circleRadius = 3;
export const hoveredCircleRadius = 6;
export const numberOfPoints = 25;
export const startingPoint = 25;

export const personRadius = 14;
export const maxVirtualRooms = 4;
export const personCenter = { x: 350, y: 480 };
export const triangleCenter = { x: 270, y: 275 };
export const trianglePoints = getTrianglePoints(
  triangleCenter.x,
  triangleCenter.y
);
export const distTriangleToRightMirror = Math.abs(
  rightMirrorX - triangleCenter.x
);
export const distTriangleToLeftMirror = Math.abs(
  leftMirrorX - triangleCenter.x
);

export const dotsY = 300;
