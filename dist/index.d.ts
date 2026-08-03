import { WheelPhysicsOptions, SpinResult, WeightedOption, CoinFlipResult, DiceRollResult } from './core.js';
export { AliasMethod, CoinFlipEngine, DiceEngine, Magic8BallEngine, Magic8BallResult, TeamBalancer, TeamGroup, WheelPhysics } from './core.js';

interface UseWheelSpinReturn<T = string> {
    isSpinning: boolean;
    currentAngle: number;
    winner: WeightedOption<T> | null;
    spin: (items: WeightedOption<T>[]) => void;
    reset: () => void;
}
declare function useWheelSpin<T = string>(options?: WheelPhysicsOptions, onComplete?: (result: SpinResult<T>) => void): UseWheelSpinReturn<T>;

declare function useCoinFlip(language?: "en" | "de"): {
    isFlipping: boolean;
    result: CoinFlipResult | null;
    flip: () => void;
};

declare function useDiceRoll(): {
    isRolling: boolean;
    result: DiceRollResult | null;
    roll: (notation: string) => void;
};

export { CoinFlipResult, DiceRollResult, SpinResult, WeightedOption, WheelPhysicsOptions, useCoinFlip, useDiceRoll, useWheelSpin };
