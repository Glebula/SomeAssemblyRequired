# Some Assembly Required 🤖

> A hybrid card + digital robotics engineering game designed for teen events like MIT Robotics competitions.

**Design. Build. Test.**

## What is this?

Some Assembly Required is a browser-based game where players draw a physical **Mission Card** from a real deck, type the card's code into this web app, then build a robot by dragging and dropping visual components onto a workbench. The robot assembles visually as parts are added. A simulation then tests the robot against the mission, and players receive a score out of 100.

Built for teens (13–17) at robotics events — no accounts, no saved data, just pure gameplay.

## Features

- **20 unique missions** — from Hospital Nurse Bot to Avalanche Rescue to Deep Sea Repair
- **40 robot parts** across 7 categories (Frame, Arms, Sensors, AI, Communication, Power, Specialty)
- **Combo system** — pair compatible parts for bonus synergies (⚡ Surgeon Suite, Empathy Engine, All-Seeing, Extraction Kit)
- **Conflict system** — incompatible parts penalize stats (⚠ OVERLOAD, INTERFERENCE)
- **Drag-and-drop workbench** with live robot visualization
- **Curveball events** — unexpected challenges after the build phase
- **Bits Challenge** — earn bonus currency by answering engineering, logic, and ethics questions
- **Field Test simulation** — animated playback of your robot attempting the mission
- **Live leaderboard** — track scores at your event (all in-memory, no server needed)
- **Developer Mode** — hidden tools for facilitators and event organizers

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build for Deployment

```bash
npm run build
```

The `dist/` folder can be deployed to Vercel, Netlify, or GitHub Pages — it's a fully static site.

## How to Play

1. **Draw a Mission Card** from the physical deck
2. **Enter the code** (format: `MSN-XXXX`) into the app
3. **Read the Mission Briefing** — understand the job, environment, and stat requirements
4. **Build your robot** in 3 minutes by dragging parts onto the workbench
5. **Face a Curveball** — an unexpected event challenges your design
6. **Answer the Bits Challenge** — earn bonus currency with engineering questions
7. **Watch the Field Test** — see how your robot performs against the mission
8. **See your score** — 0-100, with Bronze/Silver/Gold badges

## Dev Mode

Access via Settings (⚙) — password: `SAR-DEV-2026`

Dev Mode unlocks: unlimited Bits, unlimited time, skip phases, force scores, phase jumping, and more.

## Tech Stack

- **React** (Vite)
- **Tailwind CSS**
- **@dnd-kit** for drag-and-drop
- 100% client-side — no backend, no database, no localStorage

---

*Designed for MIT Robotics Events. All state resets on page refresh — intentional!*
