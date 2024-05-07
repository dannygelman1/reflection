import React, { useState, useEffect, useRef, ReactNode } from "react";
import { Stage, Layer, Line, Circle, Shape, Group } from "react-konva";
import Konva from "konva";
import {
  findRoomBounds,
  findVirtualRoomBounds,
  findLightRayPointsRecursive,
  getReflectedLineSegments,
} from "./utils";
import { RoomObject } from "./components/RoomObject";
import { LineSegment } from "./types";

const MirrorDemo: React.FC = () => {
  const lineLength = 200;

  const rightMirrorX = 400;
  const rightMirrorPoints: { x: number; y: number }[] = [];

  const leftMirrorX = 200;
  const leftMirrorPoints: { x: number; y: number }[] = [];

  const circleRadius = 3;
  const hoveredCircleRadius = 6;
  const numberOfPoints = 40;
  const [hoveredRightIndex, setHoveredRightIndex] = useState<number>(-1);
  const [hoveredLeftIndex, setHoveredLeftIndex] = useState<number>(-1);

  const startingPoint = numberOfPoints;
  const triangleCenter = { x: 270, y: 275 };
  const personCenter = { x: 350, y: 480 };
  const distTriangleToRightMirror = Math.abs(rightMirrorX - triangleCenter.x);
  const distTriangleToLeftMirror = Math.abs(leftMirrorX - triangleCenter.x);
  const distPersonToRightMirror = Math.abs(rightMirrorX - personCenter.x);
  const distPersonToLeftMirror = Math.abs(leftMirrorX - personCenter.x);
  const mirrorSpacing = rightMirrorX - leftMirrorX;

  const personRadius = 14;

  const [animationLine, setAnimationLine] = useState<
    { points: number[]; color: string }[]
  >([]);
  const [personPosition, setPersonPosition] = useState(personCenter);
  const virtualTriangles: { x: number; y: number; mirrored?: boolean }[] = [];
  const virtualMirrors: { x: number }[] = [];
  const virtualPerson: { x: number; y: number }[] = [];

  const addVirtualRoomElements = (bounces: number) => {
    const distanceTriangleFinalSegment =
      bounces % 2 === 1 ? distTriangleToRightMirror : distTriangleToLeftMirror;
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
    rightMirrorPoints[numberOfPoints].y,
    leftMirrorX
  );
  const mirrorBoundsTopPoint = findRoomBounds(
    personPosition.x,
    personPosition.y,
    rightMirrorPoints[0].x,
    rightMirrorPoints[0].y,
    leftMirrorX
  );

  const mirrorBoundsBottomPointBackRoom = findRoomBounds(
    personPosition.x,
    personPosition.y,
    rightMirrorPoints[numberOfPoints].x,
    rightMirrorPoints[numberOfPoints].y,
    0
  );
  const mirrorBoundsTopPointBackRoom = findRoomBounds(
    personPosition.x,
    personPosition.y,
    rightMirrorPoints[0].x,
    rightMirrorPoints[0].y,
    0
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
  const lightRaysToPerson = [
    { x: personPosition.x, y: personPosition.y + personRadius / 2 },
    { x: personPosition.x, y: personPosition.y - personRadius / 2 },
    { x: rightMirrorPoints[0].x, y: rightMirrorPoints[0].y },
    {
      x: rightMirrorPoints[numberOfPoints].x,
      y: rightMirrorPoints[numberOfPoints].y,
    },
  ];
  const lightRaysToMirror = [
    { x: rightMirrorPoints[0].x, y: rightMirrorPoints[0].y },
    {
      x: rightMirrorPoints[numberOfPoints].x,
      y: rightMirrorPoints[numberOfPoints].y,
    },
    {
      x: mirrorBoundsBottomPointBackRoom.reflectedX,
      y: mirrorBoundsBottomPointBackRoom.reflectedY,
    },
    {
      x: mirrorBoundsTopPointBackRoom.reflectedX,
      y: mirrorBoundsTopPointBackRoom.reflectedY,
    },
  ];
  const reflectedLightRays = [
    { x: rightMirrorPoints[0].x, y: rightMirrorPoints[0].y },
    {
      x: rightMirrorPoints[numberOfPoints].x,
      y: rightMirrorPoints[numberOfPoints].y,
    },
    {
      x: virtualMirrorBoundsBottomPoint.newX,
      y: virtualMirrorBoundsBottomPoint.newY,
    },
    {
      x: virtualMirrorBoundsTopPoint.newX,
      y: virtualMirrorBoundsTopPoint.newY,
    },
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
    setLineSegments([]);
  };

  const animateLine = (points: { x: number; y: number }[]) => {
    let totalDistanceTraveled = 0;
    let currentSegment = 0;
    let distances = points
      .slice(1)
      .map((point, i) =>
        Math.sqrt((point.x - points[i].x) ** 2 + (point.y - points[i].y) ** 2)
      );

    // const colors = [
    //   "#00BFFF",
    //   "#800080",
    //   "#FFA500",
    //   "#00FA9A",
    //   "#FF69B4",
    //   "#6A5ACD",
    //   "#FFD700",
    //   "#32CD32",
    //   "#4682B4",
    //   "#FF6347",
    // ].reverse();
    const colors = [
      "#FF6347",
      "#4682B4",
      "#32CD32",
      "#FFD700",
      "#6A5ACD",
      "#FF69B4",
      "#00FA9A",
      "#FFA500",
      "#800080",
      "#00BFFF",
    ];

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

          // Intersection check (assuming the circle's center and radius are defined)
          let distanceToPerson = Math.sqrt(
            (newX - personPosition.x) ** 2 + (newY - personPosition.y) ** 2
          );
          if (
            distanceToPerson <= personRadius &&
            newX < points[currentSegment].x
          ) {
            animRef.current.stop();
            // Finalize the line to the intersection point
            setAnimationLine(
              [
                ...points.slice(0, currentSegment + 1),
                { x: newX, y: newY },
              ].map((point, index, arr) => ({
                points: arr[index + 1]
                  ? [point.x, point.y, arr[index + 1].x, arr[index + 1].y]
                  : [point.x, point.y],
                color: colors[index % colors.length],
              }))
            );
            let newPoints = points.slice(0, currentSegment + 1);
            newPoints.reverse();
            const reflectedSegments = getReflectedLineSegments(
              rightMirrorX,
              distTriangleToRightMirror,
              distTriangleToLeftMirror,
              mirrorSpacing,
              newPoints
            );
            startAnimation(reflectedSegments);
            return;
          }

          // Update the line segments with the new point
          const updatedSegments = [
            ...points.slice(0, currentSegment + 1),
            { x: newX, y: newY },
          ].map((point, index, arr) => ({
            points: arr[index + 1]
              ? [point.x, point.y, arr[index + 1].x, arr[index + 1].y]
              : [point.x, point.y],
            color: colors[index % colors.length],
          }));
          setAnimationLine(updatedSegments);
        } else {
          // Complete the animation if all segments are done
          animRef.current.stop();
          setAnimationLine(
            points.map((point, index) => ({
              points: [
                point.x,
                point.y,
                points[index + 1]?.x,
                points[index + 1]?.y,
              ].filter((p) => p !== undefined),
              color: colors[index % colors.length],
            }))
          );
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
    setAnimationLine([{ points: [], color: "" }]);
    setLineSegments([]);
  };

  const [lineSegments, setLineSegments] = useState<LineSegment[]>([]);

  const startAnimation = (lineSegments: LineSegment[]) => {
    console.log("lineSegments", lineSegments);
    setLineSegments(lineSegments);

    animRef.current = new Konva.Animation((frame) => {
      if (frame) {
        const timeDelta = frame.timeDiff;
        const speed = 0.003;

        setLineSegments((prevSegments) =>
          prevSegments.map((seg, index) => {
            if (index === 0 || prevSegments[index - 1].opacity >= 1) {
              const progress = Math.min(seg.opacity + speed * timeDelta, 1);
              return { ...seg, opacity: progress };
            }
            return seg;
          })
        );
      }
    }, layerRef.current);

    animRef.current.start();
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
            {lineSegments.map((segment, index) => (
              <Line
                key={index}
                points={[
                  segment.start.x,
                  segment.start.y,
                  segment.end.x,
                  segment.end.y,
                ]}
                stroke={segment.color}
                strokeWidth={3}
                lineCap="round"
                lineJoin="round"
                opacity={segment.opacity}
              />
            ))}
          </MaskedContent>
          <Shape
            sceneFunc={(context, shape) => {
              context.beginPath();
              lightRaysToPerson.forEach((point, index) => {
                if (index === 0) {
                  context.moveTo(point.x, point.y);
                } else {
                  context.lineTo(point.x, point.y);
                }
              });
              context.closePath();
              context.fillStrokeShape(shape);
            }}
            fill="yellow"
            opacity={0.3}
          />
          <Shape
            sceneFunc={(context, shape) => {
              context.beginPath();
              lightRaysToMirror.forEach((point, index) => {
                if (index === 0) {
                  context.moveTo(point.x, point.y);
                } else {
                  context.lineTo(point.x, point.y);
                }
              });
              context.closePath();
              context.fillStrokeShape(shape);
            }}
            fill="yellow"
            opacity={0.3}
          />
          <Shape
            sceneFunc={(context, shape) => {
              context.beginPath();
              reflectedLightRays.forEach((point, index) => {
                if (index === 0) {
                  context.moveTo(point.x, point.y);
                } else {
                  context.lineTo(point.x, point.y);
                }
              });
              context.closePath();
              context.fillStrokeShape(shape);
            }}
            fill="yellow"
            opacity={0.1}
          />
          <Line points={rightLinePoints} stroke="black" />
          {rightMirrorPoints.map(({ x, y }, index) => (
            <Circle
              key={index}
              x={x}
              y={y}
              fill="purple"
              radius={
                hoveredRightIndex === index ? hoveredCircleRadius : circleRadius
              }
              onMouseEnter={() => setHoveredRightIndex(index)}
              onMouseLeave={() => setHoveredRightIndex(-1)}
              onClick={() =>
                handleCircleClick(triangleCenter.x, triangleCenter.y, x, y, 1)
              }
            />
          ))}
          <Line points={leftLinePoints} stroke="black" />
          {leftMirrorPoints.map(({ x, y }, index) => (
            <Circle
              key={index}
              x={x}
              y={y}
              radius={
                hoveredLeftIndex === index ? hoveredCircleRadius : circleRadius
              }
              onMouseEnter={() => setHoveredLeftIndex(index)}
              onMouseLeave={() => setHoveredLeftIndex(-1)}
              fill="purple"
              onClick={() =>
                handleCircleClick(triangleCenter.x, triangleCenter.y, x, y, 0)
              }
            />
          ))}

          <RoomObject x={triangleCenter.x} y={triangleCenter.y} />
          {animationLine.map((segment, index) => (
            <Line
              key={index}
              points={segment.points}
              stroke={segment.color}
              strokeWidth={2}
              lineCap="round"
              lineJoin="round"
            />
          ))}

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
