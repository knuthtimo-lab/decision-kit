import { DiceRollResult } from "../types";

export class DiceEngine {
  /**
   * Parse and roll tabletop RPG dice notation.
   * Supported formats:
   *  - Standard: "2d6", "1d20", "3d10+4", "1d100-5"
   *  - Keep High / Drop Low: "4d6kh3" (keep highest 3), "4d6dl1" (drop lowest 1)
   *  - Advantage / Disadvantage: "1d20 adv", "1d20 dis"
   */
  public static roll(expression: string): DiceRollResult {
    const cleanExpr = expression.trim().toLowerCase();

    // Advantage / Disadvantage handler
    if (cleanExpr.includes("adv") || cleanExpr.includes("advantage")) {
      const roll1 = this.rollSingleDie(20);
      const roll2 = this.rollSingleDie(20);
      const best = Math.max(roll1, roll2);
      return {
        notation: expression,
        rolls: [roll1, roll2],
        modifier: 0,
        total: best,
        criticalHit: best === 20,
        criticalFumble: best === 1,
        breakdown: `Advantage [${roll1}, ${roll2}] -> ${best}`,
      };
    }

    if (cleanExpr.includes("dis") || cleanExpr.includes("disadvantage")) {
      const roll1 = this.rollSingleDie(20);
      const roll2 = this.rollSingleDie(20);
      const worst = Math.min(roll1, roll2);
      return {
        notation: expression,
        rolls: [roll1, roll2],
        modifier: 0,
        total: worst,
        criticalHit: worst === 20,
        criticalFumble: worst === 1,
        breakdown: `Disadvantage [${roll1}, ${roll2}] -> ${worst}`,
      };
    }

    // Standard notation regex: (\d+)?d(\d+)(kh\d+|dl\d+)?([+-]\d+)?
    const regex = /^(\d+)?d(\d+)(kh\d+|dl\d+)?([+-]\d+)?$/;
    const match = cleanExpr.match(regex);

    if (!match) {
      // Fallback for single number or basic dX notation
      if (/^\d+$/.test(cleanExpr)) {
        const sides = parseInt(cleanExpr, 10);
        const roll = this.rollSingleDie(sides);
        return {
          notation: `1d${sides}`,
          rolls: [roll],
          modifier: 0,
          total: roll,
          breakdown: `1d${sides} (${roll})`,
        };
      }
      throw new Error(`Invalid dice notation: "${expression}". Use format like "2d6", "1d20+3", "4d6kh3"`);
    }

    const count = parseInt(match[1] || "1", 10);
    const sides = parseInt(match[2], 10);
    const keepDropModifier = match[3];
    const staticModifier = parseInt(match[4] || "0", 10);

    if (count <= 0 || sides <= 0) {
      throw new Error("Dice count and sides must be positive integers.");
    }
    if (count > 100) {
      throw new Error("Maximum 100 dice allowed per roll.");
    }

    const rawRolls: number[] = [];
    for (let i = 0; i < count; i++) {
      rawRolls.push(this.rollSingleDie(sides));
    }

    let keptRolls = [...rawRolls];
    let keepDropText = "";

    if (keepDropModifier) {
      if (keepDropModifier.startsWith("kh")) {
        const k = parseInt(keepDropModifier.replace("kh", ""), 10);
        keptRolls.sort((a, b) => b - a);
        keptRolls = keptRolls.slice(0, k);
        keepDropText = ` (keep highest ${k})`;
      } else if (keepDropModifier.startsWith("dl")) {
        const d = parseInt(keepDropModifier.replace("dl", ""), 10);
        keptRolls.sort((a, b) => a - b);
        keptRolls = keptRolls.slice(d);
        keepDropText = ` (drop lowest ${d})`;
      }
    }

    const sumKept = keptRolls.reduce((acc, val) => acc + val, 0);
    const total = sumKept + staticModifier;

    const modText = staticModifier > 0 ? `+${staticModifier}` : staticModifier < 0 ? `${staticModifier}` : "";
    const isD20 = count === 1 && sides === 20;

    return {
      notation: expression,
      rolls: rawRolls,
      modifier: staticModifier,
      total,
      criticalHit: isD20 && rawRolls[0] === 20,
      criticalFumble: isD20 && rawRolls[0] === 1,
      breakdown: `[${rawRolls.join(", ")}]${keepDropText}${modText} = ${total}`,
    };
  }

  private static rollSingleDie(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
  }
}
