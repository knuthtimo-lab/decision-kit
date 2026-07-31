import { useState, useCallback } from "react";
import { DiceRollResult } from "../types";
import { DiceEngine } from "../algorithms/dice-parser";

export function useDiceRoll() {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<DiceRollResult | null>(null);

  const roll = useCallback((notation: string) => {
    setIsRolling(true);
    setResult(null);

    setTimeout(() => {
      try {
        const res = DiceEngine.roll(notation);
        setResult(res);
      } catch (err) {
        console.error("Dice roll failed:", err);
      } finally {
        setIsRolling(false);
      }
    }, 600); // 600ms roll animation delay
  }, []);

  return { isRolling, result, roll };
}
