import { Shape } from "react-konva";

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
        context.moveTo(-40 / 3, -6);
        context.lineTo(80 / 3, 0);
        context.lineTo(-40 / 3, 6);
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
