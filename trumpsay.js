#!/usr/bin/env node
// trumpsay.js - Simple like cowsay
import fs from "fs";
import os from "os";
import path from "path";
import axios from "axios";
import minimist from "minimist";
import chalk from "chalk";

// ==================== Configuration ====================
const CONFIG = {
  defaultApi: "https://api.whatdoestrumpthink.com/api/v1/quotes/random",
  cacheFile: path.join(os.homedir(), ".trumpsay_cache.json"),
  timeout: 5000,
  maxBubbleWidth: 50,
};

const LOCAL_QUOTES = [
  "I will build a great wall — and nobody builds walls better than me.",
  "We will make America great again.",
  "Sometimes by losing a battle you find a new way to win the war.",
  "The beauty of me is that I'm very rich.",
  "My whole life is about winning. I don't lose often.",
  "Nobody knows the system better than me.",
  "I'm, like, a really smart person.",
  "I know words, I have the best words.",
];

// ==================== CLI Parsing ====================
const argv = minimist(process.argv.slice(2), {
  boolean: ["api", "local", "list", "cache", "help", "think"],
  string: ["quote", "api-url", "width"],
  alias: {
    a: "api",
    l: "local",
    q: "quote",
    u: "api-url",
    c: "cache",
    h: "help",
    w: "width",
    t: "think",
  },
});

// ==================== Trump ASCII Art ====================
const TRUMP_ART = `

⠀⠀⠀⢀⡀⠀⡄⣠⢄⡤⣤⠀⣦⣠⡄
⠀⠀⠀⠀⣀⣀⢟⠼⠣⠠⡅⡻⠜⠃⢀⢿⣷⡿⢘⢸⣭⢰⠠⠤
⠀⠀⠀⠁⠉⠉⢀⠒⠜⠸⠶⠶⢐⢛⠳⠶⠶⢒⣾⢘⢰⣴⢸⠇⡧⣌⣠⣔⡀
⠀⠀⠀⠀⠀⣀⡸⣛⣙⣛⣛⣘⣿⡆⡛⣛⣘⣛⣚⣸⣰⡅⢘⣛⢱⠠⢶⡆⠂⠀⡄
⠀⠀⠀⠀⣴⣶⡦⡭⡯⡏⠹⠽⣾⡀⡇⠻⠿⡧⡧⡏⠽⠥⣬⡭⡭⣈⡥⡭⣃⣇⣇
⠀⠀⠀⣀⢸⡟⠣⠬⠭⢵⡆⣾⠿⣃⡀⣩⡥⡦⡦⡆⠈⠩⠌⠩⠥⠬⠍⡇⣿⣿⣿⠇
⠀⠀⣤⠽⢧⡇⠩⡍⠭⢭⣧⣽⠰⢾⡇⣿⠁⣧⣧⡇⢩⡅⣭⠈⣭⣭⡅⠆⠿⠏⠿
⣶⡆⣿⣴⣶⡆⣛⣟⣛⠱⣾⣯⠘⢇⣙⣛⣻⡃⣙⣛⣻⢃⣙⡛⡻⡃⢤⣼⣧⡿⠁
⠙⢃⣉⠾⢹⡇⣿⡿⠽⢨⢹⣽⣤⡬⠉⡍⢡⣥⠉⣭⣭⣬⣭⠄⠥⠰⠆⠀⠶
⠀⣼⣭⢐⡊⡁⣛⡻⠿⢲⣶⣶⣶⠰⠐⢲⣶⣶⡆⠆⢐⣒⠒⢀⡃⣀⠛⠋⣽⠁
⠀⣶⣛⢸⣯⣽⢰⢾⡏⣿⣺⣸⣿⢿⡯⣓⣒⣺⠩⢭⢘⣻⢐⣸⠡⢇⣶⣾⣟
⠀⣸⣿⢨⣝⣿⠘⢢⡗⣗⣶⢱⣷⡎⣷⢑⣾⣾⠘⠛⢘⣛⢘⣛⢶⣾⠛⡾⠿
⠀⣿⢙⣴⣆⣹⢸⣿⣥⢥⡍⣭⢩⣥⣥⢨⣭⣭⢸⣟⢸⣟⢸⣟⢥⣤⣿⡇⣿⣠⡀
⠀⠉⠸⡌⣓⡀⢸⣯⣻⢼⡇⣿⣤⡟⣧⢰⣿⣿⢈⣛⡈⣛⣈⡛⣛⠟⢛⡃⣶⠘⣷⢢⡄
⠀⠀⠀⠀⠻⠿⢆⡤⡟⣼⣤⢻⡋⢡⢳⣶⣟⣛⡆⣻⣁⣿⣟⣁⠟⠒⢰⡆⠀⠈⠁
⠀⠀⠀⠀⠀⠀⠙⢳⢩⢩⣯⠌⡾⣭⢐⣤⣸⣿⡇⣿⣻⣻⣿⡻⠖⣀⢸⡇
⠀⠀⠀⠀⠀⠀⠀⠀⢿⣼⣸⣿⡰⣿⠠⢭⠽⢿⣷⢻⣿⡿⡿⣾⡗⠻⢸⡇⣿⡄
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣙⣛⢻⣃⢶⣶⡶⢂⡸⣇⣼⠻⢸⡇⡆⠶⠰⢱⢂⢡
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠺⠱⣿⠲⠏⠾⠍⠐⠾⠷⢯⣷⣻⠸⠇⡂⣻⢽⢘⡳⣲⢰
⠀⠀⠀⠀⠀⠀⠀⢶⣷⡟⣷⢹⣼⠘⣿⣶⠐⣿⣶⣘⢶⡎⡆⡆⡆⣿⣿⣝⣗⣾⣾⣂
⠀⠀⠀⠀⠀⠀⢶⣾⠏⡇⠻⢍⣽⠔⠿⠿⢶⠿⠏⣿⢻⢅⣃⡂⣵⣭⣾⣿⣷⣾⣿⣧
⠀⠀⠀⠀⢠⢸⣸⠾⢄⠃⡇⣷⠠⠿⢸⠸⢽⠇⠇⣾⢰⢲⣿⢡⠛⡍⣿⢛⡓⠗⢿⣘⣀
⠀⠀⠀⠀⣬⢰⡾⡶⡜⠏⣹⠍⣒⡈⣛⡁⣛⡁⠴⠇⡎⣬⣭⢨⡇⣚⣹⢘⠃⡼⢖⣬⡍⡆

`;
// ==================== Helper Functions ====================

