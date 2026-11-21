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
- Contact form that emails the message straight to the team inbox via [FormSubmit](https://formsubmit.co) (no backend needed). One-time setup: send the first message from the live site, then click "Activate Form" in the email FormSubmit sends to `contact.radixit@gmail.com` (check Spam too). The address is `CONTACT.email` in `src/data/content.js`; changing it needs a new activation.
- Imprint and Privacy Policy pages (`/#imprint`, `/#privacy`)

## Run Locally
```
cd frontend
npm install
npm run dev        # http://localhost:5173
```
Production build: `npm run build` (output in `frontend/dist`), preview with `npm run preview`.
Checks: `npm run lint` (ESLint) and `npm test` (Vitest unit tests for the contact form logic).

## Contact Form Rules
- **Validation** (`src/utils/validation.js`): name 2-60 letters; message 10-2000 characters; email must have a
  proper format, at least one letter before the @ (`123@gmail.com` is rejected), a real domain ending from the
  official IANA list (`1@gmail.ii` is rejected), correct big-provider domains (`gmail.co` suggests `gmail.com`),
  Gmail's 6-30 character usernames, and no throwaway inboxes.
- **Daily limit** (`src/utils/rateLimit.js`): 5 messages per email address per 24 hours. The site has no backend, so
  this is counted in the visitor's browser (only a hash of the address is stored). Enforcing it across devices
  would need a server with a database.
- **Errors**: offline, timeout, blocked request, service busy/down, form not activated and daily limit each show
  their own message, and the visitor's text stays in the form.
- **Refresh the domain-ending list** (`src/data/tlds.js`) if a new ending is ever rejected: download
  https://data.iana.org/TLD/tlds-alpha-by-domain.txt and replace the list in that file (lower case, `xn--` entries skipped).

## Editing Content
All text lives in `frontend/src/data/` (`team.js`, `growth.js` with `GROWTH`/`MILESTONES`/`NEWS`, `content.js`, `assistant.jsx`).
Images go in `frontend/public/images/` and are referenced as `/images/name.webp`.

## Deployment (Vercel)
`vercel.json` installs and builds the `frontend` app and serves `frontend/dist`. Leave Vercel's Root Directory empty (repo root).
