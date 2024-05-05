import React, { useState, useEffect, useRef, ReactNode } from "react";
import { Stage, Layer, Line, Circle, Shape, Group } from "react-konva";
import Konva from "konva";
import {
  findRoomBounds,
  findVirtualRoomBounds,
  findLightRayPointsRecursive,
} from "./utils";
import { RoomObject } from "./components/RoomObject";

const MirrorDemo: React.FC = () => {
  const lineLength = 200;

  const rightMirrorX = 400;
  const rightMirrorPoints: { x: number; y: number }[] = [];

  const leftMirrorX = 200;
  const leftMirrorPoints: { x: number; y: number }[] = [];

  const circleRadius = 5;
  const numberOfPoints = 20;
  const startingPoint = numberOfPoints;
  const triangleCenter = { x: 245, y: 250 };
  const personCenter = { x: 350, y: 480 };
  const distTriangeToRightMirror = Math.abs(rightMirrorX - triangleCenter.x);
  const distTriangeToLeftMirror = Math.abs(leftMirrorX - triangleCenter.x);
  const distPersonToRightMirror = Math.abs(rightMirrorX - personCenter.x);
  const distPersonToLeftMirror = Math.abs(leftMirrorX - personCenter.x);
  const mirrorSpacing = rightMirrorX - leftMirrorX;

  const personRadius = 14;

  const [animationLine, setAnimationLine] = useState<
    { x: number; y: number }[]
  >([]);
  const [personPosition, setPersonPosition] = useState(personCenter);
  const virtualTriangles: { x: number; y: number; mirrored?: boolean }[] = [];
  const virtualMirrors: { x: number }[] = [];
  const virtualPerson: { x: number; y: number }[] = [];

  const addVirtualRoomElements = (bounces: number) => {
    const distanceTriangleFinalSegment =
      bounces % 2 === 1 ? distTriangeToRightMirror : distTriangeToLeftMirror;
    const distancePersonFinalSegment =
      bounces % 2 === 1 ? distPersonToRightMirror : distPersonToLeftMirror;
    const newTriangleX =
      rightMirrorX +
      (bounces - 1) * mirrorSpacing +
      distanceTriangleFinalSegment;
    const newPersonX =
      rightMirrorX + (bounces - 1) * mirrorSpacing + distancePersonFinalSegment;
    const newPerson = {
      x: newPersonX,
      y: personPosition.y,
    };
    const newTriangle = {
      x: newTriangleX,
      y: triangleCenter.y,
      mirrored: bounces % 2 === 1,
    };
    const newMirror = { x: rightMirrorX + mirrorSpacing * bounces };
    virtualTriangles.push(newTriangle);
    virtualMirrors.push(newMirror);
    virtualPerson.push(newPerson);
    // setVirtuaPerson((prev) => [...prev, newPerson]);
    // setVirtualTriangles((prev) => [...prev, newTriangle]);
    // setVirtualMirrors((prev) => [...prev, newMirror]);
  };
  for (let i = 0; i < 20; i++) {
    addVirtualRoomElements(i);
  }

  const layerRef = useRef<Konva.Layer>(null);
  const animRef = useRef<Konva.Animation | null>(null);

  for (let i = startingPoint; i <= startingPoint + numberOfPoints; i++) {
    const y = (i / numberOfPoints) * lineLength;
    rightMirrorPoints.push({ x: rightMirrorX, y });
  }
  const rightLinePoints = rightMirrorPoints.flatMap((p) => [p.x, p.y]);

  const mirrorBoundsBottomPoint = findRoomBounds(
    personPosition.x,
    personPosition.y,
    rightMirrorPoints[numberOfPoints].x,
    rightMirrorPoints[numberOfPoints].y
  );
  const mirrorBoundsTopPoint = findRoomBounds(
    personPosition.x,
    personPosition.y,
    rightMirrorPoints[0].x,
    rightMirrorPoints[0].y
  );
  const virtualMirrorBoundsBottomPoint = findVirtualRoomBounds(
    personPosition.x,
    personPosition.y,
    rightMirrorPoints[numberOfPoints].x,
    rightMirrorPoints[numberOfPoints].y
  );
  const virtualMirrorBoundsTopPoint = findVirtualRoomBounds(
    personPosition.x,
    personPosition.y,
    rightMirrorPoints[0].x,
    rightMirrorPoints[0].y
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
  const virtualMirrorBoundsPointsBottom = [
    personPosition.x,
    personPosition.y,
    rightMirrorPoints[numberOfPoints].x,
    rightMirrorPoints[numberOfPoints].y,
    virtualMirrorBoundsBottomPoint.newX,
    virtualMirrorBoundsBottomPoint.newY,
  ];
  const virtualMirrorBoundsPointsTop = [
    personPosition.x,
    personPosition.y,
    rightMirrorPoints[0].x,
    rightMirrorPoints[0].y,
    virtualMirrorBoundsTopPoint.newX,
    virtualMirrorBoundsTopPoint.newY,
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
      yMin: Math.max(200, mirrorBoundsTopPoint.reflectedY),
      yMax: Math.min(400, mirrorBoundsBottomPoint.reflectedY),
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
    mirrorIndex: number
  ) => {
    animRef.current?.stop();
    const points = findLightRayPointsRecursive(
      startX,
      startY,
      endX,
      endY,
      mirrors,
      mirrorIndex
    );
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
          // Check if the current point is inside the circle (person)
          if (newX < points[currentSegment].x) {
            let distanceToPerson = Math.sqrt(
              Math.pow(newX - personPosition.x, 2) +
                Math.pow(newY - personPosition.y, 2)
            );
            if (distanceToPerson <= personRadius) {
              animRef.current.stop();
              setAnimationLine(
                points
                  .slice(0, currentSegment + 1)
                  .concat([{ x: newX, y: newY }])
              );
            }
          }
        } else {
          setAnimationLine(points);
          animRef.current.stop();
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

  const handleDragMove = (e: any) => {
    const newY = e.target.y();
    setPersonPosition((prev) => ({ ...prev, y: newY }));
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        height: "600px",
        overflowY: "hidden",
        overflowX: "auto",
        whiteSpace: "nowrap",
        border: "1px green solid",
      }}
    >
      <Stage
        width={2200}
        height={600}
        style={{ backgroundColor: "#c3c3c3", display: "inline-block" }}
      >
        <Layer ref={layerRef}>
          <MaskedContent
            maskPoints={[
              {
                x: virtualMirrorBoundsBottomPoint.newX,
                y: virtualMirrorBoundsBottomPoint.newY,
              },
              {
                x: virtualMirrorBoundsTopPoint.newX,
                y: virtualMirrorBoundsTopPoint.newY,
              },

              {
                x: rightMirrorX,
                y: rightMirrorPoints[0].y,
              },
              {
                x: rightMirrorX,
                y: rightMirrorPoints[rightMirrorPoints.length - 1].y,
              },
            ]}
          >
            {virtualTriangles.map((triangle, index) => (
              <RoomObject
                key={`room_object_${index}`}
                x={triangle.x}
                y={triangle.y}
                mirrored={triangle.mirrored}
                inVirtualRoom
              />
            ))}
            {virtualPerson.map((person, index) => (
              <Circle
                key={`person_${index}`}
                x={person.x}
                y={personPosition.y}
                radius={personRadius}
                fill="blue"
                opacity={0.1}
              />
            ))}
            {virtualMirrors.map((mirror, index) => (
              <Line
                key={index}
                points={[
                  mirror.x,
                  (startingPoint / numberOfPoints) * lineLength,
                  mirror.x,
                  ((startingPoint + numberOfPoints) / numberOfPoints) *
                    lineLength,
                ]}
                stroke="blue"
                strokeWidth={2}
                opacity={0.1}
              />
            ))}
          </MaskedContent>
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

          <RoomObject x={triangleCenter.x} y={triangleCenter.y} />
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
          <Line
            points={virtualMirrorBoundsPointsBottom}
            stroke="orange"
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
            pointerLength={10}
            pointerWidth={10}
          />
          <Line
            points={virtualMirrorBoundsPointsTop}
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
    </div>
  );
};

export default MirrorDemo;

interface MaskedContentProps {
  maskPoints: { x: number; y: number }[];
  children: ReactNode;
}
const MaskedContent = ({ maskPoints, children }: MaskedContentProps) => {
  return (
    <Group>
      {children}
      {/* The masking shape */}
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
          // Fill is important for the mask to work
          context.fillStrokeShape(shape);
        }}
        fill="white"
        globalCompositeOperation="destination-in"
      />
      {/* Child elements that the mask will be applied to */}
    </Group>
  );
};
