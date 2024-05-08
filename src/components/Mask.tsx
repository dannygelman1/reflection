import { ReactNode } from "react";
import { Group, Shape } from "react-konva";

interface MaskedContentProps {
  maskPoints: { x: number; y: number }[];
  children: ReactNode;
}

export const MaskedContent = ({ maskPoints, children }: MaskedContentProps) => {
  return (
    <Group>
      {children}
      <Shape
        sceneFunc={(context, shape) => {
          context.beginPath();
          maskPoints.forEach((point, index) => {
            if (index === 0) {
              context.moveTo(point.x, point.y);
            } else {
              context.lineTo(point.x, point.y);
            }
          });
          context.closePath();
          context.fillStrokeShape(shape);
        }}
        fill="white"
        globalCompositeOperation="destination-in"
      />
    </Group>
  );
};
