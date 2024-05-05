import { Shape } from "react-konva";

interface RoomObjectProps {
  x: number;
  y: number;
  mirrored?: boolean;
}

export const RoomObject = ({ x, y, mirrored }: RoomObjectProps) => {
  const scaleX = mirrored ? -1 : 1;

  return (
    <Shape
      sceneFunc={(context, shape) => {
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(40, 20);
        context.lineTo(0, 40);
        context.closePath();
        context.fillStrokeShape(shape);
      }}
      fill={"green"}
      x={x}
      y={y}
      scaleY={1}
      scaleX={scaleX}
    />
  );
};
