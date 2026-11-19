# Radix Website

Company website of **Radix**, Planspiel Web Engineering, TU Chemnitz.

> This website does not belong to a real company. It is a Planspiel Web Engineering project at University of Technology Chemnitz.

Live: https://radix-it.vercel.app

## Project Structure
```
frontend/           the website
  index.html        whole site (HTML, CSS and JavaScript in one file)
  images/           team photos, logo and Pitch 1 ranking
backend/            reserved for server code (the website is static, so it is empty for now)
.gitignore
.gitattributes
README.md
```

## Features
- Single-page company website: About, Vision and Mission, Values, Culture, Team, Growth Log, Updates and Contact
- Team flip cards, animated hero and background
- Built-in FAQ chat with pre-written answers (no AI, nothing is stored)
- Contact form that prepares an email in the visitor's own mail app
- Imprint and Privacy Policy pages (`/#imprint`, `/#privacy`)

## Run Locally
Open `frontend/index.html` in a browser, or start a small server:
```
cd frontend
npx serve .
```

## Editing Content
Team members, the growth log and the upcoming milestones are arrays near the top of the `<script>` in `frontend/index.html` (`TEAM`, `GROWTH`, `MILESTONES`).

## Deployment (Vercel)
In the Vercel project settings, set **Root Directory** to `frontend`. No build command is needed.
