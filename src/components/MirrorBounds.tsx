import { Shape } from "react-konva";

interface MirrorBoundProps {
  mirrorBounds: {
    x: number;
    y: number;
  }[][];
}

export const MirrorBounds = ({ mirrorBounds }: MirrorBoundProps) => {
  return (
    <>
      {mirrorBounds.map((mirrorBound, i) => (
        <Shape
          key={`mirrorBound_${i}`}
          sceneFunc={(context, shape) => {
            context.beginPath();
            mirrorBound.forEach((point, index) => {
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
          opacity={0.3}
        />
      ))}
    </>
  );
};
