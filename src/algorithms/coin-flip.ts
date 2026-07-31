import { CoinFlipResult } from "../types";

export class CoinFlipEngine {
  public static flip(language: "en" | "de" = "de"): CoinFlipResult {
    const outcome: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails";
    let side: "Kopf" | "Zahl" | "Heads" | "Tails";

    if (language === "de") {
      side = outcome === "heads" ? "Kopf" : "Zahl";
    } else {
      side = outcome === "heads" ? "Heads" : "Tails";
    }

    return {
      outcome,
      side,
      flippedAt: new Date(),
    };
  }

  public static flipMultiple(count: number, language: "en" | "de" = "de"): CoinFlipResult[] {
    const safeCount = Math.max(1, Math.min(1000, count));
    return Array.from({ length: safeCount }, () => this.flip(language));
  }
}
