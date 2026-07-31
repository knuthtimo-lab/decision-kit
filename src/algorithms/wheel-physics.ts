import { SpinResult, WeightedOption, WheelPhysicsOptions } from "../types";
import { AliasMethod } from "./alias-method";

export class WheelPhysics<T = string> {
  private options: Required<WheelPhysicsOptions>;

  constructor(options?: WheelPhysicsOptions) {
    this.options = {
      friction: options?.friction ?? 0.985,
      minRotations: options?.minRotations ?? 5,
      maxRotations: options?.maxRotations ?? 8,
      initialVelocity: options?.initialVelocity ?? 28,
    };
  }

  /**
   * Pre-calculate the spin trajectory, winning index, and target stopping angle.
   * Target angle is computed to align precisely with top (or 0-degree) pointer position.
   */
  public calculateSpin(items: WeightedOption<T>[]): SpinResult<T> {
    if (!items || items.length === 0) {
      throw new Error("Cannot calculate spin for an empty list.");
    }

    const alias = new AliasMethod(items);
    const winner = alias.next();
    const winningIndex = items.findIndex((i) => i.id === winner.id);

    const segmentAngle = 360 / items.length;
    // Calculate angle center of winning sector
    const sectorCenter = winningIndex * segmentAngle + segmentAngle / 2;

    // Add a slight random variance within the sector (keep 10% padding from edges)
    const padding = segmentAngle * 0.1;
    const variance = (Math.random() - 0.5) * (segmentAngle - 2 * padding);

    // Target stopping angle on circle
    const stopAngleOnWheel = (sectorCenter + variance + 360) % 360;

    // Pointer is at 270 deg (top) or 0 deg. Assuming pointer at top (270 deg / -90 deg):
    // Target rotation angle = (360 - stopAngleOnWheel + pointerOffset) % 360
    const pointerOffset = 270;
    const finalAngleOffset = (pointerOffset - stopAngleOnWheel + 360) % 360;

    const fullRotations =
      this.options.minRotations +
      Math.floor(Math.random() * (this.options.maxRotations - this.options.minRotations + 1));

    const totalTargetRotation = fullRotations * 360 + finalAngleOffset;

    return {
      winner,
      winningIndex,
      targetAngle: totalTargetRotation,
      rotationCount: fullRotations,
    };
  }

  /**
   * Ease out cubic timing function for smooth CSS or JS canvas wheel spin animation.
   */
  public static cubicEaseOut(progress: number): number {
    const p = Math.max(0, Math.min(1, progress));
    return 1 - Math.pow(1 - p, 3);
  }
}
