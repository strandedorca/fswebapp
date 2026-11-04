# PhishGuard front end

React UI for the COS30049 phishing URL detector. Users paste a web address; the app validates it, calls the FastAPI back end, and shows the verdict, confidence, and URL signals.

## Requirements

- Node.js 20 or newer
- Back end running at `http://127.0.0.1:8000`

## Setup

```bash
cd front-end
npm install
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173).

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server (proxies `/api` to the back end) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |

## API used by this app

In development, Vite proxies `/api` to `http://127.0.0.1:8000`.

| Method | Path | Body / notes |
| --- | --- | --- |
| `POST` | `/api/predict` | `{ "url": "https://example.com/" }` |
| `GET` | `/api/health` | Expects `{ "status": "ok" }` |

**Success (200):**

```json
{
  "url": "https://example.com/",
  "verdict": "phishing",
  "phishing_probability": 0.44,
  "confidence": 0.56
}
```

**Error:** `{ "error": "...", "detail": "..." }` — the UI shows `detail` to the user.

Optional: copy `.env.example` to `.env` and set `VITE_API_BASE` if the API is not on the same origin. Leave it empty when using the Vite proxy.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Analyse — input form and examples |
| `/result` | Trust score, confidence, URL breakdown, session chart |
| `/dataset` | Training-data visualisations |
| `/about` | How it works and team |
| `*` | 404 page |

Unexpected React failures are caught by an error boundary so the user never sees a blank screen.

## Front-end security notes

- Input is validated before it is sent (empty, length, `http`/`https` only).
- The address is shown as text only; it is never rendered as HTML or used as a navigable link from the result.
- The input length is capped at 2048 characters in the form.
- Front-end checks are for usability. The back end must enforce the same limits again.

If the API is down, the result page can show a **local signal preview** from the URL text. That preview is not the trained model.

## Project layout

```
front-end/
  src/
    api/           # predict + health client
    components/    # shared UI pieces
    pages/         # route screens
    lib/           # validation + URL signal helpers
    context/       # session history for this browser tab
  vite.config.js   # proxies /api → :8000
```

## Pinned dependencies

Versions are pinned in `package.json` (exact versions, no `^`). Main packages:

- `react` / `react-dom` 19.2.0
- `react-router-dom` 7.18.5
- `recharts` 2.15.4
- `vite` 7.3.7
- `tailwindcss` 3.4.18

For architecture, threat model, and marked security defences, see the main project README.
