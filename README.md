# 🎴 Memory Match - 2D Card Game

A fun and interactive memory matching card game built with HTML, CSS, and vanilla JavaScript.

## 🎮 Game Description

Memory Match is a classic concentration card game where players flip cards to find matching pairs. Test your memory skills by matching all pairs in the fewest moves and shortest time possible!

## ✨ Features

- **Interactive Card Flipping**: Smooth 3D card flip animations
- **Score Tracking**: Keep track of moves and pairs found
- **Timer**: Challenge yourself to beat your best time
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful UI**: Modern gradient design with smooth animations
- **Game Over Screen**: Displays final statistics when you win

## 🎯 How to Play

1. Open `index.html` in your web browser
2. Click on any card to flip it over
3. Click on a second card to try to find a match
4. If the cards match, they stay flipped
5. If they don't match, they flip back over
6. Continue until all pairs are found
7. Try to complete the game in the fewest moves!

## 🚀 Getting Started

Simply open the `index.html` file in any modern web browser:

```bash
# Clone the repository
git clone https://github.com/ilorroot/STC-1.git
cd STC-1

# Open in browser
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

Or use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

## 📁 Project Structure

```
.
├── index.html    # Main HTML structure
├── styles.css    # CSS styling and animations
├── game.js       # Game logic and interactivity
├── README.md     # This file
└── STC-1.sol     # (Legacy file - can be ignored)
```

## 🎨 Customization

You can easily customize the game by modifying:

- **Card Symbols**: Edit the `cardSymbols` array in `game.js` to change the emoji icons
- **Colors**: Modify the gradient colors in `styles.css`
- **Grid Size**: Change the grid layout in `styles.css` (`.game-board`)
- **Number of Cards**: Add more symbols to increase difficulty

## 🛠️ Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 🎓 Learning Points

This project demonstrates:
- DOM manipulation
- Event handling
- CSS animations and transforms
- Game state management
- Array shuffling algorithms (Fisher-Yates)
- Responsive web design

## 📝 License

MIT License — free to use, modify, and distribute.

## 👤 Author

Created with ❤️ by the STC-1 project
