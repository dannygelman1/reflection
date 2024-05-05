import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Circle, Shape } from "react-konva";
import Konva from "konva";
import { findlightRayPoints, findlightRayPointsRecursive } from "./utils";

const MirrorDemo: React.FC = () => {
  const lineLength = 200;

  const rightMirrorX = 400;
  const rightMirrorPoints: { x: number; y: number }[] = [];

  const leftMirrorX = 200;
  const leftMirrorPoints: { x: number; y: number }[] = [];

  const circleRadius = 5;
  const numberOfPoints = 10;
  const startingPoint = 10;
  const triangleCenter = { x: 270, y: 250 };

  const personRadius = 20;

  const [animationLine, setAnimationLine] = useState<
    { x: number; y: number }[]
  >([]);
  const [personPosition, setPersonPosition] = useState({ x: 350, y: 480 });

  const layerRef = useRef<Konva.Layer>(null);
  const animRef = useRef<Konva.Animation | null>(null);

  for (let i = startingPoint; i <= startingPoint + numberOfPoints; i++) {
    const y = (i / numberOfPoints) * lineLength;
    rightMirrorPoints.push({ x: rightMirrorX, y });
  }
  const rightLinePoints = rightMirrorPoints.flatMap((p) => [p.x, p.y]);

  const mirrorBoundsBottomPoint = findlightRayPoints(
    personPosition.x,
    personPosition.y,
    rightMirrorPoints[numberOfPoints].x,
    rightMirrorPoints[numberOfPoints].y,
    true
  );
  const mirrorBoundsTopPoint = findlightRayPoints(
    personPosition.x,
    personPosition.y,
    rightMirrorPoints[0].x,
    rightMirrorPoints[0].y,
    true
  );
  const mirrorBoundsPointsBottom = [
    personPosition.x,
    personPosition.y,
    rightMirrorPoints[numberOfPoints].x,
    rightMirrorPoints[numberOfPoints].y,
    mirrorBoundsBottomPoint.reflectedX,
    mirrorBoundsBottomPoint.reflectedY,
  ];
  const mirrorBoundsPointsTop = [
    personPosition.x,
    personPosition.y,
    rightMirrorPoints[0].x,
    rightMirrorPoints[0].y,
    mirrorBoundsTopPoint.reflectedX,
    mirrorBoundsTopPoint.reflectedY,
  ];

  const leftLinePoints: number[] = [];

  for (let i = startingPoint; i <= startingPoint + numberOfPoints; i++) {
    const y = (i / numberOfPoints) * lineLength;
    if (
      y < mirrorBoundsBottomPoint.reflectedY &&
      y > mirrorBoundsTopPoint.reflectedY
    )
      leftMirrorPoints.push({ x: leftMirrorX, y });
    leftLinePoints.push(leftMirrorX);
    leftLinePoints.push(y);
  }

  const mirrors: { x: number; yMin: number; yMax: number }[] = [
    {
      x: leftMirrorX,
      yMin: leftMirrorPoints[0]?.y ?? mirrorBoundsBottomPoint.reflectedY,
      yMax:
        leftMirrorPoints[leftMirrorPoints.length - 1]?.y ??
        mirrorBoundsTopPoint.reflectedY,
    },
    {
      x: rightMirrorX,
      yMin: rightMirrorPoints[0]?.y,
      yMax: rightMirrorPoints[rightMirrorPoints.length - 1]?.y,
    },
  ];

  const handleCircleClick = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    mirroIndex: number
  ) => {
    const points = findlightRayPointsRecursive(
      startX,
      startY,
      endX,
      endY,
      mirrors,
      mirroIndex
    );
    console.log(points);
    animateLine(
      [
        { x: startX, y: startY },
        { x: endX, y: endY },
      ].concat(points)
    );
  };

  const animateLine = (points: { x: number; y: number }[]) => {
    let totalDistanceTraveled = 0;
    let currentSegment = 0;
    let distances = points
      .slice(1)
      .map((point, i) =>
        Math.sqrt((point.x - points[i].x) ** 2 + (point.y - points[i].y) ** 2)
      );

    animRef.current = new Konva.Animation((frame) => {
      if (frame && animRef.current) {
        const speed = 0.2;
        const timeDelta = frame.timeDiff;
        totalDistanceTraveled += speed * timeDelta;

        while (
          currentSegment < distances.length &&
          totalDistanceTraveled >= distances[currentSegment]
        ) {
          totalDistanceTraveled -= distances[currentSegment];
          currentSegment++;
        }

        if (currentSegment < distances.length) {
          let ratio = totalDistanceTraveled / distances[currentSegment];
          let newX =
            points[currentSegment].x +
            (points[currentSegment + 1].x - points[currentSegment].x) * ratio;
          let newY =
            points[currentSegment].y +
            (points[currentSegment + 1].y - points[currentSegment].y) * ratio;
          setAnimationLine([
            ...points.slice(0, currentSegment + 1),
            { x: newX, y: newY },
          ]);
        } else {
          setAnimationLine(points);
          animRef.current.stop();
        }
      }
    }, layerRef.current);

    animRef.current.start();
  };

  // const animateLine = (
  //   startX: number,
  //   startY: number,
  //   midX: number,
  //   midY: number,
  //   endX: number,
  //   endY: number
  // ) => {
  //   let totalDistanceTraveled = 0;
  //   let currentSegment = 1;
  //   let distances = {
  //     1: Math.sqrt((midX - startX) ** 2 + (midY - startY) ** 2),
  //     2: Math.sqrt((endX - midX) ** 2 + (endY - midY) ** 2),
  //   };
  //   let dx = midX - startX;
  //   let dy = midY - startY;

  //   animRef.current = new Konva.Animation((frame) => {
  //     if (frame && animRef.current) {
  //       const speed = 0.2;
  //       const timeDelta = frame.timeDiff;
  //       totalDistanceTraveled += speed * timeDelta;

  //       if (currentSegment === 1) {
  //         let distance = Math.min(totalDistanceTraveled, distances[1]);
  //         let ratio = distance / distances[1];
  //         let newX = startX + dx * ratio;
  //         let newY = startY + dy * ratio;
  //         setAnimationLine([startX, startY, newX, newY]);

  //         if (distance >= distances[1]) {
  //           currentSegment = 2;
  //           totalDistanceTraveled = 0;
  //           dx = endX - midX;
  //           dy = endY - midY;
  //         }
  //       } else if (currentSegment === 2) {
  //         let distance = Math.min(totalDistanceTraveled, distances[2]);
  //         let ratio = distance / distances[2];
  //         let newX = midX + dx * ratio;
  //         let newY = midY + dy * ratio;
  //         setAnimationLine([startX, startY, midX, midY, newX, newY]);

  //         if (distance >= distances[2]) {
  //           animRef.current.stop();
  //         }
  //       }
  //     }
  //   }, layerRef.current);

  //   animRef.current.start();
  // };

  useEffect(() => {
    return () => {
      if (animRef.current) {
        animRef.current.stop();
      }
    };
  }, []);

  const handleDragMove = (e: any) => {
    const newY = e.target.y();
    setPersonPosition((prev) => ({ ...prev, y: newY }));
  };

  return (
    <Stage width={800} height={600} style={{ backgroundColor: "#c3c3c3" }}>
      <Layer ref={layerRef}>
        <Line points={rightLinePoints} stroke="black" />
        {rightMirrorPoints.map(({ x, y }, index) => (
          <Circle
            key={index}
            x={x}
            y={y}
            radius={circleRadius}
            fill="purple"
            onClick={() =>
              handleCircleClick(
                triangleCenter.x + 20,
                triangleCenter.y + 20,
                x,
                y,
                1
              )
            }
          />
        ))}
        <Line points={leftLinePoints} stroke="black" />
        {leftMirrorPoints.map(({ x, y }, index) => (
          <Circle
            key={index}
            x={x}
            y={y}
            radius={circleRadius}
            fill="purple"
            onClick={() =>
              handleCircleClick(
                triangleCenter.x + 20,
                triangleCenter.y + 20,
                x,
                y,
                0
              )
            }
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
          points={animationLine.flatMap((point) => [point.x, point.y])}
          stroke="blue"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
          pointerLength={10}
          pointerWidth={10}
        />
        <Line
          points={mirrorBoundsPointsBottom}
          stroke="orange"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
          pointerLength={10}
          pointerWidth={10}
        />
        <Line
          points={mirrorBoundsPointsTop}
          stroke="orange"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
          pointerLength={10}
          pointerWidth={10}
        />
        <Circle
          x={personPosition.x}
          y={personPosition.y}
          radius={personRadius}
          fill="blue"
          draggable
          dragBoundFunc={(pos) => ({ x: personPosition.x, y: pos.y })}
          onDragMove={handleDragMove}
        />
      </Layer>
    </Stage>
  );
};

export default MirrorDemo;
