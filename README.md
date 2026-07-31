# decision-kit

[![npm version](https://img.shields.io/npm/v/decision-kit.svg?style=for-the-badge&color=6366f1)](https://www.npmjs.com/package/decision-kit)
[![GitHub Action](https://img.shields.io/badge/GitHub%20Action-Marketplace-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/marketplace/actions/decision-kit-action)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Powered by](https://img.shields.io/badge/Powered%20by-Entscheidomat.com-ec4899?style=for-the-badge&logo=react)](https://entscheidomat.com)

[Interactive Web Demos](https://entscheidomat.com) · [Installation](#installation) · [Examples](#examples) · [CLI](#cli)

## 🚀 Overview

`decision-kit` provides battle-tested algorithms, physics state machines, React hooks, and a **GitHub Action** to build modern decision-making applications, games, and automated workflow triggers.

Maintained and sponsored by **[Entscheidomat.com](https://entscheidomat.com)** — the free online decision suite.

## Try the live tools

Want to see the ideas behind this package in a finished product? These free
browser tools are built around the same decision-making use cases:

| Tool | Try it online |
| --- | --- |
| Spinner wheel | [Open the Glücksrad](https://entscheidomat.com/gluecksrad) |
| Yes/no decision | [Open the Ja/Nein-Generator](https://entscheidomat.com/ja-nein-generator) |
| Dice rolls | [Open the online dice](https://entscheidomat.com/wuerfel-online) |
| Coin flips | [Open the coin flip](https://entscheidomat.com/muenze-werfen) |
| Magic 8-Ball | [Open the Magic 8-Ball](https://entscheidomat.com/magic-8-ball) |
| Name drawing | [Open the Namen-Auslosung](https://entscheidomat.com/namen-auslosen) |
| Random numbers | [Open the Zufallszahl-Generator](https://entscheidomat.com/zufallszahl-generator) |

## 🤖 GitHub Action Usage

Use `decision-kit` directly inside your GitHub Actions CI/CD workflows:

```yaml
name: Random Decision Workflow

on: [push]

jobs:
  decide:
    runs-on: ubuntu-latest
    steps:
      - name: Make Random Choice
        id: pick
        uses: knuthtimo-lab/decision-kit@v1.0.0
        with:
          command: 'pick'
          items: 'Deploy Staging, Deploy Prod, Wait'

      - name: Print Result
        run: echo "The decision is: ${{ steps.pick.outputs.result }}"
```

### ✨ Highlights
- **🤖 GitHub Action (`action.yml`)**: Automated decision making, dice rolling, and team division right inside GitHub Actions workflows.
- **⚡ Vose's Alias Method (`AliasMethod`)**: Fast $O(1)$ weighted random sampling after $O(N)$ initialization.
- **🎡 Spinner Wheel Physics (`WheelPhysics`)**: Friction deceleration, inertia curves, and target sector alignment calculations.
- **🎲 Tabletop Dice Notation (`DiceEngine`)**: Full parser for RPG dice expressions (`3d6+2`, `1d20 advantage`, `4d6kh3`).
- **👥 Fair Group Partitioning (`TeamBalancer`)**: Cryptographically secure Fisher-Yates group partition and multi-item draw algorithms.
- **🪙 Coin Flip & Magic 8-Ball Engines**: State machines for fair coin tosses and multilingual oracle responses (EN/DE).
- **⚛️ Ready-to-use React Hooks**: React 18 & 19 compatible hooks (`useWheelSpin`, `useCoinFlip`, `useDiceRoll`).
- **🖥️ Terminal CLI (`npx decision-kit`)**: Instant terminal decisions for command-line users.

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
