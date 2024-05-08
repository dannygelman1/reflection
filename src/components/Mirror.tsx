import { Line } from "react-konva";
import { lineLength, numberOfPoints, startingPoint } from "../constants";

interface MirrorProps {
  x: number;
  opacity: number;
}

export const Mirror = ({ x, opacity }: MirrorProps) => {
  return (
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
  );
};
