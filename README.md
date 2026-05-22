# Miss Minutes

A retro-styled **Stopwatch + Timer** web app built with **React + TypeScript + Vite**.

## Features

- Stopwatch mode
  - Start, pause, reset
  - Accurate elapsed-time tracking using timestamp deltas
- Timer mode
  - Custom `HH:MM:SS` input
  - Start, pause, reset, apply time
  - Input validation and clamping
  - Progress bar and completion state
- Smooth mode-switch animation between Stopwatch and Timer
- Responsive UI for mobile, tablet, and desktop
- Accessible controls with focus-visible styling

## Tech Stack

- React 19
- TypeScript
- Vite
- CSS (custom retro UI)
- ESLint

## Project Structure

```text
src/
  assets/
    Miss Minutes.gif
  components/
    ModeSwitch.tsx
    StopwatchPanel.tsx
    TimerPanel.tsx
  App.tsx
  App.css
  index.css
  main.tsx
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Run Vite dev server
- `npm run build` - Type check and create production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production output

## Edge Cases Handled

- Prevents timer start when duration is `00:00:00`
- Numeric-only timer input sanitization
- Clamps timer input ranges (`99h`, `59m`, `59s`)
- Keeps timer/stopwatch intervals cleaned up properly
- Safe state transitions on pause/resume/reset

## App Name

This project is named **Miss Minutes**.
