# Radix

React (Vite) frontend + Node.js (Express) backend.

## Structure

```
radix/
├── backend/            # Node.js + Express API
│   └── src/
│       ├── config/       # env-based configuration
│       ├── controllers/  # request handlers
│       ├── middlewares/  # error handling, 404, etc.
│       ├── models/       # data models
│       ├── routes/       # route definitions (mounted at /api)
│       ├── services/     # business logic
│       ├── utils/        # helpers
│       ├── app.js        # express app setup
│       └── server.js     # entry point
└── frontend/           # React + Vite
    ├── public/
    └── src/
        ├── assets/
        ├── components/
        ├── hooks/
        ├── pages/
        ├── services/     # API calls
        ├── styles/
        ├── utils/
        ├── App.jsx
        └── main.jsx
```

## Getting started

```bash
npm run install:all
cp backend/.env.example backend/.env

npm run dev:backend    # http://localhost:5000  (API at /api)
npm run dev:frontend   # http://localhost:5173
```
