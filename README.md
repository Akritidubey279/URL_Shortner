# Premium URL Shortener

A beautiful, fast, and minimalistic URL shortening service built with a Node.js/Express backend and a vanilla HTML/CSS/JS glassmorphic frontend.

## Features
- **URL Condensation**: Convert long, unwieldy URLs into tiny links.
- **Glassmorphism UI**: Dynamic dark mode theme with animated ambient orbs and blurred glass effects.
- **One-Click Copy**: Built-in clipboard integration.
- **SQLite Database**: Lightweight local data storage; no huge setups needed.
- **Fast and Responsive**: Seamlessly works on desktop and mobile screens.

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. We recommend installing it using `nvm` if you're on a Mac.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Akritidubey279/URL_Shortner.git
   cd URL_Shortner
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

### Running the App
Start the local server using:
```bash
node server.js
```

Then, open your browser and navigate to:
`http://localhost:3000`

## Technologies Used
- **Frontend**: HTML5, Vanilla JavaScript, CSS3
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Utilities**: `crypto` for short code generation, `cors`

## Folder Structure
```
.
├── server.js               # Express application and SQLite connection logic
├── database.sqlite         # Automatically generated SQLite database file
├── package.json            # Node.js dependencies
└── public/
    ├── index.html          # Main application UI
    ├── style.css           # Glassmorphism aesthetic and animations
    └── script.js           # API integration and clipboard functionality
```
