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
export const trianglePointsOffset = [
  { x: -40 / 3, y: -9 },
  { x: 80 / 3, y: 0 },
  { x: -40 / 3, y: 9 },
];

export const trianglePoints = [
  {
    x: triangleCenter.x + trianglePointsOffset[0].x,
    y: triangleCenter.y + trianglePointsOffset[0].y,
  },
  {
    x: triangleCenter.x + trianglePointsOffset[1].x,
    y: triangleCenter.y + trianglePointsOffset[1].y,
  },
  {
    x: triangleCenter.x + trianglePointsOffset[2].x,
    y: triangleCenter.y + trianglePointsOffset[2].y,
  },
];
export const distTriangleToRightMirror = Math.abs(
  rightMirrorX - triangleCenter.x
);
export const distTriangleToLeftMirror = Math.abs(
  leftMirrorX - triangleCenter.x
);

export const dotsY = 300;
