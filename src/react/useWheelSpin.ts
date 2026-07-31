import { useState, useCallback, useRef } from "react";
import { SpinResult, WeightedOption, WheelPhysicsOptions } from "../types";
import { WheelPhysics } from "../algorithms/wheel-physics";

export interface UseWheelSpinReturn<T = string> {
  isSpinning: boolean;
  currentAngle: number;
  winner: WeightedOption<T> | null;
  spin: (items: WeightedOption<T>[]) => void;
  reset: () => void;
}

export function useWheelSpin<T = string>(
  options?: WheelPhysicsOptions,
  onComplete?: (result: SpinResult<T>) => void
): UseWheelSpinReturn<T> {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [winner, setWinner] = useState<WeightedOption<T> | null>(null);

  const animFrameRef = useRef<number | null>(null);
  const physicsRef = useRef(new WheelPhysics<T>(options));

  const spin = useCallback(
    (items: WeightedOption<T>[]) => {
      if (isSpinning || !items || items.length === 0) return;

      setIsSpinning(true);
      setWinner(null);

      const result = physicsRef.current.calculateSpin(items);
      const startAngle = currentAngle % 360;
      const targetAngle = startAngle + result.targetAngle;
      const duration = 4000; // 4 seconds animation
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = WheelPhysics.cubicEaseOut(progress);

        const newAngle = startAngle + (targetAngle - startAngle) * easedProgress;
        setCurrentAngle(newAngle);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          setIsSpinning(false);
          setWinner(result.winner);
          if (onComplete) onComplete(result);
        }
      };

      animFrameRef.current = requestAnimationFrame(animate);
    },
    [isSpinning, currentAngle, onComplete]
  );

  const reset = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsSpinning(false);
    setCurrentAngle(0);
    setWinner(null);
  }, []);

  return { isSpinning, currentAngle, winner, spin, reset };
}
