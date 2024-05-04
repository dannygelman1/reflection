import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Circle, Shape, Arrow } from "react-konva";
import Konva from "konva";

const MirrorDemo: React.FC = () => {
  const linePoints: number[] = [];
  const lineLength = 200;
  const circleCenters: number[][] = [];
  const circleRadius = 5;
  const numberOfPoints = 10;
  const triangleCenter = { x: 50, y: 150 };

  const [animationLine, setAnimationLine] = useState<number[]>([]);

  const layerRef = useRef<Konva.Layer>(null);
  const animRef = useRef<Konva.Animation | null>(null);

  for (let i = 3; i <= numberOfPoints; i++) {
    const y = (i / numberOfPoints) * lineLength;
    linePoints.push(150);
    linePoints.push(y);
    circleCenters.push([150, y]);
  }

  const handleCircleClick = (x: number, y: number) => {
    const triangleX = triangleCenter.x + 20;
    const triangleY = triangleCenter.y + 20;

    const dx = x - triangleX;
    const dy = y - triangleY;

    const slope = -(dy / dx);
    const reflectedX = triangleX;
    const reflectedY = slope * triangleX + y + -slope * x;

    animateLine(triangleX, triangleY, x, y, reflectedX, reflectedY);
  };

  const animateLine = (
    startX: number,
    startY: number,
    midX: number,
    midY: number,
    endX: number,
    endY: number
  ) => {
    let totalDistanceTraveled = 0;
    let currentSegment = 1;
    let distances = {
      1: Math.sqrt((midX - startX) ** 2 + (midY - startY) ** 2),
      2: Math.sqrt((endX - midX) ** 2 + (endY - midY) ** 2),
    };
    let dx = midX - startX;
    let dy = midY - startY;

    animRef.current = new Konva.Animation((frame) => {
      if (frame && animRef.current) {
        const speed = 0.2;
        const timeDelta = frame.timeDiff;
        totalDistanceTraveled += speed * timeDelta;

        if (currentSegment === 1) {
          let distance = Math.min(totalDistanceTraveled, distances[1]);
          let ratio = distance / distances[1];
          let newX = startX + dx * ratio;
          let newY = startY + dy * ratio;
          setAnimationLine([startX, startY, newX, newY]);

          if (distance >= distances[1]) {
            currentSegment = 2;
            totalDistanceTraveled = 0;
            dx = endX - midX;
            dy = endY - midY;
          }
        } else if (currentSegment === 2) {
          let distance = Math.min(totalDistanceTraveled, distances[2]);
          let ratio = distance / distances[2];
          let newX = midX + dx * ratio;
          let newY = midY + dy * ratio;
          setAnimationLine([startX, startY, midX, midY, newX, newY]);

          if (distance >= distances[2]) {
            animRef.current.stop();
          }
        }
      }
    }, layerRef.current);

    animRef.current.start();
  };

  useEffect(() => {
    return () => {
      if (animRef.current) {
        animRef.current.stop();
      }
    };
  }, []);

  return (
    <Stage width={600} height={300} style={{ border: "2px solid green" }}>
      <Layer ref={layerRef}>
        <Line points={linePoints} stroke="black" />
        {circleCenters.map(([x, y], index) => (
          <Circle
            key={index}
            x={x}
            y={y}
            radius={circleRadius}
            fill="red"
            onClick={() => handleCircleClick(x, y)}
          />
        ))}
        <Shape
          sceneFunc={(context, shape) => {
            context.beginPath();
            context.moveTo(20, 0);
            context.lineTo(40, 40);
            context.lineTo(0, 40);
            context.closePath();
            context.fillStrokeShape(shape);
          }}
          fill="green"
          x={triangleCenter.x}
          y={triangleCenter.y}
        />
        <Line
          points={animationLine}
          stroke="blue"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
          pointerLength={10}
          pointerWidth={10}
        />
      </Layer>
    </Stage>
  );
};

export default MirrorDemo;
