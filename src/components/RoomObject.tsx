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
        // Define the triangle centered at the origin
        context.moveTo(-40 / 3, -20); // Move to A centered at origin
        context.lineTo(80 / 3, 0); // Line to B centered at origin
        context.lineTo(-40 / 3, 20); // Line to C centered at origin
        context.closePath();
        // Fill and stroke the shape
        context.fillStrokeShape(shape);
      }}
      fill={"green"}
      opacity={inVirtualRoom ? 0.1 : 1}
      x={x} // Set the position here
      y={y} // Set the position here
      scaleX={scaleX} // Apply mirroring
      scaleY={1}
    />
  );
};
