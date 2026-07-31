import { WeightedOption } from "../types";

/**
 * Vose's Alias Method implementation for O(1) weighted random selection.
 * Preprocessing time: O(N)
 * Sampling time: O(1)
 */
export class AliasMethod<T = string> {
  private probabilities: number[];
  private alias: number[];
  private items: WeightedOption<T>[];

  constructor(items: WeightedOption<T>[]) {
    if (!items || items.length === 0) {
      throw new Error("AliasMethod requires at least one item.");
    }

    this.items = items;
    const n = items.length;
    this.probabilities = new Array(n);
    this.alias = new Array(n);

    const totalWeight = items.reduce((sum, item) => sum + Math.max(0, item.weight), 0);
    if (totalWeight <= 0) {
      throw new Error("Total weight must be greater than zero.");
    }

    const scaledProbs = items.map((item) => (Math.max(0, item.weight) / totalWeight) * n);
    const small: number[] = [];
    const large: number[] = [];

    for (let i = 0; i < n; i++) {
      if (scaledProbs[i] < 1.0) {
        small.push(i);
      } else {
        large.push(i);
      }
    }

    while (small.length > 0 && large.length > 0) {
      const s = small.pop()!;
      const l = large.pop()!;

      this.probabilities[s] = scaledProbs[s];
      this.alias[s] = l;

      scaledProbs[l] = scaledProbs[l] + scaledProbs[s] - 1.0;

      if (scaledProbs[l] < 1.0) {
        small.push(l);
      } else {
        large.push(l);
      }
    }

    while (large.length > 0) {
      const l = large.pop()!;
      this.probabilities[l] = 1.0;
    }

    while (small.length > 0) {
      const s = small.pop()!;
      this.probabilities[s] = 1.0;
    }
  }

  /**
   * Sample an item in O(1) constant time.
   */
  public next(): WeightedOption<T> {
    const n = this.items.length;
    const column = Math.floor(Math.random() * n);
    const coinToss = Math.random();

    if (coinToss < this.probabilities[column]) {
      return this.items[column];
    } else {
      return this.items[this.alias[column]];
    }
  }

  /**
   * Sample an item index in O(1) constant time.
   */
  public nextIndex(): number {
    const item = this.next();
    return this.items.findIndex((i) => i.id === item.id);
  }
}
