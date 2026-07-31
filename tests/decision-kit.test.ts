import { describe, it } from "node:test";
import assert from "node:assert";

import { AliasMethod } from "../src/algorithms/alias-method";
import { DiceEngine } from "../src/algorithms/dice-parser";
import { TeamBalancer } from "../src/algorithms/team-balancer";
import { CoinFlipEngine } from "../src/algorithms/coin-flip";
import { Magic8BallEngine } from "../src/algorithms/magic-8-ball";
import { WheelPhysics } from "../src/algorithms/wheel-physics";

describe("AliasMethod Weighted Sampling", () => {
  it("should select items based on relative weights over 10,000 samples", () => {
    const items = [
      { id: "A", weight: 70 },
      { id: "B", weight: 30 },
    ];
    const alias = new AliasMethod(items);
    const counts = { A: 0, B: 0 };

    for (let i = 0; i < 10000; i++) {
      const winner = alias.next();
      counts[winner.id as "A" | "B"]++;
    }

    assert.ok(counts.A > 6000, `Expected A > 6000, got ${counts.A}`);
    assert.ok(counts.B > 2000, `Expected B > 2000, got ${counts.B}`);
  });
});

describe("DiceEngine", () => {
  it("should correctly roll standard 2d6+3 notation", () => {
    const res = DiceEngine.roll("2d6+3");
    assert.strictEqual(res.rolls.length, 2);
    assert.strictEqual(res.modifier, 3);
    assert.ok(res.total >= 5 && res.total <= 15);
  });

  it("should handle keep highest notation 4d6kh3", () => {
    const res = DiceEngine.roll("4d6kh3");
    assert.strictEqual(res.rolls.length, 4);
    assert.ok(res.total >= 3 && res.total <= 18);
  });
});

describe("TeamBalancer", () => {
  it("should divide 6 members into 2 balanced teams", () => {
    const members = ["Alice", "Bob", "Charlie", "Dan", "Eve", "Frank"];
    const teams = TeamBalancer.divideTeams(members, 2);
    assert.strictEqual(teams.length, 2);
    assert.strictEqual(teams[0].members.length, 3);
    assert.strictEqual(teams[1].members.length, 3);
  });
});

describe("CoinFlipEngine", () => {
  it("should return valid German coin side", () => {
    const res = CoinFlipEngine.flip("de");
    assert.ok(res.side === "Kopf" || res.side === "Zahl");
  });
});

describe("Magic8BallEngine", () => {
  it("should return a non-empty answer string", () => {
    const res = Magic8BallEngine.ask("de");
    assert.ok(res.answer.length > 0);
  });
});

describe("WheelPhysics", () => {
  it("should calculate target angle for 4 items", () => {
    const physics = new WheelPhysics();
    const items = [
      { id: "1", weight: 1 },
      { id: "2", weight: 1 },
      { id: "3", weight: 1 },
      { id: "4", weight: 1 },
    ];
    const spin = physics.calculateSpin(items);
    assert.ok(spin.targetAngle > 1000);
    assert.ok(spin.winningIndex >= 0 && spin.winningIndex < 4);
  });
});
