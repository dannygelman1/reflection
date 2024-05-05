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
  const reflectedY = -slope * objectY + mirrorY + slope * mirrorX;
  return { reflectedX, reflectedY };
};
