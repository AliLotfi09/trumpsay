#!/usr/bin/env node
// trumpsay.js - Trump quote CLI with Persian/English support

import fs from "fs";
import os from "os";
import path from "path";
import axios from "axios";
import minimist from "minimist";
import chalk from "chalk";

// ==================== Configuration ====================
const CONFIG = {
  defaultApi: "https://trump.politest.ir/trump_api.php",
  cacheFile: path.join(os.homedir(), ".trumpsay_cache.json"),
  timeout: 5000,
  maxBubbleWidth: 50,
};

// Updated local quotes (English only for CLI)
const LOCAL_QUOTES = [
  "I will build a great wall — and nobody builds walls better than me.",
  "We will make America great again.",
  "Sometimes by losing a battle you find a new way to win the war.",
  "The beauty of me is that I'm very rich.",
  "My whole life is about winning. I don't lose often.",
  "Nobody knows the system better than me.",
  "I'm, like, a really smart person.",
  "I know words, I have the best words.",
  "China has been very, very disrespectful to the United States.",
  "Fake news is the enemy of the people.",
  "I alone can fix the system.",
  "We will win so much that you're going to be tired of winning.",
];

// ==================== CLI Parsing ====================
const argv = minimist(process.argv.slice(2), {
  boolean: ["api", "local", "list", "cache", "help", "think", "random", "persian", "force", "stats"],
  string: ["quote", "api-url", "width", "id", "slug", "search", "category"],
  alias: {
    a: "api",
    l: "local",
    q: "quote",
    u: "api-url",
    c: "cache",
    h: "help",
    w: "width",
    t: "think",
    r: "random",
    i: "id",
    s: "slug",
    S: "search",
    cat: "category",
    p: "persian",
    f: "force",
    stats: "stats",
  },
});

// Trump ASCII Art
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
  console.log(chalk.yellow("  -f, --force           ") + chalk.gray("Force fresh request (ignore cache)"));
  console.log(chalk.yellow("  -w, --width <n>       ") + chalk.gray("Set speech bubble width (default: 50)"));
  console.log(chalk.yellow("  -t, --think           ") + chalk.gray("Thought bubble instead of speech"));
  console.log(chalk.yellow("  -r, --random          ") + chalk.gray("Get random quote from API"));
  console.log(chalk.yellow("  -i, --id <number>     ") + chalk.gray("Get quote by ID"));
  console.log(chalk.yellow("  -s, --slug <text>     ") + chalk.gray("Get quote by slug"));
  console.log(chalk.yellow("  -S, --search <text>   ") + chalk.gray("Search quotes"));
  console.log(chalk.yellow("  --cat, --category <name>") + chalk.gray("Filter by category"));
  console.log(chalk.yellow("  -p, --persian         ") + chalk.gray("Show Persian text instead"));
  console.log(chalk.yellow("  --stats               ") + chalk.gray("Show API statistics"));
  console.log(chalk.yellow("  --list                ") + chalk.gray("List all local quotes"));
  console.log(chalk.yellow("  -h, --help            ") + chalk.gray("Show this help\n"));

  console.log(chalk.white("Examples:"));
  console.log(chalk.green('  trumpsay "Make terminals great again!"'));
  console.log(chalk.green('  trumpsay --api --random'));
  console.log(chalk.green('  trumpsay --api --random --force'));
  console.log(chalk.green('  trumpsay --id 42'));
  console.log(chalk.green('  trumpsay --search "wall"'));
  console.log(chalk.green('  trumpsay --persian --random'));
  console.log(chalk.green('  trumpsay --stats'));
  console.log(chalk.green('  echo "Hello" | trumpsay\n'));
}

