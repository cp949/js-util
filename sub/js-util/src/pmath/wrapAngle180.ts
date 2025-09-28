export function wrapAngle180(angle: number) {
  if (angle >= -180 && angle <= 180) {
    return angle;
  }

  angle = angle % 360;
  if (angle > 180) {
    return angle - 360;
  }

  if (angle < -180) {
    return angle + 360;
  }

  return angle;
}
