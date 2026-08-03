interface WeightedOption<T = string> {
    id: T;
    weight: number;
    label?: string;
    color?: string;
}
interface SpinResult<T = string> {
    winner: WeightedOption<T>;
    winningIndex: number;
    targetAngle: number;
    rotationCount: number;
}
interface WheelPhysicsOptions {
    friction?: number;
    minRotations?: number;
    maxRotations?: number;
    initialVelocity?: number;
}
interface DiceRollResult {
    notation: string;
    rolls: number[];
    modifier: number;
    total: number;
    criticalHit?: boolean;
    criticalFumble?: boolean;
    breakdown: string;
}
interface TeamGroup<T = string> {
    id: number;
    name: string;
    members: T[];
}
interface CoinFlipResult {
    outcome: "heads" | "tails";
    side: "Kopf" | "Zahl" | "Heads" | "Tails";
    flippedAt: Date;
}
interface Magic8BallResult {
    answer: string;
    category: "positive" | "neutral" | "negative";
    language: "en" | "de";
}

/**
 * Vose's Alias Method implementation for O(1) weighted random selection.
 * Preprocessing time: O(N)
 * Sampling time: O(1)
 */
declare class AliasMethod<T = string> {
    private probabilities;
    private alias;
    private items;
    constructor(items: WeightedOption<T>[]);
    /**
     * Sample an item in O(1) constant time.
     */
    next(): WeightedOption<T>;
    /**
     * Sample an item index in O(1) constant time.
     */
    nextIndex(): number;
}

declare class WheelPhysics<T = string> {
    private options;
    constructor(options?: WheelPhysicsOptions);
    /**
     * Pre-calculate the spin trajectory, winning index, and target stopping angle.
     * Target angle is computed to align precisely with top (or 0-degree) pointer position.
     */
    calculateSpin(items: WeightedOption<T>[]): SpinResult<T>;
    /**
     * Ease out cubic timing function for smooth CSS or JS canvas wheel spin animation.
     */
    static cubicEaseOut(progress: number): number;
}

declare class DiceEngine {
    /**
     * Parse and roll tabletop RPG dice notation.
     * Supported formats:
     *  - Standard: "2d6", "1d20", "3d10+4", "1d100-5"
     *  - Keep High / Drop Low: "4d6kh3" (keep highest 3), "4d6dl1" (drop lowest 1)
     *  - Advantage / Disadvantage: "1d20 adv", "1d20 dis"
     */
    static roll(expression: string): DiceRollResult;
    private static rollSingleDie;
}

declare class TeamBalancer {
    /**
     * Distribute a list of members randomly & fairly into N groups/teams.
     * Uses crypto-quality Fisher-Yates shuffle.
     */
    static divideTeams<T = string>(members: T[], teamCount: number, teamNames?: string[]): TeamGroup<T>[];
    /**
     * Pick K unique random winners/candidates from a list without replacement.
     */
    static pickMultiple<T = string>(items: T[], count: number): T[];
}

declare class Magic8BallEngine {
    static ask(language?: "en" | "de"): Magic8BallResult;
}

declare class CoinFlipEngine {
    static flip(language?: "en" | "de"): CoinFlipResult;
    static flipMultiple(count: number, language?: "en" | "de"): CoinFlipResult[];
}

export { AliasMethod, CoinFlipEngine, type CoinFlipResult, DiceEngine, type DiceRollResult, Magic8BallEngine, type Magic8BallResult, type SpinResult, TeamBalancer, type TeamGroup, type WeightedOption, WheelPhysics, type WheelPhysicsOptions };
