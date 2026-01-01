# APISAMP Project Setup Guide

Complete step-by-step instructions for setting up the APISAMP web application on a new device.

---

## Prerequisites

### 1. Install Node.js

1. Download Node.js LTS from [https://nodejs.org/](https://nodejs.org/)
2. Run the installer (keep default settings)
3. **Restart your terminal** after installation
4. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

---

## Project Setup

### 2. Navigate to Project Folder

```cmd
cd c:\Users\Hibha\Downloads\APISAMP--main\APISAMP--main
```

> **Note**: The project is in a nested folder (`APISAMP--main\APISAMP--main`)

### 3. Install Dependencies

```cmd
npm install
```

This downloads all required packages listed in `package.json`.

### 4. Start Development Server

```cmd
npm run dev
```

Wait until you see:
```
VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### 5. Open the App

Open your browser and go to: **http://localhost:5173**

---

## Quick Commands Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run code linter |

---

## Troubleshooting

### "npm is not recognized"
→ Node.js not installed or terminal not restarted. Close and reopen terminal.

### "ENOENT: no such file or directory, package.json"
→ You're in the wrong folder. Make sure you're in: `APISAMP--main\APISAMP--main`

### "This site can't be reached" in browser
→ The dev server is not running. Run `npm run dev` and keep the terminal open.

### Port already in use
→ Another app is using port 5173. Close it or change the port in `vite.config.js`.

---

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Router**: React Router DOM 7
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React
