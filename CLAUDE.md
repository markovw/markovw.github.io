# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo overview

Personal portfolio site for Markov (iOS engineer / backend explorer), deployed as a GitHub Pages static site at `markovw.github.io`. No build step — files are served directly.

- `index.html` — main portfolio/bio page
- `generate.html` — AI image generator page (calls Gemini API directly from the browser using a user-supplied API key stored in `localStorage`)
- `worker/` — Cloudflare Worker that acts as a proxy for the Gemini API (used as an alternative backend to avoid exposing the key client-side)

## Worker (Cloudflare)

The worker lives in `worker/src/index.js` and is managed with Wrangler.

```bash
# Deploy
cd worker && npx wrangler deploy

# Local dev
cd worker && npx wrangler dev
```

The worker expects a `GEMINI_API_KEY` secret set via Wrangler:
```bash
npx wrangler secret put GEMINI_API_KEY
```

Allowed CORS origin is hardcoded to `https://markovw.github.io` — update `ALLOWED_ORIGIN` in `worker/src/index.js` if the domain changes.

## Model

The image generator is locked to `gemini-2.5-flash-preview-image-generation`. Both the frontend (`generate.html`) and the worker (`worker/src/index.js`) enforce this — the worker has an `allowedModels` allowlist that defaults to the first entry if an unlisted model is passed.

## Design system

Both HTML files share the same CSS design token set defined in `:root`. When editing styles, use these tokens rather than hardcoded values:

- Colors: `--c-void`, `--c-deep`, `--c-surface`, `--c-cyan`, `--c-violet`, `--c-gold`, `--c-pink`, `--c-green`, `--c-text-1/2/3`
- Spacing (8pt scale): `--sp-1` (4px) through `--sp-10` (128px)
- Typography: `--ff-display` (Space Grotesk), `--ff-mono` (Space Mono)
- Radii: `--r-sm`, `--r-md`, `--r-lg`, `--r-full`

## GitHub Actions

Two workflows in `.github/workflows/`:
- `claude.yml` — triggers Claude Code on issues/PRs when `@claude` is mentioned
- `claude-code-review.yml` — runs automatic Claude code review on every PR

Both require `CLAUDE_CODE_OAUTH_TOKEN` set as a repository secret.
