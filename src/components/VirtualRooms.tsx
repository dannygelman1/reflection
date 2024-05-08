import {
  leftMirrorX,
  maxVirtualRooms,
  personCenter,
  personRadius,
  rightMirrorX,
} from "../constants";
import { Person } from "./Person";
import { useMemo } from "react";

interface VirtualRoomsProps {
  personPosition: { y: number; angle: number };
}

export const VirtualRooms = ({ personPosition }: VirtualRoomsProps) => {
  const mirrorSpacing = rightMirrorX - leftMirrorX;

  const virtualPerson = useMemo(() => {
    const persons = [];
    for (let i = 0; i <= maxVirtualRooms; i++) {
      const mirrorX = i % 2 === 1 ? rightMirrorX : leftMirrorX;
      const distancePersonFinalSegment = Math.abs(mirrorX - personCenter.x);
      const newPersonX =
        rightMirrorX + (i - 1) * mirrorSpacing + distancePersonFinalSegment;
      persons.push({ x: newPersonX, y: personCenter.y });
    }
    return persons;
  }, [mirrorSpacing]);

  return (
    <>
      {virtualPerson.map((person, index) => (
        <Person
          key={`reflected_person_${index}`}
          x={person.x}
          y={personPosition.y}
          angle={personPosition.angle}
          radius={personRadius}
          index={index}
          fill="#74a2ed"
        />
      ))}
    </>
  );
};
