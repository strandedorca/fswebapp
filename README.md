# PhishGuard front end

React UI for the COS30049 phishing URL detector. Users paste a web address; the
app validates it, calls the FastAPI back end, and shows a trust score, verdict,
confidence, plain-language model explanations, URL breakdown, and session history.

## Requirements

- Node.js 20 or newer
- Back end running at `http://127.0.0.1:8000`

## Setup

```bash
cd front-end
npm install
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173). Use `localhost` or
`127.0.0.1` consistently with the back-end CORS origin.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server (proxies `/api` to the back end) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |

## API used by this app

In development, Vite proxies `/api` to `http://127.0.0.1:8000`.

| Method | Path | Used for |
| --- | --- | --- |
| `POST` | `/api/predict` | Analyse a URL on the Result page |
| `GET` | `/api/dataset-info` | Training-set charts on the Dataset page |
| `GET` | `/api/health` | Optional health helper in the API client |

Optional: copy `.env.example` to `.env` and set `VITE_API_BASE` if the API is
not on the same origin. Leave it empty when using the Vite proxy.

### Predict success (200)

```json
{
  "url": "http://paypal-secure-login.xyz/account/verify",
  "verdict": "phishing",
  "phishing_probability": 0.9753,
  "confidence": 0.9753,
  "top_factors": [
    {
      "feature": "tld_phish_rate",
      "value": 0.934,
      "effect": 3.0,
      "direction": "phishing"
    }
  ]
}
```

The front end maps that into:

- `trustScore` = `round((1 - phishing_probability) * 100)`
- `modelFactors` from `top_factors` (`feature`, `value`, `effect`, `direction`)

Errors use `{ "error": "...", "detail": "..." }`. The UI shows `detail` when it
is a string.

### Dataset info success (200)

```json
{
  "total_urls": 305763,
  "legitimate": 253379,
  "phishing": 52384,
  "features_extracted": 43,
  "avg_chars_legitimate": 59.18,
  "avg_chars_phishing": 44.91,
  "top_features": [
    { "feature": "url_len", "importance": 0.18 }
  ]
}
```

The Dataset page loads this live. If the request fails, it shows an error and
retry instead of placeholder numbers.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Analyse — URL form, validation, examples |
| `/result` | Trust score, confidence, breakdown, explanations, session chart |
| `/dataset` | Live training-data summary and feature-importance chart |
| `/about` | How it works and team |
| `/error` | Standalone error screen (also used by the error boundary) |
| `*` | 404 page |

Unexpected React failures are caught by an error boundary so the user never
sees a blank screen.

## Analyse flow

1. The form validates the address in the browser (`validateUrl`):
   - non-empty, max 2048 characters, no spaces
   - `http` or `https` only
   - no username/password in the URL
   - host must be IPv4 or a domain with a letters-only TLD (aligned with the API)
2. On success, navigation goes to `/result` with the URL in router state.
3. `/result` calls `POST /api/predict`.
4. On success, the check is stored in React state and `sessionStorage`
   (`phishguard.checks`, max 20 entries, this browser tab only).
5. The page shows:
   - trust gauge and Low / Medium / High trust band from the score
   - model verdict and confidence
   - URL breakdown (protocol, host, path, query)
   - **Why this score?** cards from the model’s `top_factors`
   - session chart/chips to reopen earlier checks in this tab

The app never opens the submitted address as a page request. The string is
shown as text only.

## Result explanations

### Successful API result

- The score and verdict come from the model.
- Explanation cards come from `top_factors`, rewritten in plain language on the
  front end (`lib/modelFactors.js`).
- Each card states:
  1. what was measured on this URL (from `value`)
  2. whether that made the score look more like phishing or a legitimate site
     (from `direction`)
- Local URL heuristics are **not** shown on successful API results.
- Card colours are based on contribution strength `|effect|`, not direction:
  - red: `|effect| ≥ 0.75`
  - yellow: `|effect| ≥ 0.25`
  - blue: weaker than `0.25`
- The highlighted URL segment in each card matches the factor focus (host, path,
  query, and so on). Tag, title, and highlight share the card colour.
- Cards also show `Feature value … · contribution …` for transparency.

### API unavailable (local preview)

If predict fails, the user can open a **local preview**:

- score and signals come from front-end URL heuristics (`lib/explainUrl.js`)
- there are no model factors
- the page clearly labels the result as a preview, not the trained model

The same explanation card component is reused for model factors and local
preview signals; only the information source changes.

## Session history

- Stored per browser tab in `sessionStorage`
- Each Analyse creates a new entry (new id), even for the same URL
- Selecting a bar/chip reopens that saved result without calling the API again
- Closing the tab clears the history

## Front-end security notes

- Input is validated before it is sent.
- The address is shown as text only; it is never rendered as HTML or used as a
  navigable outbound link from the result.
- The input length is capped at 2048 characters in the form.
- Front-end checks are for usability. The back end must enforce the same limits
  again.

## Project layout

```
front-end/
  src/
    api/           # predict, dataset-info, health client
    components/    # shared UI (form, charts, explanation cards, …)
    pages/         # route screens
    lib/           # validation, local URL helpers, model-factor wording
    context/       # session history for this browser tab
    data/          # example URLs for the Analyse page
  vite.config.js   # proxies /api → :8000
```

## Pinned dependencies

Versions are pinned in `package.json` (exact versions, no `^`). Main packages:

- `react` / `react-dom` 19.2.0
- `react-router-dom` 7.18.5
- `recharts` 2.15.4
- `vite` 7.3.7
- `tailwindcss` 3.4.18

For architecture, threat model, and marked security defences, see the main
project README.