function showHelp() {
  console.log(chalk.bold.cyanBright("\n🇺🇸 TRUMPSAY - Like cowsay, but Trump! 🇺🇸\n"));
  console.log(chalk.white("Usage:"));
  console.log(chalk.gray("  trumpsay [options] [message]\n"));
  
  console.log(chalk.white("Options:"));
  console.log(chalk.yellow("  -q, --quote <text>    ") + chalk.gray("Display custom quote"));
  console.log(chalk.yellow("  -l, --local           ") + chalk.gray("Use only local quotes"));
  console.log(chalk.yellow("  -a, --api             ") + chalk.gray("Fetch quote from API"));
  console.log(chalk.yellow("  -u, --api-url <url>   ") + chalk.gray("Custom API endpoint"));
  console.log(chalk.yellow("  -c, --cache           ") + chalk.gray("Cache API results"));
  console.log(chalk.yellow("  -w, --width <n>       ") + chalk.gray("Set speech bubble width (default: 50)"));
  console.log(chalk.yellow("  -t, --think           ") + chalk.gray("Thought bubble instead of speech"));
  console.log(chalk.yellow("  --list                ") + chalk.gray("List all local quotes"));
  console.log(chalk.yellow("  -h, --help            ") + chalk.gray("Show this help\n"));

  console.log(chalk.white("Examples:"));
  console.log(chalk.green('  trumpsay "Make terminals great again!"'));
  console.log(chalk.green('  trumpsay --api --cache'));
  console.log(chalk.green('  trumpsay --think "Thinking..."'));
  console.log(chalk.green('  echo "Hello" | trumpsay\n'));
}

