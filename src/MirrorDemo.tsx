import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Stage, Layer, Line } from "react-konva";
import Konva from "konva";
import {
  findLightRayPointsRecursive,
  getReflectedLineSegments,
  calculateAngle,
  checkShapeIntersection,
  colors,
} from "./utils";
import { RoomObject } from "./components/RoomObject";
import { LineSegment } from "./types";
import { Person } from "./components/Person";
import {
  numberOfPoints,
  rightMirrorX,
  leftMirrorX,
  lineLength,
  personRadius,
  personCenter,
  triangleCenter,
  startingPoint,
  trianglePoints,
  distTriangleToRightMirror,
  distTriangleToLeftMirror,
  mirrorSpacing,
} from "./constants";
import { VirtualRooms } from "./components/VirtualRooms";
import { MaskedContent } from "./components/Mask";
import { useMirrorBounds } from "./hooks/useMirrorBounds";
import { MirrorBounds } from "./components/MirrorBounds";
import { Mirror } from "./components/Mirror";

const MirrorDemo: React.FC = () => {
  const [animationLine, setAnimationLine] = useState<
    { points: number[]; color: string }[]
  >([]);
  const [lineSegments, setLineSegments] = useState<LineSegment[]>([]);

  const layerRef = useRef<Konva.Layer>(null);
  const animRef = useRef<Konva.Animation | null>(null);

  const personPositionRef = useRef({
    x: personCenter.x,
    y: personCenter.y,
    angle: calculateAngle(personCenter.x, personCenter.y, rightMirrorX, 300),
  });

  const { rightMirrorPoints } = useMemo(() => {
    const rightMirrorPoints: { x: number; y: number }[] = [];
    for (let i = startingPoint; i <= startingPoint + numberOfPoints; i++) {
      const y = (i / numberOfPoints) * lineLength;
      rightMirrorPoints.push({ x: rightMirrorX, y });
    }
    return {
      rightMirrorPoints,
    };
  }, []);

  const {
    mirrorBoundsBottomPoint,
    mirrorBoundsTopPoint,
    virtualMirrorBoundsBottomPoint,
    virtualMirrorBoundsTopPoint,
    lightRaysToPerson,
    lightRaysToMirror,
    reflectedLightRays,
  } = useMirrorBounds(personPositionRef, rightMirrorPoints);

  const { leftMirrorPoints } = useMemo(() => {
    const leftMirrorPoints: { x: number; y: number }[] = [];

    for (let i = startingPoint; i <= startingPoint + numberOfPoints; i++) {
      const y = (i / numberOfPoints) * lineLength;

      if (
        y < mirrorBoundsBottomPoint.reflectedY &&
        y > mirrorBoundsTopPoint.reflectedY
      ) {
        leftMirrorPoints.push({ x: leftMirrorX, y });
      }
    }

    return { leftMirrorPoints };
  }, [mirrorBoundsBottomPoint.reflectedY, mirrorBoundsTopPoint.reflectedY]);

  const mirrors = useMemo(
    () => [
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
    ],
    [
      mirrorBoundsBottomPoint.reflectedY,
      mirrorBoundsTopPoint.reflectedY,
      rightMirrorPoints,
    ]
  );

  const handleMirrorPointClick = (
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

  const animateLine = useCallback((points: { x: number; y: number }[]) => {
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

          let lineSegment = {
            x1: points[currentSegment].x,
            y1: points[currentSegment].y,
            x2: newX,
            y2: newY,
          };

          if (
            checkShapeIntersection(
              trianglePoints[0],
              trianglePoints[1],
              trianglePoints[2],
              lineSegment
            ) &&
            currentSegment >= 1
          ) {
            animRef.current.stop();
          }
          let distanceToPerson = Math.sqrt(
            (newX - personPositionRef.current.x) ** 2 +
              (newY - personPositionRef.current.y) ** 2
          );
          if (distanceToPerson <= personRadius) {
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
            if (newX < points[currentSegment].x) {
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
            }
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
  }, []);

  useEffect(() => {
    return () => {
      if (animRef.current) {
        animRef.current.stop();
      }
    };
  }, []);

  const handleDragMove = (e: any) => {
    const newY = e.target.y();
    animRef.current?.stop();
    const newAngle = calculateAngle(
      personPositionRef.current.x,
      newY,
      rightMirrorX,
      300
    );

    personPositionRef.current = {
      x: personCenter.x,
      y: newY,
      angle: newAngle,
    };

    setAnimationLine([{ points: [], color: "" }]);
    setLineSegments([]);
  };

  const startAnimation = (lineSegments: LineSegment[]) => {
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
      className="scrollbar"
      style={{
        width: "100%",
        maxWidth: "800px",
        height: "600px",
        overflowY: "hidden",
        whiteSpace: "nowrap",
        border: "4px #347aeb solid",
      }}
    >
      <Stage
        width={1500}
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
            <VirtualRooms
              personPosition={{
                y: personPositionRef.current.y,
                angle: personPositionRef.current.angle,
              }}
              lineSegments={lineSegments}
            />
          </MaskedContent>

          <MirrorBounds
            mirrorBounds={[
              lightRaysToPerson,
              lightRaysToMirror,
              reflectedLightRays,
            ]}
          />

          <Mirror
            x={leftMirrorX}
            opacity={0.8}
            mirrorPoints={leftMirrorPoints}
            mirrorIndex={0}
            handleMirrorPointClick={handleMirrorPointClick}
          />
          <Mirror
            x={rightMirrorX}
            opacity={0.8}
            mirrorPoints={rightMirrorPoints}
            mirrorIndex={1}
            handleMirrorPointClick={handleMirrorPointClick}
          />

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

          <RoomObject x={triangleCenter.x} y={triangleCenter.y} />

          <Person
            x={personCenter.x}
            y={personPositionRef.current.y}
            radius={personRadius}
            angle={personPositionRef.current.angle}
            fill="#347aeb"
            onDragMove={handleDragMove}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default MirrorDemo;
