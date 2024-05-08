import { Circle, Line } from "react-konva";
import {
  circleRadius,
  hoveredCircleRadius,
  lineLength,
  numberOfPoints,
  startingPoint,
  triangleCenter,
} from "../constants";
import { useState } from "react";

interface MirrorProps {
  x: number;
  opacity: number;
  mirrorPoints?: {
    x: number;
    y: number;
  }[];
  handleMirrorPointClick?: (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    mirrorIndex: number
  ) => void;
  mirrorIndex?: 0 | 1;
}

export const Mirror = ({
  x,
  opacity,
  mirrorPoints,
  handleMirrorPointClick,
  mirrorIndex,
}: MirrorProps) => {
  const [hoveredRightIndex, setHoveredRightIndex] = useState<number>(-1);

  return (
    <>
      <Line
        points={[
          x,
          (startingPoint / numberOfPoints) * lineLength,
          x,
          ((startingPoint + numberOfPoints) / numberOfPoints) * lineLength,
        ]}
        stroke="#6250e6"
        strokeWidth={2}
        opacity={opacity}
      />
      {mirrorPoints &&
        mirrorPoints.map(({ x, y }, index) => (
          <Circle
            key={index}
            x={x}
            y={y}
            fill="#6250e6"
            radius={
              hoveredRightIndex === index ? hoveredCircleRadius : circleRadius
            }
            onMouseEnter={() => setHoveredRightIndex(index)}
            onMouseLeave={() => setHoveredRightIndex(-1)}
            onClick={() => {
              if (handleMirrorPointClick && mirrorIndex !== undefined)
                handleMirrorPointClick(
                  triangleCenter.x,
                  triangleCenter.y,
                  x,
                  y,
                  mirrorIndex
                );
            }}
          />
        ))}
    </>
  );
};
