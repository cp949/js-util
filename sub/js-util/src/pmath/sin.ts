/**
 * Calculate the cos of an angle, avoiding returning floats for known results
 * This function is here just to avoid getting 0.999999999999999 when dealing
 * with numbers that are really 1 or 0.
 * @param angle - the angle
 * @return the sin value for angle.
 */
export const sin = (angle: number): number => {
  if (angle === 0) {
    return 0;
  }
  const angleSlice = angle / (Math.PI / 2);
  const value = Math.sign(angle);
  switch (angleSlice) {
    case 1:
      return value;
    case 2:
      return 0;
    case 3:
      return -value;
  }
  return Math.sin(angle);
};
