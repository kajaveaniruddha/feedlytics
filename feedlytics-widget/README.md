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

1. Host sites embed the widget (script bundle or web component).
2. On load, the widget calls **`GET {FEEDLYTICS_API_BASE_URL}/api/v1/workspaces/{workspacePublicId}/widget`** on the Feedlytics API. The browser sends an **`Origin`** header; that origin must be listed in the workspace’s allowed widget origins (dashboard **Settings**).
3. Users submit feedback; the widget calls **`POST …/send-feedback`** with header **`X-Feedlytics-Widget-Secret`**, JSON body `content`, `rating` (1–5), `sourceType: "WIDGET"`, and optional `submitterName` / `submitterEmail` when the workspace widget collects them. The API records IP, user agent, referrer, and accept-language server-side.

## API base URL (build-time)

The API origin is **not** passed at runtime. It comes from [`src/lib/utils.js`](src/lib/utils.js) (`FEEDLYTICS_API_BASE_URL`), normally populated from **`VITE_FEEDLYTICS_API_BASE_URL`** when you build the bundle. For a one-off embed, you can set a literal default in that file next to `rawFeedlyticsApiBase`.

## Configuration

`main.jsx` runs **before** React mounts. Putting IDs only inside `App.jsx` does not run early enough—use one of the options below.

### Script embed (recommended): `data-*` on the widget script

```html
<script
  src="/feedlytics_widget.js"
  data-workspace-public-id="00000000-0000-0000-0000-000000000000"
  data-widget-secret="your-widget-secret"
></script>
```

### Script embed: `window.feedlytics_widget` **before** the bundle

The inline script must run **above** the widget script so the global exists when the bundle executes:

```html
<script>
  window.feedlytics_widget = {
    workspacePublicId: "00000000-0000-0000-0000-000000000000",
    widgetSecret: "your-widget-secret",
  };
</script>
<script src="/feedlytics_widget.js"></script>
```

- **`workspacePublicId`**: Workspace public UUID (same as in the dashboard URL).
- **`widgetSecret`**: From dashboard **Widget integration** (browser-visible, like any client-side secret).

If the page URL’s last path segment is a UUID, it is used as `workspacePublicId` when that field is omitted (dev convenience only).

### Web component

```html
<feedlytics-widget
  workspace-public-id="00000000-0000-0000-0000-000000000000"
  widget-secret="your-widget-secret"
></feedlytics-widget>
```

### Local dev (`pnpm dev`)

Use **`data-workspace-public-id`** and **`data-widget-secret`** on the same `<script type="module" src="/src/main.jsx">` tag as in [`index.html`](index.html) (this works because `main.jsx` resolves the script tag when `document.currentScript` is unset for modules).

You can still set `window.feedlytics_widget` in an inline script **before** that tag; non-empty `data-*` values take precedence when both are present.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_FEEDLYTICS_API_BASE_URL` | Feedlytics API origin baked into the bundle (e.g. `http://localhost:8080`). Required unless you hardcode a default in `src/lib/utils.js`. |

## Key Directories

```
feedlytics-widget/
├── src/
│   ├── components/
│   │   ├── Widget.jsx      # Main widget component
│   │   └── ui/             # shadcn/ui primitives
│   ├── lib/
│   │   └── utils.js        # FEEDLYTICS_API_BASE_URL (API origin)
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── web-component.jsx   # Web Component wrapper
├── public/                 # Static assets
├── Dockerfile              # Production image (serves with `serve`)
└── Dockerfile.dev          # Development image (Vite HMR)
```
