export const findlightRayPoints = (
  objectX: number,
  objectY: number,
  mirrorX: number,
  mirrorY: number,
  isBoundRay?: boolean
) => {
  const dx = mirrorX - objectX;
  const dy = mirrorY - objectY;

  const slope = dy / dx;
  // person is 150 away from left mirror
  // TODO: refactor so this only supports the bound ray or just make the bottom function work for both use cases
  const reflectedX = isBoundRay ? objectX - 150 : objectX - dx;
  const reflectedY = -1 * slope * reflectedX + mirrorY + slope * mirrorX;
  return { reflectedX, reflectedY };
};

export const findlightRayPointsRecursive = (
  objectX: number,
  objectY: number,
  mirrorX: number,
  mirrorY: number,
  mirrors: { x: number; yMin: number; yMax: number }[],
  currentMirrorIndex = 0
): { x: number; y: number }[] => {
  const dx = mirrorX - objectX;
  const dy = mirrorY - objectY;

  const slope = dy / dx;
  const reflectedX = mirrors[currentMirrorIndex ? 0 : 1].x;
  const reflectedY = -1 * slope * reflectedX + mirrorY + slope * mirrorX;

  // Base case: Check if out of mirror bounds or if there are no more mirrors
  console.log(
    reflectedY,
    mirrors[currentMirrorIndex ? 0 : 1].yMin,
    mirrors[currentMirrorIndex ? 0 : 1].yMax
  );
  if (
    reflectedY < mirrors[currentMirrorIndex ? 0 : 1].yMin ||
    reflectedY > mirrors[currentMirrorIndex ? 0 : 1].yMax
  ) {
    return [{ x: reflectedX, y: reflectedY }]; // End recursion, returning the final point
  } else {
    // Recursive case: Calculate next reflection using next mirror
    const nextMirrorIndex = currentMirrorIndex ? 0 : 1; // Loop back to first mirror if needed
    return [
      { x: reflectedX, y: reflectedY },
      ...findlightRayPointsRecursive(
        mirrorX,
        mirrorY,
        reflectedX,
        reflectedY,
        mirrors,
        nextMirrorIndex
      ),
    ];
  }
};