async function fetchQuoteFromApi(url) {
  try {
    const response = await axios.get(url, { timeout: CONFIG.timeout });
    if (!response?.data) return null;
    if (typeof response.data === "string") return response.data;
    return response.data.message || response.data.quote || JSON.stringify(response.data);
  } catch (error) {
    return null;
  }
}

const Cache = {
  save(data) {
    try {
      fs.writeFileSync(CONFIG.cacheFile, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {}
  },
  read() {
    try {
      if (fs.existsSync(CONFIG.cacheFile)) {
        return JSON.parse(fs.readFileSync(CONFIG.cacheFile, "utf8"));
      }
    } catch (err) {}
    return null;
  },
};

function createBubble(text, think = false) {
  const width = parseInt(argv.width) || CONFIG.maxBubbleWidth;
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= width) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  const bubbleWidth = Math.max(...lines.map(l => l.length));
  const top = " " + "_".repeat(bubbleWidth + 2);
  const bottom = " " + "-".repeat(bubbleWidth + 2);

  const middle = lines.map((line, i) => {
    const padding = " ".repeat(bubbleWidth - line.length);
    if (lines.length === 1) {
      return think ? `( ${line}${padding} )` : `< ${line}${padding} >`;
    }
    if (i === 0) return think ? `( ${line}${padding} )` : `/ ${line}${padding} \\`;
    if (i === lines.length - 1) return think ? `( ${line}${padding} )` : `\\ ${line}${padding} /`;
    return think ? `) ${line}${padding} (` : `| ${line}${padding} |`;
  }).join("\n");

  return chalk.yellowBright([top, middle, bottom].join("\n"));
}

function getBubbleTail(think = false) {
  if (think) {
    return chalk.yellowBright("  o\n o\no");
  }
  return chalk.yellowBright("  \\\n   \\\n    \\");
}

function render(text, think = false) {
  console.log(createBubble(text, think));
  console.log(getBubbleTail(think));
  console.log(chalk.magentaBright(TRUMP_ART));
}

function listQuotes() {
  console.log(chalk.bold.greenBright("\n📜 Local Trump Quotes:\n"));
  LOCAL_QUOTES.forEach((quote, i) => {
    console.log(chalk.gray(`${i + 1}.`) + " " + chalk.white(quote));
  });
  console.log();
}

function getRandomLocalQuote() {
  return LOCAL_QUOTES[Math.floor(Math.random() * LOCAL_QUOTES.length)];
}

async function readStdin() {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) {
      resolve(null);
      return;
    }
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data.trim() || null));
    setTimeout(() => resolve(null), 100);
  });
}

// ==================== Main ====================
async function main() {
  if (argv.help) {
    showHelp();
    return;
  }

  if (argv.list) {
    listQuotes();
    return;
  }

  let quote = argv.quote || argv._[0];
  
  if (!quote) {
    quote = await readStdin();
  }

  if (!quote) {
    const useLocal = argv.local;
    const useApi = argv.api;
    const apiUrl = argv["api-url"] || CONFIG.defaultApi;
    const useCache = argv.cache;

    if (useCache && !useLocal && !useApi) {
      const cached = Cache.read();
      if (cached?.last) {
        render(cached.last, argv.think);
        return;
      }
    }

    if (useApi || (!useLocal && !useApi)) {
      const apiQuote = await fetchQuoteFromApi(apiUrl);
      if (apiQuote) {
        if (useCache) {
          Cache.save({ last: apiQuote, when: new Date().toISOString() });
        }
        render(apiQuote, argv.think);
        return;
      }
      if (useApi) {
        console.log(chalk.red("❌ API failed, using local quote...\n"));
      }
    }

    quote = getRandomLocalQuote();
  }

  render(quote, argv.think);
}

main().catch((err) => {
  console.error(chalk.red("Error:"), err.message);
  process.exit(1);
});