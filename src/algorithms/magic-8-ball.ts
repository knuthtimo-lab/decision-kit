import { Magic8BallResult } from "../types";

export const EN_MAGIC_ANSWERS: { text: string; category: "positive" | "neutral" | "negative" }[] = [
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
  { text: "Very doubtful.", category: "negative" },
];

export const DE_MAGIC_ANSWERS: { text: string; category: "positive" | "neutral" | "negative" }[] = [
  // Positive
  { text: "Es ist ganz sicher so.", category: "positive" },
  { text: "Zweifellos ja.", category: "positive" },
  { text: "Du kannst dich darauf verlassen.", category: "positive" },
  { text: "Sehr wahrscheinlich.", category: "positive" },
  { text: "Die Zeichen stehen gut.", category: "positive" },
  { text: "Ja, definitiv.", category: "positive" },
  // Neutral
  { text: "Antwort verschwommen, versuche es nochmal.", category: "neutral" },
  { text: "Frage später nochmal.", category: "neutral" },
  { text: "Besser, ich sage es dir jetzt nicht.", category: "neutral" },
  { text: "Jetzt nicht vorhersehbar.", category: "neutral" },
  // Negative
  { text: "Verlass dich nicht darauf.", category: "negative" },
  { text: "Meine Antwort ist Nein.", category: "negative" },
  { text: "Aussichten sind nicht gut.", category: "negative" },
  { text: "Sehr zweifelhaft.", category: "negative" },
];

export class Magic8BallEngine {
  public static ask(language: "en" | "de" = "en"): Magic8BallResult {
    const pool = language === "de" ? DE_MAGIC_ANSWERS : EN_MAGIC_ANSWERS;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];

    return {
      answer: selected.text,
      category: selected.category,
      language,
    };
  }
}
