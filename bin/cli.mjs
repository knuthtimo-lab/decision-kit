#!/usr/bin/env node

import { AliasMethod } from "../dist/index.mjs";
import { DiceEngine } from "../dist/index.mjs";
import { TeamBalancer } from "../dist/index.mjs";
import { CoinFlipEngine } from "../dist/index.mjs";
import { Magic8BallEngine } from "../dist/index.mjs";

const args = process.argv.slice(2);
const command = args[0];

function printHeader() {
  console.log("\x1b[36m%s\x1b[0m", "=================================================");
  console.log("\x1b[1m%s\x1b[0m", " 🎲 decision-kit CLI (Powered by entscheidomat.com)");
  console.log("\x1b[36m%s\x1b[0m", "=================================================\n");
}

function printUsage() {
  printHeader();
  console.log("Usage:");
  console.log("  npx decision-kit pick <item1> <item2> <item3> ...");
  console.log("  npx decision-kit roll <notation> (e.g. 2d6+3, 1d20)");
  console.log("  npx decision-kit flip [count]");
  console.log("  npx decision-kit 8ball [language] (en|de)");
  console.log('  npx decision-kit team --names "Alice,Bob,Charlie,Dan" --teams 2');
  console.log("\nExplore interactive decision tools online:");
  console.log("  🔗 https://entscheidomat.com\n");
}

if (!command || command === "--help" || command === "-h") {
  printUsage();
  process.exit(0);
}

switch (command.toLowerCase()) {
  case "pick": {
    const items = args.slice(1);
    if (items.length === 0) {
      console.error("❌ Error: Please provide at least one item to pick from.");
      process.exit(1);
    }
    const options = items.map((label, idx) => ({ id: `${idx}`, label, weight: 1 }));
    const alias = new AliasMethod(options);
    const winner = alias.next();
    printHeader();
    console.log(`🎯 Chosen Winner: \x1b[32m\x1b[1m${winner.label}\x1b[0m\n`);
    break;
  }

  case "roll": {
    const notation = args[1] || "1d20";
    try {
      const result = DiceEngine.roll(notation);
      printHeader();
      console.log(`🎲 Notation: \x1b[33m${result.notation}\x1b[0m`);
      console.log(`📊 Breakdown: ${result.breakdown}`);
      console.log(`🏆 Total: \x1b[32m\x1b[1m${result.total}\x1b[0m\n`);
    } catch (err) {
      console.error(`❌ ${err.message}`);
      process.exit(1);
    }
    break;
  }

  case "flip": {
    const count = parseInt(args[1] || "1", 10);
    printHeader();
    if (count === 1) {
      const res = CoinFlipEngine.flip("de");
      console.log(`🪙 Coin Flip Result: \x1b[33m\x1b[1m${res.side}\x1b[0m\n`);
    } else {
      const results = CoinFlipEngine.flipMultiple(count, "de");
      const kopf = results.filter((r) => r.outcome === "heads").length;
      const zahl = results.length - kopf;
      console.log(`🪙 ${count} Coin Flips:`);
      console.log(`   Kopf (Heads): \x1b[32m${kopf}\x1b[0m`);
      console.log(`   Zahl (Tails): \x1b[33m${zahl}\x1b[0m\n`);
    }
    break;
  }

  case "8ball": {
    const lang = (args[1] || "en").toLowerCase() === "de" ? "de" : "en";
    const res = Magic8BallEngine.ask(lang);
    printHeader();
    console.log(`🎱 Magic 8-Ball says: \x1b[35m\x1b[1m"${res.answer}"\x1b[0m\n`);
    break;
  }

  case "team": {
    const namesArgIdx = args.indexOf("--names");
    const teamsArgIdx = args.indexOf("--teams");

    if (namesArgIdx === -1 || !args[namesArgIdx + 1]) {
      console.error('❌ Error: Please provide --names "Name1,Name2,Name3"');
      process.exit(1);
    }

    const names = args[namesArgIdx + 1].split(",").map((s) => s.trim());
    const teamCount = teamsArgIdx !== -1 ? parseInt(args[teamsArgIdx + 1], 10) : 2;

    const teams = TeamBalancer.divideTeams(names, teamCount);
    printHeader();
    console.log(`👥 Divided ${names.length} members into ${teams.length} teams:\n`);
    teams.forEach((t) => {
      console.log(`  \x1b[1m${t.name}\x1b[0m: ${t.members.join(", ")}`);
    });
    console.log("");
    break;
  }

  default:
    console.error(`❌ Unknown command: "${command}"`);
    printUsage();
    process.exit(1);
}
