# Feedback Widget

A lightweight, embeddable React widget that end users add to their websites to collect feedback. Renders inside a Shadow DOM to avoid style conflicts with the host page.

## Tech Stack

- **React 18**
- **Vite** (bundler and dev server)
- **Tailwind CSS** + Radix UI
- **Axios** (API calls)
- **react-shadow** (Shadow DOM isolation)

## Port

`4173` in both development and production.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Vite dev server with HMR |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests with Vitest |

## How It Works

1. Users embed the widget on their site by adding a script tag or importing the component
2. The widget calls `POST /api/get-widget-settings` on the dashboard to fetch branding (colors, fields)
3. Users fill in the feedback form with optional name/email, a text message, and a star rating
4. On submit, the widget calls `POST /api/send-message` on the dashboard which queues it for AI processing

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_DASHBOARD_BASE_URL` | Dashboard URL for API calls (`http://localhost:3000` in dev, `https://feedlytics.in` in prod) |

## Key Directories

```
Widget/
├── src/
│   ├── components/
│   │   ├── Widget.jsx      # Main widget component
│   │   └── ui/             # shadcn/ui primitives
│   ├── lib/
│   │   └── utils.js        # DASHBOARD_BASE_URL, color helpers
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── web-component.jsx   # Web Component wrapper
├── public/                 # Static assets
├── Dockerfile              # Production image (serves with `serve`)
└── Dockerfile.dev          # Development image (Vite HMR)
```
