# decision-kit

Reusable TypeScript utilities for the small moments when an application needs
to make a fair random choice: weighted picks, wheel spins, dice rolls, coin
flips, team allocation, and Magic 8-Ball answers.

Use the framework-agnostic core in Node.js or the browser. When you are using
React, optional hooks provide the state needed to animate a wheel, roll dice,
or flip a coin.

[Explore the live decision tools on Entscheidomat](https://entscheidomat.com) ·
[Installation](#installation) · [Examples](#examples) · [CLI](#cli)

## What is included?

- `AliasMethod` — weighted random selection with O(n) setup and O(1) draws
- `WheelPhysics` — a winner, stopping angle, rotation count, and easing helper
  for a spinner-wheel UI
- `DiceEngine` — common tabletop notation such as `2d6+3`, `4d6kh3`, and
  d20 advantage/disadvantage
- `TeamBalancer` — shuffled, evenly sized teams and draws without replacement
- `CoinFlipEngine` and `Magic8BallEngine` — small random-decision primitives
  with English and German output
- `useWheelSpin`, `useCoinFlip`, and `useDiceRoll` — optional React hooks

## Installation

After the package is published to npm:

```bash
npm install decision-kit
# or: pnpm add decision-kit
# or: yarn add decision-kit
```

The core library has no runtime dependencies. React is an optional peer
dependency and is only needed when importing one of the React hooks.

## Examples

### Pick from weighted options

Use `AliasMethod` when the same weighted list is sampled repeatedly. The
preprocessing happens once; each subsequent selection is constant time.

```ts
import { AliasMethod } from "decision-kit";

const loot = new AliasMethod([
  { id: "common", label: "Common", weight: 70 },
  { id: "rare", label: "Rare", weight: 25 },
  { id: "legendary", label: "Legendary", weight: 5 },
]);

console.log(loot.next());
// { id: "rare", label: "Rare", weight: 25 } (example)
```

### Roll tabletop dice

```ts
import { DiceEngine } from "decision-kit";

const roll = DiceEngine.roll("4d6kh3");

console.log(roll.total);
console.log(roll.breakdown);
// [6, 5, 4, 2] (keep highest 3) = 15 (example)
```

Supported notation includes standard rolls (`2d6`, `1d20+4`), keep-highest
and drop-lowest modifiers (`4d6kh3`, `4d6dl1`), plus `adv` / `advantage` and
`dis` / `disadvantage` for d20 rolls.

### Build a spinner wheel

`WheelPhysics` selects an option according to its weight and returns the
rotation needed to place its segment under a top pointer. Render and animate
the wheel however you prefer.

```ts
import { WheelPhysics } from "decision-kit";

const options = [
  { id: "pizza", label: "Pizza", weight: 1 },
  { id: "sushi", label: "Sushi", weight: 1 },
  { id: "curry", label: "Curry", weight: 1 },
];

const spin = new WheelPhysics().calculateSpin(options);

console.log(spin.winner.label);
console.log(spin.targetAngle); // rotate the wheel to this angle
```

### Split people into teams

```ts
import { TeamBalancer } from "decision-kit";

const teams = TeamBalancer.divideTeams(
  ["Ada", "Ben", "Chris", "Dana", "Emil", "Fatima"],
  2,
  ["Blue", "Gold"]
);

console.log(teams);
```

### Use the React wheel hook

```tsx
import { useWheelSpin } from "decision-kit";

const options = [
  { id: "1", label: "Pizza", weight: 1 },
  { id: "2", label: "Sushi", weight: 1 },
];

export function FoodWheel() {
  const { currentAngle, isSpinning, winner, spin } = useWheelSpin();

  return (
    <>
      <div style={{ transform: `rotate(${currentAngle}deg)` }}>Wheel</div>
      <button disabled={isSpinning} onClick={() => spin(options)}>
        {isSpinning ? "Spinning…" : "Spin"}
      </button>
      {winner && <p>Selected: {winner.label}</p>}
    </>
  );
}
```

The hook updates `currentAngle` over four seconds with a cubic ease-out curve.
Use that value to rotate an SVG, canvas, or HTML wheel.

## CLI

For quick decisions from a terminal, use the included command after installing
the package globally or through `npx`:

```bash
npx decision-kit pick "Option A" "Option B" "Option C"
npx decision-kit roll 2d6+3
npx decision-kit flip 5
npx decision-kit 8ball de
npx decision-kit team --names "Anna,Ben,Clara,Dan" --teams 2
```

Run `npx decision-kit --help` to see the available commands.

## Live tools

This package is maintained by [Entscheidomat](https://entscheidomat.com), a
free browser-based collection of decision and randomizer tools. Try the
[wheel of fortune](https://entscheidomat.com/gluecksrad),
[yes/no generator](https://entscheidomat.com/ja-nein-generator),
[online dice](https://entscheidomat.com/wuerfel-online),
[coin flip](https://entscheidomat.com/muenze-werfen), or
[name picker](https://entscheidomat.com/namen-auslosen).

## Randomness and fairness

The package uses JavaScript's `Math.random()` and provides probabilistic,
not cryptographic, randomness. It is appropriate for games, UI choices, and
casual allocations. Do not use it for security-sensitive draws, gambling, or
any outcome that requires a cryptographically secure random source.

## Development

```bash
npm install
npm run build
npm test
```

The build creates CommonJS, ESM, and TypeScript declaration files in `dist/`.

## License

[MIT](LICENSE) © [Entscheidomat](https://entscheidomat.com)
