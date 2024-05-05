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
  const reflectedX = isBoundRay ? objectX - 150 : objectX;
  const reflectedY = -1 * slope * reflectedX + mirrorY + slope * mirrorX;
  return { reflectedX, reflectedY };
};
