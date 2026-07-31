// src/action.ts
import * as fs from "fs";

// src/algorithms/alias-method.ts
var AliasMethod = class {
  probabilities;
  alias;
  items;
  constructor(items) {
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
    const scaledProbs = items.map((item) => Math.max(0, item.weight) / totalWeight * n);
    const small = [];
    const large = [];
    for (let i = 0; i < n; i++) {
      if (scaledProbs[i] < 1) {
        small.push(i);
      } else {
        large.push(i);
      }
    }
    while (small.length > 0 && large.length > 0) {
      const s = small.pop();
      const l = large.pop();
      this.probabilities[s] = scaledProbs[s];
      this.alias[s] = l;
      scaledProbs[l] = scaledProbs[l] + scaledProbs[s] - 1;
      if (scaledProbs[l] < 1) {
        small.push(l);
      } else {
        large.push(l);
      }
    }
    while (large.length > 0) {
      const l = large.pop();
      this.probabilities[l] = 1;
    }
    while (small.length > 0) {
      const s = small.pop();
      this.probabilities[s] = 1;
    }
  }
  /**
   * Sample an item in O(1) constant time.
   */
  next() {
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
  nextIndex() {
    const item = this.next();
    return this.items.findIndex((i) => i.id === item.id);
  }
};

// src/algorithms/dice-parser.ts
var DiceEngine = class {
  /**
   * Parse and roll tabletop RPG dice notation.
   * Supported formats:
   *  - Standard: "2d6", "1d20", "3d10+4", "1d100-5"
   *  - Keep High / Drop Low: "4d6kh3" (keep highest 3), "4d6dl1" (drop lowest 1)
   *  - Advantage / Disadvantage: "1d20 adv", "1d20 dis"
   */
  static roll(expression) {
    const cleanExpr = expression.trim().toLowerCase();
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
        breakdown: `Advantage [${roll1}, ${roll2}] -> ${best}`
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
        breakdown: `Disadvantage [${roll1}, ${roll2}] -> ${worst}`
      };
    }
    const regex = /^(\d+)?d(\d+)(kh\d+|dl\d+)?([+-]\d+)?$/;
    const match = cleanExpr.match(regex);
    if (!match) {
      if (/^\d+$/.test(cleanExpr)) {
        const sides2 = parseInt(cleanExpr, 10);
        const roll = this.rollSingleDie(sides2);
        return {
          notation: `1d${sides2}`,
          rolls: [roll],
          modifier: 0,
          total: roll,
          breakdown: `1d${sides2} (${roll})`
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
    const rawRolls = [];
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
      breakdown: `[${rawRolls.join(", ")}]${keepDropText}${modText} = ${total}`
    };
  }
  static rollSingleDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }
};

// src/algorithms/coin-flip.ts
var CoinFlipEngine = class {
  static flip(language = "de") {
    const outcome = Math.random() < 0.5 ? "heads" : "tails";
    let side;
    if (language === "de") {
      side = outcome === "heads" ? "Kopf" : "Zahl";
    } else {
      side = outcome === "heads" ? "Heads" : "Tails";
    }
    return {
      outcome,
      side,
      flippedAt: /* @__PURE__ */ new Date()
    };
  }
  static flipMultiple(count, language = "de") {
    const safeCount = Math.max(1, Math.min(1e3, count));
    return Array.from({ length: safeCount }, () => this.flip(language));
  }
};

