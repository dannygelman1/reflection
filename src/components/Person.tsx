import { Arrow, Circle, Group, Line, Shape } from "react-konva";

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
      <Circle
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
          context.rotate(isMirrored ? -angle : angle);
          context.scale(isMirrored ? -1 : 1, 1);

          context.beginPath();
          context.moveTo(radius - 2, 6);
          context.lineTo(radius - 2, -6);
          context.lineTo(radius + 7, 0);
          context.closePath();

          context.fillStrokeShape(shape);
        }}
        fill={fill}
      />
      {onDragMove && <VerticalLineWithArrows x={x} y={y} />}
    </Group>
  );
};

interface VerticalLineWithArrowsProps {
  x: number;
  y: number;
}

const VerticalLineWithArrows = ({ x, y }: VerticalLineWithArrowsProps) => {
  const lineX = x;
  const lineStartY = y - 10;
  const lineEndY = y + 10;
  const arrowSize = 5;

  return (
    <Group listening={false}>
      <Line
        points={[lineX, lineStartY, lineX, lineEndY]}
        stroke="#343434"
        strokeWidth={2}
      />
      <Arrow
        points={[lineX, lineStartY + arrowSize, lineX, lineStartY]}
        pointerLength={arrowSize}
        pointerWidth={arrowSize}
        fill="#343434"
        stroke="#343434"
        strokeWidth={2}
      />
      <Arrow
        points={[lineX, lineEndY - arrowSize, lineX, lineEndY]}
        pointerLength={arrowSize}
        pointerWidth={arrowSize}
        fill="#343434"
        stroke="#343434"
        strokeWidth={2}
      />
    </Group>
  );
};
