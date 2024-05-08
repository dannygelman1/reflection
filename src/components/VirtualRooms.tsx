import {
  dotsY,
  leftMirrorX,
  maxVirtualRooms,
  mirrorSpacing,
  personCenter,
  personRadius,
  rightMirrorX,
  triangleCenter,
} from "../constants";
import { Person } from "./Person";
import { useMemo } from "react";
import { RoomObject } from "./RoomObject";
import { Circle, Line } from "react-konva";
import { Mirror } from "./Mirror";
import { LineSegment } from "../types";

interface VirtualRoomsProps {
  personPosition: { y: number; angle: number };
  lineSegments: LineSegment[];
}

export const VirtualRooms = ({
  personPosition,
  lineSegments,
}: VirtualRoomsProps) => {
  const virtualPerson = useMemo(() => {
    const persons = [];
    for (let i = 1; i <= maxVirtualRooms; i++) {
      const mirrorX = i % 2 === 1 ? rightMirrorX : leftMirrorX;
      const distancePersonFinalSegment = Math.abs(mirrorX - personCenter.x);
      const newPersonX =
        rightMirrorX + (i - 1) * mirrorSpacing + distancePersonFinalSegment;
      persons.push({ x: newPersonX, y: personCenter.y });
    }
    return persons;
  }, []);

  const virtualTriangles = useMemo(() => {
    const triangles = [];
    for (let i = 1; i <= maxVirtualRooms; i++) {
      const mirrorX = i % 2 === 1 ? rightMirrorX : leftMirrorX;
      const distanceTriangleFinalSegment = Math.abs(mirrorX - triangleCenter.x);
      const newTriangleX =
        rightMirrorX + (i - 1) * mirrorSpacing + distanceTriangleFinalSegment;
      triangles.push({
        x: newTriangleX,
        y: triangleCenter.y,
        mirrored: i % 2 === 1,
      });
    }
    return triangles;
  }, []);

  const virtualMirrors = useMemo(() => {
    const mirrors = [];
    for (let i = 1; i <= maxVirtualRooms; i++) {
      mirrors.push({ x: rightMirrorX + mirrorSpacing * i });
    }
    return mirrors;
  }, []);

  const dotDotDot = useMemo(() => {
    const dots = [];
    for (let i = 0; i < 3; i++) {
      dots.push({
        x: rightMirrorX + 40 + mirrorSpacing * 4 + i * 30,
        y: dotsY,
      });
    }
    return dots;
  }, []);

  return (
    <>
      {virtualPerson.map((person, index) => (
        <Person
          key={`reflected_person_${index}`}
          x={person.x}
          y={personPosition.y}
          angle={personPosition.angle}
          radius={personRadius}
          isMirrored={index % 2 === 0}
          fill="#74a2ed"
        />
      ))}
      {virtualMirrors.map((mirror, index) => (
        <Mirror key={`reflected_mirror_${index}`} x={mirror.x} opacity={0.4} />
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
          opacity={segment.opacity * 0.5}
          dash={index > 3 ? [5, 5] : []}
        />
      ))}
      {virtualTriangles.map((triangle, index) => (
        <RoomObject
          key={`room_object_${index}`}
          x={triangle.x}
          y={triangle.y}
          mirrored={triangle.mirrored}
          inVirtualRoom
        />
      ))}
      {dotDotDot.map((point, index) => (
        <Circle
          key={`dot_${index}`}
          x={point.x}
          y={point.y}
          radius={4}
          fill="#6250e6"
          opacity={0.4}
        />
      ))}
    </>
  );
};
