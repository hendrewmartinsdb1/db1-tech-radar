import { ConfigData } from "../../config";

export const DEG_TO_RAD = Math.PI / 180;

export const segmentCount = (config: ConfigData): number =>
  Object.keys(config.quadrantsMap).length;

export const slotOf = (q: { position: number; order?: number }): number =>
  q.order ?? q.position;

export function segmentAngles(slot: number, numSegments: number) {
  const angleIncrement = 360 / numSegments;
  const startAngle = (slot - 1) * angleIncrement;
  return { startAngle, endAngle: startAngle + angleIncrement, angleIncrement };
}
