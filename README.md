# Some Assembly Required

A browser-based robotics engineering game for teens at robotics events (MIT and beyond).

## What is it?

Players are randomly dealt a real-world robot job — like "Firefighter Bot" or "Robot Surgeon" — then build a robot by selecting parts on a visual workbench. A 2-minute build timer, a curveball event, a quick trivia question, and a field test simulation determine their final score.

**No backend. No accounts. No localStorage. Refresh = full reset. Pick up and play.**

## Tech Stack

- React 18 + Vite
- Tailwind CSS v4
- @dnd-kit/core for drag-and-drop
- Fully client-side, static deployment

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Game Flow

```
Home → Draw Mission → Build (2 min) → Curveball → Question → Simulation → Results
```

- **20 missions** across social, environmental, and physical categories
- **40 robot parts** with stats, tradeoffs, combos, and conflicts
- **4 combos** (Surgeon Suite, Empathy Engine, All-Seeing, Extraction Kit)
- **8 curveball events** with binary choices
- **20 questions** (engineering, logic, ethics, tradeoffs)
- Mystery Mission: job revealed at 1:00 remaining
- Player's Choice: describe any job, requirements auto-generated

## Scoring

Bronze: 50+ | Silver: 70+ | Gold: 85+

## Developer Mode

Password: `SAR-DEV-2026` (enter in Settings)

Enables: unlimited bits/time, phase jumping, force score, force mission, and more.

---

*Designed for robotics events. ~5 minutes per round.*