// استفاده از endpoint جدید get_random_quote
async function getRandomQuoteEnhanced() {
  try {
    // استفاده از endpoint جدید get_random_quote با timestamp منحصر به فرد
    const timestamp = Date.now();
    const randomSeed = Math.random().toString(36).substring(7);
    const url = `${CONFIG.defaultApi}?action=get_random_quote&_=${timestamp}&seed=${randomSeed}`;
    
    const response = await axios.get(url, { 
      timeout: CONFIG.timeout,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (response.data?.success && response.data?.quote) {
      const quoteData = response.data.quote;
      if (argv.persian && quoteData.quote_fa) {
        return quoteData.quote_fa;
      }
      return quoteData.quote_en || quoteData.quote_fa;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// روش جایگزین با random=1
async function getRandomQuoteLegacy() {
  try {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    const url = `${CONFIG.defaultApi}?action=get_quote&random=1&_=${timestamp}&nocache=${randomNum}`;
    
    const response = await axios.get(url, { 
      timeout: CONFIG.timeout,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    if (response.data?.success && response.data?.quote) {
      const quoteData = response.data.quote;
      if (argv.persian && quoteData.quote_fa) {
        return quoteData.quote_fa;
      }
      return quoteData.quote_en || quoteData.quote_fa;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// دریافت آمار از API
async function getStats() {
  try {
    const timestamp = Date.now();
    const url = `${CONFIG.defaultApi}?action=get_stats&_=${timestamp}`;
    const response = await axios.get(url, { timeout: CONFIG.timeout });
    
    if (response.data?.success && response.data?.statistics) {
      return response.data.statistics;
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function fetchQuoteFromAPI(action, params = {}) {
  try {
    const timestamp = Date.now();
    let url = `${CONFIG.defaultApi}?action=${action}&_=${timestamp}`;
    
    for (const [key, value] of Object.entries(params)) {
      if (value) url += `&${key}=${encodeURIComponent(value)}`;
    }
    
    const response = await axios.get(url, { 
      timeout: CONFIG.timeout,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (response.data?.success && response.data?.quote) {
      const quoteData = response.data.quote;
      if (argv.persian && quoteData.quote_fa) {
        return quoteData.quote_fa;
      }
      return quoteData.quote_en || quoteData.quote_fa || "No quote text available";
    }
    
    return null;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log(chalk.yellow("⚠️  Quote not found"));
    }
    return null;
  }
}

async function searchQuotes(query) {
  try {
    const timestamp = Date.now();
    const url = `${CONFIG.defaultApi}?action=search_quotes&q=${encodeURIComponent(query)}&_=${timestamp}`;
    const response = await axios.get(url, { timeout: CONFIG.timeout });
    
    if (response.data?.success && response.data?.quotes?.length > 0) {
      return response.data.quotes;
    }
    return [];
  } catch (error) {
    return [];
  }
}

// تابع اصلی برای دریافت رندوم با چندین روش
async function getAnyRandomQuote() {
  // روش اول: استفاده از endpoint جدید get_random_quote
  let quote = await getRandomQuoteEnhanced();
  if (quote) return quote;
  
  // روش دوم: استفاده از روش legacy با random=1
  quote = await getRandomQuoteLegacy();
  if (quote) return quote;
  
  // روش سوم: دریافت لیست و انتخاب تصادفی از اون
  try {
    const timestamp = Date.now();
    const url = `${CONFIG.defaultApi}?action=get_quotes&limit=100&_=${timestamp}`;
    const response = await axios.get(url, { timeout: CONFIG.timeout });
    if (response.data?.success && response.data?.quotes?.length > 0) {
      const quotes = response.data.quotes;
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quoteData = quotes[randomIndex];
      if (argv.persian && quoteData.quote_fa) {
        return quoteData.quote_fa;
      }
      return quoteData.quote_en || quoteData.quote_fa;
    }
  } catch (error) {}
  
  return null;
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
  clear() {
    try {
      if (fs.existsSync(CONFIG.cacheFile)) {
        fs.unlinkSync(CONFIG.cacheFile);
      }
    } catch (err) {}
  }
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
  if (!text || text.trim() === "") {
    text = "I have the best words, believe me!";
  }
  console.log(createBubble(text, think));
  console.log(getBubbleTail(think));
  console.log(chalk.magentaBright(TRUMP_ART));
}

function listLocalQuotes() {
  console.log(chalk.bold.greenBright("\n📜 Local Trump Quotes:\n"));
  LOCAL_QUOTES.forEach((quote, i) => {
    console.log(chalk.gray(`${i + 1}.`) + " " + chalk.white(quote));
  });
  console.log(chalk.gray("\n💡 Use --api to fetch from the online database\n"));
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

// نمایش آمار
async function showStats() {
  console.log(chalk.bold.cyanBright("\n📊 Trump API Statistics\n"));
  const stats = await getStats();
  
  if (stats) {
    console.log(chalk.white(`📈 Total Quotes: ${chalk.yellow(stats.total_quotes)}`));
    
    if (stats.categories && stats.categories.length > 0) {
      console.log(chalk.white("\n📁 Categories:"));
      stats.categories.forEach(cat => {
        console.log(chalk.gray(`   • ${cat.category}: ${chalk.yellow(cat.count)}`));
      });
    }
    
    if (stats.recent_quotes && stats.recent_quotes.length > 0) {
      console.log(chalk.white("\n🆕 Recent Quotes:"));
      stats.recent_quotes.slice(0, 3).forEach(quote => {
        const preview = quote.quote_en.length > 60 ? quote.quote_en.substring(0, 60) + "..." : quote.quote_en;
        console.log(chalk.gray(`   • ${preview}`));
      });
    }
  } else {
    console.log(chalk.red("❌ Failed to fetch statistics"));
  }
  console.log();
}

// ==================== Main ====================
async function main() {
  if (argv.help) {
    showHelp();
    return;
  }

  if (argv.list) {
    listLocalQuotes();
    return;
  }
  
  if (argv.stats) {
    await showStats();
    return;
  }

  let quote = null;

  // Priority 1: Direct quote text
  if (argv.quote || argv._[0]) {
    quote = argv.quote || argv._[0];
    render(quote, argv.think);
    return;
  }

  // Priority 2: Get by ID
  if (argv.id) {
    quote = await fetchQuoteFromAPI('get_quote', { id: argv.id });
    if (quote) {
      render(quote, argv.think);
      return;
    }
    console.log(chalk.red(`❌ Quote with ID ${argv.id} not found`));
    process.exit(1);
  }

  // Priority 3: Get by slug
  if (argv.slug) {
    quote = await fetchQuoteFromAPI('get_quote', { slug: argv.slug });
    if (quote) {
      render(quote, argv.think);
      return;
    }
    console.log(chalk.red(`❌ Quote with slug "${argv.slug}" not found`));
    process.exit(1);
  }

  // Priority 4: Search
  if (argv.search) {
    const results = await searchQuotes(argv.search);
    if (results.length > 0) {
      console.log(chalk.bold.greenBright(`\n🔍 Found ${results.length} quote(s):\n`));
      results.forEach((result, i) => {
        const displayText = argv.persian && result.quote_fa ? result.quote_fa : result.quote_en;
        console.log(chalk.gray(`${i + 1}.`) + " " + chalk.white(displayText));
        console.log(chalk.dim(`   ID: ${result.id} | Slug: ${result.slug}\n`));
      });
      return;
    }
    console.log(chalk.yellow(`\n🔍 No quotes found matching "${argv.search}"\n`));
    return;
  }

  // Priority 5: Stdin
  quote = await readStdin();
  if (quote) {
    render(quote, argv.think);
    return;
  }

  // Priority 6: API fetch with caching
  const useLocal = argv.local;
  const useApi = argv.api;
  const useCache = argv.cache;
  const forceFresh = argv.force;

  // اگر force فعال باشه، کش رو نادیده بگیر
  if (!forceFresh && useCache && !useLocal && !useApi) {
    const cached = Cache.read();
    if (cached?.last && cached?.when) {
      // کش قدیمی‌تر از 1 ساعت رو نادیده بگیر
      const cacheAge = Date.now() - new Date(cached.when).getTime();
      if (cacheAge < 3600000) {
        render(cached.last, argv.think);
        return;
      }
    }
  }

  // Get random quote from API (با روش‌های متعدد)
  if (useApi || argv.random || (!useLocal && !useApi && !argv.quote && !argv.id && !argv.slug && !argv.search)) {
    console.log(chalk.gray("🔄 Fetching random quote from API..."));
    const apiQuote = await getAnyRandomQuote();
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

  // Fallback to local quotes
  quote = getRandomLocalQuote();
  render(quote, argv.think);
}

main().catch((err) => {
  console.error(chalk.red("Error:"), err.message);
  process.exit(1);
});