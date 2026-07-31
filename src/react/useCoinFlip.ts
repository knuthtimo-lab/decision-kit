import { useState, useCallback } from "react";
import { CoinFlipResult } from "../types";
import { CoinFlipEngine } from "../algorithms/coin-flip";

export function useCoinFlip(language: "en" | "de" = "de") {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<CoinFlipResult | null>(null);

  const flip = useCallback(() => {
    setIsFlipping(true);
    setResult(null);

    setTimeout(() => {
      const res = CoinFlipEngine.flip(language);
      setResult(res);
      setIsFlipping(false);
    }, 800); // 800ms flip duration
  }, [language]);

  return { isFlipping, result, flip };
}
