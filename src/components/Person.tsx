import { Circle, Group, Shape } from "react-konva";

interface PersonProps {
  x: number;
  y: number;
  angle: number;
  radius: number;
  fill: string;
  index: number;
  onDragMove?: (e: any) => void;
}

export const Person = ({
  x,
  y,
  angle,
  radius,
  fill,
  index,
  onDragMove,
}: PersonProps) => {
  return (
    <Group key={`person_${index}`}>
      <Circle
        key={`person_${index}`}
        x={x}
        y={y}
        radius={radius}
        fill={fill}
        draggable={onDragMove !== undefined}
        dragBoundFunc={(pos) => {
          const upperBound = 500;
          const lowerBound = 100;

          const newY = Math.max(lowerBound, Math.min(upperBound, pos.y));

          return {
            x,
            y: newY,
          };
        }}
        onDragMove={onDragMove}
      />
      <Shape
        sceneFunc={(context, shape) => {
          context.translate(x, y);
          context.rotate(index % 2 === 1 ? -angle : angle);
          context.scale(index % 2 === 1 ? -1 : 1, 1);

          context.beginPath();
          context.moveTo(radius - 2, 6);
          context.lineTo(radius - 2, -6);
          context.lineTo(radius + 7, 0);
          context.closePath();

          context.fillStrokeShape(shape);
        }}
        fill={fill}
      />
    </Group>
  );
};
