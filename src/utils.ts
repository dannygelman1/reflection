export const findlightRayPoints = (
  objectX: number,
  objectY: number,
  mirrorX: number,
  mirrorY: number
) => {
  const dx = mirrorX - objectX;
  const dy = mirrorY - objectY;

  const slope = dy / dx;
  const reflectedX = objectX;
  const reflectedY = -1 * slope * objectX + mirrorY + slope * mirrorX;
  return { reflectedX, reflectedY };
};
