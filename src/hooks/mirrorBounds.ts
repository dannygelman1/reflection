import { useMemo } from "react";
import { findRoomBounds, findVirtualRoomBounds } from "../utils";
import { leftMirrorX, numberOfPoints, personRadius } from "../constants";

export const useMirrorBounds = (
  personPosition: {
    x: number;
    y: number;
    angle: number;
  },
  rightMirrorPoints: { x: number; y: number }[]
) => {
  // Memoize the calculations to only recompute when person position changes
  return useMemo(() => {
    const mirrorBoundsBottomPoint = findRoomBounds(
      personPosition.x,
      personPosition.y,
      rightMirrorPoints[numberOfPoints].x,
      rightMirrorPoints[numberOfPoints].y,
      leftMirrorX
    );
    const mirrorBoundsTopPoint = findRoomBounds(
      personPosition.x,
      personPosition.y,
      rightMirrorPoints[0].x,
      rightMirrorPoints[0].y,
      leftMirrorX
    );
    const mirrorBoundsBottomPointBackRoom = findRoomBounds(
      personPosition.x,
      personPosition.y,
      rightMirrorPoints[numberOfPoints].x,
      rightMirrorPoints[numberOfPoints].y,
      0
    );
    const mirrorBoundsTopPointBackRoom = findRoomBounds(
      personPosition.x,
      personPosition.y,
      rightMirrorPoints[0].x,
      rightMirrorPoints[0].y,
      0
    );
    const virtualMirrorBoundsBottomPoint = findVirtualRoomBounds(
      personPosition.x,
      personPosition.y,
      rightMirrorPoints[numberOfPoints].x,
      rightMirrorPoints[numberOfPoints].y
    );
    const virtualMirrorBoundsTopPoint = findVirtualRoomBounds(
      personPosition.x,
      personPosition.y,
      rightMirrorPoints[0].x,
      rightMirrorPoints[0].y
    );

    const lightRaysToPerson = [
      {
        x: personPosition.x,
        y: personPosition.y + personRadius,
      },
      {
        x: personPosition.x,
        y: personPosition.y - personRadius,
      },
      { x: rightMirrorPoints[0].x, y: rightMirrorPoints[0].y },
      {
        x: rightMirrorPoints[numberOfPoints].x,
        y: rightMirrorPoints[numberOfPoints].y,
      },
    ];
    const lightRaysToMirror = [
      { x: rightMirrorPoints[0].x, y: rightMirrorPoints[0].y },
      {
        x: rightMirrorPoints[numberOfPoints].x,
        y: rightMirrorPoints[numberOfPoints].y,
      },
      {
        x: mirrorBoundsBottomPointBackRoom.reflectedX,
        y: mirrorBoundsBottomPointBackRoom.reflectedY,
      },
      {
        x: mirrorBoundsTopPointBackRoom.reflectedX,
        y: mirrorBoundsTopPointBackRoom.reflectedY,
      },
    ];
    const reflectedLightRays = [
      { x: rightMirrorPoints[0].x, y: rightMirrorPoints[0].y },
      {
        x: rightMirrorPoints[numberOfPoints].x,
        y: rightMirrorPoints[numberOfPoints].y,
      },
      {
        x: virtualMirrorBoundsBottomPoint.newX,
        y: virtualMirrorBoundsBottomPoint.newY,
      },
      {
        x: virtualMirrorBoundsTopPoint.newX,
        y: virtualMirrorBoundsTopPoint.newY,
      },
    ];

    return {
      mirrorBoundsBottomPoint,
      mirrorBoundsTopPoint,
      virtualMirrorBoundsBottomPoint,
      virtualMirrorBoundsTopPoint,
      lightRaysToPerson,
      lightRaysToMirror,
      reflectedLightRays,
    };
  }, [personPosition.x, personPosition.y, rightMirrorPoints]);
};
