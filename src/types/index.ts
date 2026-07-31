export interface WeightedOption<T = string> {
  id: T;
  weight: number;
  label?: string;
  color?: string;
}

export interface SpinResult<T = string> {
  winner: WeightedOption<T>;
  winningIndex: number;
  targetAngle: number;
  rotationCount: number;
}

export interface WheelPhysicsOptions {
  friction?: number; // Deceleration rate per frame (default: 0.985)
  minRotations?: number; // Minimum full rotations before stopping (default: 4)
  maxRotations?: number; // Maximum full rotations before stopping (default: 8)
  initialVelocity?: number; // Initial speed in deg/frame (default: 25)
}

export interface DiceRollResult {
  notation: string;
  rolls: number[];
  modifier: number;
  total: number;
  criticalHit?: boolean;
  criticalFumble?: boolean;
  breakdown: string;
}

export interface TeamGroup<T = string> {
  id: number;
  name: string;
  members: T[];
}

export interface CoinFlipResult {
  outcome: "heads" | "tails";
  side: "Kopf" | "Zahl" | "Heads" | "Tails";
  flippedAt: Date;
}

export interface Magic8BallResult {
  answer: string;
  category: "positive" | "neutral" | "negative";
  language: "en" | "de";
}
