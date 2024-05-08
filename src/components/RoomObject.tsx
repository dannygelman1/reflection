import { Shape } from "react-konva";
import { trianglePointsOffset } from "../constants";

interface RoomObjectProps {
  x: number;
  y: number;
  mirrored?: boolean;
  inVirtualRoom?: boolean;
}

export const RoomObject = ({
  x,
  y,
  mirrored,
  inVirtualRoom,
}: RoomObjectProps) => {
  const scaleX = mirrored ? -1 : 1;

  return (
    <Shape
      sceneFunc={(context, shape) => {
        context.beginPath();
        context.moveTo(trianglePointsOffset[0].x, trianglePointsOffset[0].y);
        context.lineTo(trianglePointsOffset[1].x, trianglePointsOffset[1].y);
        context.lineTo(trianglePointsOffset[2].x, trianglePointsOffset[2].y);
        context.closePath();
        context.fillStrokeShape(shape);
      }}
      fill={inVirtualRoom ? "#6dad7f" : "green"}
      x={x}
      y={y}
      scaleX={scaleX}
      scaleY={1}
    />
  );
};