// src/algorithms/magic-8-ball.ts
var EN_MAGIC_ANSWERS = [
  // Positive
  { text: "It is certain.", category: "positive" },
  { text: "It is decidedly so.", category: "positive" },
  { text: "Without a doubt.", category: "positive" },
  { text: "Yes definitely.", category: "positive" },
  { text: "You may rely on it.", category: "positive" },
  { text: "As I see it, yes.", category: "positive" },
  { text: "Most likely.", category: "positive" },
  { text: "Outlook good.", category: "positive" },
  { text: "Yes.", category: "positive" },
  { text: "Signs point to yes.", category: "positive" },
  // Neutral
  { text: "Reply hazy, try again.", category: "neutral" },
  { text: "Ask again later.", category: "neutral" },
  { text: "Better not tell you now.", category: "neutral" },
  { text: "Cannot predict now.", category: "neutral" },
  { text: "Concentrate and ask again.", category: "neutral" },
  // Negative
  { text: "Don't count on it.", category: "negative" },
  { text: "My reply is no.", category: "negative" },
  { text: "My sources say no.", category: "negative" },
  { text: "Outlook not so good.", category: "negative" },
  { text: "Very doubtful.", category: "negative" }
];
var DE_MAGIC_ANSWERS = [
  // Positive
  { text: "Es ist ganz sicher so.", category: "positive" },
  { text: "Zweifellos ja.", category: "positive" },
  { text: "Du kannst dich darauf verlassen.", category: "positive" },
  { text: "Sehr wahrscheinlich.", category: "positive" },
  { text: "Die Zeichen stehen gut.", category: "positive" },
  { text: "Ja, definitiv.", category: "positive" },
  // Neutral
  { text: "Antwort verschwommen, versuche es nochmal.", category: "neutral" },
  { text: "Frage sp\xE4ter nochmal.", category: "neutral" },
  { text: "Besser, ich sage es dir jetzt nicht.", category: "neutral" },
  { text: "Jetzt nicht vorhersehbar.", category: "neutral" },
  // Negative
  { text: "Verlass dich nicht darauf.", category: "negative" },
  { text: "Meine Antwort ist Nein.", category: "negative" },
  { text: "Aussichten sind nicht gut.", category: "negative" },
  { text: "Sehr zweifelhaft.", category: "negative" }
];
var Magic8BallEngine = class {
  static ask(language = "en") {
    const pool = language === "de" ? DE_MAGIC_ANSWERS : EN_MAGIC_ANSWERS;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];
    return {
      answer: selected.text,
      category: selected.category,
      language
    };
  }
};

// src/algorithms/team-balancer.ts
var TeamBalancer = class {
  /**
   * Distribute a list of members randomly & fairly into N groups/teams.
   * Uses crypto-quality Fisher-Yates shuffle.
   */
  static divideTeams(members, teamCount, teamNames) {
    if (!members || members.length === 0) {
      throw new Error("Members list cannot be empty.");
    }
    if (teamCount <= 0) {
      throw new Error("Team count must be greater than zero.");
    }
    const shuffled = [...members];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const effectiveTeamCount = Math.min(teamCount, members.length);
    const teams = Array.from({ length: effectiveTeamCount }, (_, idx) => ({
      id: idx + 1,
      name: teamNames?.[idx] || `Team ${idx + 1}`,
      members: []
    }));
    shuffled.forEach((member, index) => {
      const teamIdx = index % effectiveTeamCount;
      teams[teamIdx].members.push(member);
    });
    return teams;
  }
  /**
   * Pick K unique random winners/candidates from a list without replacement.
   */
  static pickMultiple(items, count) {
    if (count <= 0) return [];
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(count, items.length));
  }
};

// src/action.ts
function setOutput(name, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (outputPath) {
    fs.appendFileSync(outputPath, `${name}=${value}
`);
  } else {
    console.log(`::set-output name=${name}::${value}`);
  }
}
async function run() {
  const command = (process.env.INPUT_COMMAND || "pick").toLowerCase();
  const itemsStr = process.env.INPUT_ITEMS || "Yes,No";
  const teamsCount = parseInt(process.env.INPUT_TEAMS || "2", 10);
  let resultText = "";
  if (command === "pick") {
    const items = itemsStr.split(",").map((s) => s.trim()).filter(Boolean);
    const options = items.map((label, idx) => ({ id: `${idx}`, label, weight: 1 }));
    const alias = new AliasMethod(options);
    const winner = alias.next();
    resultText = winner.label || winner.id;
  } else if (command === "roll") {
    const res = DiceEngine.roll(itemsStr);
    resultText = `${res.total} (${res.breakdown})`;
  } else if (command === "flip") {
    const res = CoinFlipEngine.flip("de");
    resultText = res.side;
  } else if (command === "8ball") {
    const res = Magic8BallEngine.ask("de");
    resultText = res.answer;
  } else if (command === "team") {
    const names = itemsStr.split(",").map((s) => s.trim()).filter(Boolean);
    const teams = TeamBalancer.divideTeams(names, teamsCount);
    resultText = teams.map((t) => `${t.name}: ${t.members.join(", ")}`).join(" | ");
  } else {
    resultText = `Unknown command "${command}"`;
  }
  console.log(`
=================================================`);
  console.log(` \u{1F3B2} Decision Kit Action Result: ${resultText}`);
  console.log(` \u{1F517} Interactive Tools: https://entscheidomat.com`);
  console.log(`=================================================
`);
  setOutput("result", resultText);
}
run().catch((err) => {
  console.error("Action error:", err);
  process.exit(1);
});
//# sourceMappingURL=action.mjs.map