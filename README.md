# Radix Website

Company website of **Radix**, Planspiel Web Engineering, TU Chemnitz.

> This website does not belong to a real company. It is a Planspiel Web Engineering project at University of Technology Chemnitz.

Live: https://radix-it.vercel.app

## Project Structure
React 18 + Vite, component-based. Each component lives in its own folder with its own CSS.
```
frontend/
  public/images/            shared static assets (served at /images/...)
  index.html                Vite entry HTML
  src/
    main.jsx, App.jsx       entry + page routing (#imprint, #privacy)
    styles/                 global.css, variables.css, animations.css
    data/                   EDIT CONTENT HERE: team.js, growth.js, content.js, assistant.jsx
    hooks/                  useInView, useHashRoute, useReducedMotion
    utils/                  rootSystem (canvas roots), format, milestones
    components/
      common/               Button, Brand, ChapterLabel, Reveal, CountUp, RootCanvas
      layout/               Disclaimer, Header (+ Nav), Footer, Background
      sections/             Hero, Problem, Answer,
                            About (VisionMission, Values, Culture, Story),
                            Process (StepList, StepPanel), Team (TeamCard),
                            Updates (GrowthLog (GrowthEntry, FeaturedEntry, FutureEntry), News (NewsCard)),
                            Contact (ContactInfo, ContactForm)
      pages/                Home, Legal (Imprint, Privacy)
      widgets/              ChatAssistant (ChatPanel, ChatMessage)
backend/                    reserved for server code
legacy/                     the original single-file site (backup)
```

## Features
- Single-page company website: About, Vision and Mission, Values, Culture, Team, Growth Log, Updates and Contact
- Fully responsive from 320px phones to wide desktops
- Team flip cards, animated hero and background
- Built-in FAQ chat with pre-written answers (no AI, nothing is stored)
- Contact form that prepares an email in the visitor's own mail app
- Imprint and Privacy Policy pages (`/#imprint`, `/#privacy`)

## Run Locally
```
cd frontend
npm install
npm run dev        # http://localhost:5173
```
Production build: `npm run build` (output in `frontend/dist`), preview with `npm run preview`.

## Editing Content
All text lives in `frontend/src/data/` (`team.js`, `growth.js` with `GROWTH`/`MILESTONES`/`NEWS`, `content.js`, `assistant.jsx`).
Images go in `frontend/public/images/` and are referenced as `/images/name.webp`.

## Deployment (Vercel)
`vercel.json` installs and builds the `frontend` app and serves `frontend/dist`. Leave Vercel's Root Directory empty (repo root).
