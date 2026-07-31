import * as fs from "fs";
import { AliasMethod } from "./algorithms/alias-method";
import { DiceEngine } from "./algorithms/dice-parser";
import { CoinFlipEngine } from "./algorithms/coin-flip";
import { Magic8BallEngine } from "./algorithms/magic-8-ball";
import { TeamBalancer } from "./algorithms/team-balancer";

function setOutput(name: string, value: string) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (outputPath) {
    fs.appendFileSync(outputPath, `${name}=${value}\n`);
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

  console.log(`\n=================================================`);
  console.log(` 🎲 Decision Kit Action Result: ${resultText}`);
  console.log(` 🔗 Interactive Tools: https://entscheidomat.com`);
  console.log(`=================================================\n`);

  setOutput("result", resultText);
}

run().catch((err) => {
  console.error("Action error:", err);
  process.exit(1);
});
