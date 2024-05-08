import { useMemo, MutableRefObject } from "react";
import { findRoomBounds, findVirtualRoomBounds } from "../utils";
import { leftMirrorX, numberOfPoints, personRadius } from "../constants";

export const useMirrorBounds = (
  personPositionRef: MutableRefObject<{
    x: number;
    y: number;
    angle: number;
  }>,
  rightMirrorPoints: { x: number; y: number }[]
) => {
  // Memoize the calculations to only recompute when necessary inputs change
  return useMemo(() => {
    const mirrorBoundsBottomPoint = findRoomBounds(
      personPositionRef.current.x,
      personPositionRef.current.y,
      rightMirrorPoints[numberOfPoints].x,
      rightMirrorPoints[numberOfPoints].y,
      leftMirrorX
    );
    const mirrorBoundsTopPoint = findRoomBounds(
      personPositionRef.current.x,
      personPositionRef.current.y,
      rightMirrorPoints[0].x,
      rightMirrorPoints[0].y,
      leftMirrorX
    );
    const mirrorBoundsBottomPointBackRoom = findRoomBounds(
      personPositionRef.current.x,
      personPositionRef.current.y,
      rightMirrorPoints[numberOfPoints].x,
      rightMirrorPoints[numberOfPoints].y,
      0
    );
    const mirrorBoundsTopPointBackRoom = findRoomBounds(
      personPositionRef.current.x,
      personPositionRef.current.y,
      rightMirrorPoints[0].x,
      rightMirrorPoints[0].y,
      0
    );
    const virtualMirrorBoundsBottomPoint = findVirtualRoomBounds(
      personPositionRef.current.x,
      personPositionRef.current.y,
      rightMirrorPoints[numberOfPoints].x,
      rightMirrorPoints[numberOfPoints].y
    );
    const virtualMirrorBoundsTopPoint = findVirtualRoomBounds(
      personPositionRef.current.x,
      personPositionRef.current.y,
      rightMirrorPoints[0].x,
      rightMirrorPoints[0].y
    );

    const lightRaysToPerson = [
      {
        x: personPositionRef.current.x,
        y: personPositionRef.current.y + personRadius,
      },
      {
        x: personPositionRef.current.x,
        y: personPositionRef.current.y - personRadius,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personPositionRef, personPositionRef.current.y, rightMirrorPoints]);
};
