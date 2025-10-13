# 🇺🇸 trumpsay

> Like `cowsay`, but Trump. Make your terminal great again!

A fun CLI tool that displays quotes from Donald Trump in ASCII art speech bubbles, inspired by the classic `cowsay` command.

```
 ___________________________________
< Make terminals great again! >
 -----------------------------------
  \
   \
    \
⠀⠀⠀⡀⠀⡄⣠⢄⡤⣤⠀⣦⣠⡄
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
...
```

## ✨ Features

- 🎨 **Simple ASCII Art** - One Trump character (Braille art)
- 💬 **Speech & Thought Bubbles** - Say or think mode
- 🌐 **API Integration** - Fetch real Trump quotes from API
- 📝 **Local Quotes** - Built-in fallback quotes
- 💾 **Caching** - Cache API responses for offline use
- 🎯 **Customizable** - Adjust bubble width

## 📦 Installation

### From Source
```bash
git clone https://github.com/Alilotfi09/trumpsay.git
cd trumpsay
npm install
npm link
```

## 🚀 Usage

### Basic Usage

Display a random quote:
```bash
trumpsay
```

Display custom text:
```bash
trumpsay "Make America Great Again!"
```

Use the quote option:
```bash
trumpsay -q "I know words, I have the best words"
```

### Quote Sources

```bash
# Fetch from API (default if no text provided)
trumpsay --api

# Use only local quotes
trumpsay --local
```

### Bubble Styles

```bash
# Thought bubble instead of speech
trumpsay --think "Thinking tremendous thoughts..."

# Custom bubble width
trumpsay -w 60 "This is a longer message"
```

### Caching

```bash
# Cache API results
trumpsay --api --cache

# Next call uses cached quote (if available)
trumpsay --cache
```

### Help & Info

```bash
# Show help
trumpsay --help

# List all local quotes
trumpsay --list
```

## 📋 Command Reference

```
Usage: trumpsay [options] [message]

Options:
  -q, --quote <text>     Display custom quote
  -l, --local            Use only local quotes
  -a, --api              Fetch quote from API
  -u, --api-url <url>    Custom API endpoint
  -c, --cache            Cache API results
  -w, --width <n>        Set speech bubble width (default: 50)
  -t, --think            Thought bubble instead of speech
  --list                 List all local quotes
  -h, --help             Show help message
```

## 🎯 Examples

### Fortune Cookie Style
```bash
fortune | trumpsay
```

### Weather Report
```bash
curl wttr.in/NewYork?format=3 | trumpsay
```

### Random Dad Joke
```bash
curl -H "Accept: text/plain" https://icanhazdadjoke.com/ | trumpsay
```

### Daily Quote on Login
Add to your `.bashrc` or `.zshrc`:
```bash
trumpsay --api --cache
```

### Thinking Mode
```bash
trumpsay --think "Should I build a wall?"
```


## 🔧 API

By default, trumpsay uses the [What Does Trump Think API](https://whatdoestrumpthink.com/api-docs/api-reference):
```
https://api.whatdoestrumpthink.com/api/v1/quotes/random
```

Expected API response format:
```json
{
  "message": "Quote text here"
}
```

Or:
```json
{
  "quote": "Quote text here"
}
```

Or plain text string.

## 📝 Built-in Quotes

trumpsay includes 8 fallback quotes:
- "I will build a great wall — and nobody builds walls better than me."
- "We will make America great again."
- "Sometimes by losing a battle you find a new way to win the war."
- "The beauty of me is that I'm very rich."
- "My whole life is about winning. I don't lose often."
- "Nobody knows the system better than me."
- "I'm, like, a really smart person."
- "I know words, I have the best words."

View all quotes with `trumpsay --list`

## 🎨 ASCII Art

The Trump ASCII art uses Unicode Braille characters for a detailed portrait that works in modern terminals. It's optimized for readability and humor.

## 💾 Cache Storage

When using `--cache`, quotes are stored in:
```
~/.trumpsay_cache.json
```

Cache format:
```json
{
  "last": "Quote text",
  "when": "2025-10-13T12:00:00.000Z"
}
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Ideas for Contributions
- Add more local quotes
- Improve ASCII art
- Fix bugs
- Add new features (e.g., color options, more characters)
- Improve documentation

### Development Setup
```bash
# Clone the repository
git clone https://github.com/alilotfi09/trumpsay.git
cd trumpsay

# Install dependencies
npm install

# Run directly for testing
node trumpsay.js "Test message"

# Link globally for system-wide testing
npm link

# Test the linked version
trumpsay "Test message"
```

## 🙏 Acknowledgments

- Inspired by the classic `cowsay` by Tony Monroe
- Trump quotes from [What Does Trump Think](https://whatdoestrumpthink.com/)
- ASCII art created with Unicode Braille characters
- Built with:
  - [chalk](https://github.com/chalk/chalk) - Terminal colors
  - [minimist](https://github.com/minimistjs/minimist) - CLI parsing
  - [axios](https://github.com/axios/axios) - HTTP requests

## 🐛 Known Issues

- ASCII art requires Unicode support in terminal
- Very narrow terminals (< 60 columns) may display incorrectly
- Some terminal emulators may not render Braille characters properly


## 📊 Requirements

- Node.js >= 16.0.0
- Terminal with Unicode support
- Internet connection (for API mode)

## 🌟 Star This Project

If you find this useful or entertaining, please consider giving it a star! ⭐

## 📞 Support

- 🐛 [Report a bug](https://github.com/Alilotfi09/trumpsay/issues)
- 💡 [Request a feature](https://github.com/Alilotfi09/trumpsay/issues)
- 📖 [Read the docs](https://github.com/alilotfi09/trumpsay)

---

**Made with 💻 and ☕**

*Disclaimer: This is a parody project for entertainment purposes. All quotes are either from public sources or fictional. Not affiliated with Donald Trump.*
