<div align="center">

# 🎲 decision-kit

**The ultimate zero-dependency TypeScript & React library for decision-making algorithms, spinner wheels, weighted sampling, dice notation, and team generators.**

[![npm version](https://img.shields.io/npm/v/decision-kit.svg?style=for-the-badge&color=6366f1)](https://www.npmjs.com/package/decision-kit)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Powered by](https://img.shields.io/badge/Powered%20by-Entscheidomat.com-ec4899?style=for-the-badge&logo=react)](https://entscheidomat.com)

[Interactive Web Demos](https://entscheidomat.com) • [Documentation](#documentation) • [CLI Quickstart](#cli-tool-npx-decision-kit)

</div>

---

## 🚀 Overview

`decision-kit` provides battle-tested algorithms, physics state machines, and React hooks to build modern decision-making applications, games, and random generators. 

Maintained and sponsored by **[Entscheidomat.com](https://entscheidomat.com)** — the free online decision suite.

### ✨ Highlights
- **⚡ Vose's Alias Method (`AliasMethod`)**: Fast $O(1)$ weighted random sampling after $O(N)$ initialization.
- **🎡 Spinner Wheel Physics (`WheelPhysics`)**: Friction deceleration, inertia curves, and target sector alignment calculations.
- **🎲 Tabletop Dice Notation (`DiceEngine`)**: Full parser for RPG dice expressions (`3d6+2`, `1d20 advantage`, `4d6kh3`).
- **👥 Fair Group Partitioning (`TeamBalancer`)**: Cryptographically secure Fisher-Yates group partition and multi-item draw algorithms.
- **🪙 Coin Flip & Magic 8-Ball Engines**: State machines for fair coin tosses and multilingual oracle responses (EN/DE).
- **⚛️ Ready-to-use React Hooks**: React 18 & 19 compatible hooks (`useWheelSpin`, `useCoinFlip`, `useDiceRoll`).
- **🖥️ Terminal CLI (`npx decision-kit`)**: Instant terminal decisions for command-line users.

---

## 🌐 Interactive Web Demos

Experience these decision-making tools live on **[Entscheidomat.com](https://entscheidomat.com)**:

| Tool | Description | Live Demo Link |
| :--- | :--- | :--- |
| **🎡 Glücksrad** | Animated spinner wheel with customizable weighted options | [entscheidomat.com/gluecksrad](https://entscheidomat.com/gluecksrad) |
| **❓ Ja / Nein Generator** | Instant decision generator with visual feedback | [entscheidomat.com/ja-nein-generator](https://entscheidomat.com/ja-nein-generator) |
| **🎲 Würfel** | 3D multi-dice simulator for tabletop games | [entscheidomat.com/wuerfel](https://entscheidomat.com/wuerfel) |
| **🪙 Münzwurf** | Physics coin toss simulation with heads/tails stats | [entscheidomat.com/muenzwurf](https://entscheidomat.com/muenzwurf) |
| **🎱 Magic 8-Ball** | Mysterious oracle answer generator | [entscheidomat.com/magic-8-ball](https://entscheidomat.com/magic-8-ball) |
| **🏷️ Namen Auslosung** | Random name picker, raffle draw & group generator | [entscheidomat.com/namen-auslosung](https://entscheidomat.com/namen-auslosung) |
| **🔢 Zufallszahl** | Secure random number range generator | [entscheidomat.com/zufallszahl-generator](https://entscheidomat.com/zufallszahl-generator) |

---

## 📦 Installation

```bash
# npm
npm install decision-kit

# pnpm
pnpm add decision-kit

# yarn
yarn add decision-kit
```

---

## 💡 Usage Examples

### 1. Weighted Random Selection ($O(1)$ Alias Method)

```typescript
import { AliasMethod } from "decision-kit";

const options = [
  { id: "common", label: "Common Loot", weight: 70 },
  { id: "rare", label: "Rare Loot", weight: 25 },
  { id: "legendary", label: "Legendary Loot", weight: 5 },
];

// O(N) setup
const alias = new AliasMethod(options);

// O(1) sampling
const item = alias.next();
console.log("Won item:", item.label);
```

---

### 2. RPG Dice Notation Parser

```typescript
import { DiceEngine } from "decision-kit";

// Standard notation with modifier
const roll1 = DiceEngine.roll("3d6+2");
console.log(roll1.total); // e.g. 14
console.log(roll1.breakdown); // "[4, 5, 3]+2 = 14"

// Advantage roll (2d20 keep highest)
const adv = DiceEngine.roll("1d20 advantage");
console.log(adv.total, adv.criticalHit);

// Keep highest 3 of 4d6 (character stat generation)
const stat = DiceEngine.roll("4d6kh3");
console.log(stat.breakdown); // "[6, 5, 4, 2] (keep highest 3) = 15"
```

---

### 3. Fair Team & Group Generator

```typescript
import { TeamBalancer } from "decision-kit";

const members = ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank"];

// Divide members into 2 balanced teams
const teams = TeamBalancer.divideTeams(members, 2);
console.log(teams);
/*
[
  { id: 1, name: "Team 1", members: ["Charlie", "Alice", "Frank"] },
  { id: 2, name: "Team 2", members: ["Eve", "Bob", "Dave"] }
]
*/
```

---

### 4. React Wheel Spinner Hook

```tsx
import React from "react";
import { useWheelSpin } from "decision-kit";

const options = [
  { id: "1", label: "Pizza", weight: 1 },
  { id: "2", label: "Sushi", weight: 1 },
  { id: "3", label: "Burger", weight: 1 },
];

export function FoodWheel() {
  const { isSpinning, currentAngle, winner, spin } = useWheelSpin({}, (result) => {
    console.log("Spin finished! Winner:", result.winner.label);
  });

  return (
    <div>
      <div
        style={{
          transform: `rotate(${currentAngle}deg)`,
          transition: isSpinning ? "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
        }}
      >
        🎡 Wheel Canvas / SVG
      </div>

      <button onClick={() => spin(options)} disabled={isSpinning}>
        {isSpinning ? "Spinning..." : "Spin Wheel!"}
      </button>

      {winner && <h3>Winner: {winner.label}</h3>}
    </div>
  );
}
```

---

## 🖥️ CLI Tool (`npx decision-kit`)

Make instant decisions straight from your terminal:

```bash
# Pick a random winner from options
npx decision-kit pick "Option A" "Option B" "Option C"

# Roll dice
npx decision-kit roll 2d6+3
npx decision-kit roll 1d20

# Flip coins
npx decision-kit flip 5

# Ask Magic 8-Ball
npx decision-kit 8ball de

# Divide group into teams
npx decision-kit team --names "Anna,Ben,Clara,Dan,Erik,Faye" --teams 2
```

---

## 📄 License

MIT © **[Entscheidomat](https://entscheidomat.com)** — Built with ❤️ for decision makers everywhere.
