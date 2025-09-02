import { units } from "./constants.js";
import type { RtfValue } from "./types.js";

export function getOptimalRtfValues(elapsed: number): RtfValue & {
  nextUpdateIn: number;
} {
  const absElapsed = Math.abs(elapsed);

  const [unit, millis] =
    units.find(([_, millis]) => absElapsed >= millis) ?? units.at(-1)!;

  const value = Math.trunc(elapsed / millis);
  const nextUpdateIn = millis - (absElapsed % millis);
  return { value, unit, nextUpdateIn };
}
