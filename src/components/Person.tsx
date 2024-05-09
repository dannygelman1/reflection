import { Arrow, Group, Line, Shape } from "react-konva";

interface PersonProps {
  x: number;
  y: number;
  angle: number;
  radius: number;
  fill: string;
  isMirrored?: boolean;
  onDragMove?: (e: any) => void;
}

export const Person = ({
  x,
  y,
  angle,
  radius,
  fill,
  isMirrored,
  onDragMove,
}: PersonProps) => {
  return (
    <Group>
      <Shape
        sceneFunc={(context, shape) => {
          // Draw the circle
          context.beginPath();
          context.arc(0, 0, radius, 0, Math.PI * 2, true);
          context.closePath();
          context.fillStrokeShape(shape);

          // Draw the triangle 'beak/nose'
          context.save(); // Save the current context state
          if (isMirrored) {
            context.scale(-1, 1); // Flip the triangle for mirrored effect
          }
          context.translate(0, 0);
          context.rotate(angle); // Rotate around the new origin (circle's edge)

          context.beginPath();
          context.moveTo(radius - 2, 6);
          context.lineTo(radius - 2, -6);
          context.lineTo(radius + 10, 0);
          context.closePath();
          context.fillStrokeShape(shape);
          context.restore();

          // Draw vertical line with arrows
          const arrowWidth = 3;
          const height = 15;
          if (onDragMove) {
            // Main vertical line
            context.beginPath();
            context.moveTo(0, -height / 2);
            context.lineTo(0, height / 2);
            context.lineCap = "round";
            context.lineWidth = 2;
            context.stroke();

            // Top arrowheads
            context.beginPath();
            context.moveTo(0, -height / 2);
            context.lineTo(-arrowWidth, -height / 2 + arrowWidth);
            context.lineTo(arrowWidth, -height / 2 + arrowWidth);
            context.lineTo(0, -height / 2);
            context.lineCap = "round";
            context.stroke();

            // Bottom arrowheads
            context.beginPath();
            context.moveTo(0, height / 2);
            context.lineTo(-arrowWidth, height / 2 - arrowWidth);
            context.lineTo(arrowWidth, height / 2 - arrowWidth);
            context.lineTo(0, height / 2);
            context.stroke();
          }
        }}
        fill={fill}
        x={x}
        y={y}
        dragBoundFunc={(pos) => {
          const upperBound = 500;
          const lowerBound = 100;
          const newY = Math.max(lowerBound, Math.min(upperBound, pos.y));
          return {
            x: x, // Keep x position constant
            y: newY,
          };
        }}
        draggable={onDragMove ? true : false}
        onDragMove={onDragMove}
      />
    </Group>
  );
};
