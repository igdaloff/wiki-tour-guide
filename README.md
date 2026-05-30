# Wiki Tour Guide

A mobile-first progressive web app that finds interesting Wikipedia-documented places near you and uses AI to generate a personalized narrated walking tour.

## What it does

1. **Discovers nearby places** — Uses the Wikipedia Geosearch API to find notable places within a radius of your current location, pulling in photos, descriptions, and coordinates for each.

2. **Ranks by curiosity** — An optional "Curiosity" sort sends the place list to Claude Haiku, which ranks them by how interesting they'd be to a curious walker — prioritizing ghost towns, unusual history, quirky landmarks, and hidden gems over generic suburbs and townships.

3. **Generates a walking tour** — Tapping "Start Tour" on any place sends your nearby places to Claude Sonnet, which selects 3–4 stops and writes a structured tour: transitional narration between stops, a one-sentence highlight per location, and a warm closing. The tour is cached locally so it doesn't need to be regenerated on revisit.

4. **Narrates the tour** — A listen button on the tour page reads the full narration aloud using the Web Speech API.

5. **Plays Wikipedia audio** — On the place list, a "Listen to Entry" button reads the Wikipedia description of each place aloud, also via the Web Speech API.

## Tech stack

- **Frontend** — Vue 2, SCSS, deployed as a PWA
- **Backend** — Netlify serverless functions (Node.js)
- **AI** — Anthropic Claude API (Haiku for ranking, Sonnet for tour generation), with prompt caching
- **Data** — Wikipedia API (Geosearch, TextExtracts, PageImages, Info modules)
- **Maps** — Google Maps deep links for walking directions

## Local development

```bash
npm install
npm run serve
```

The ranking and tour generation features require a Netlify dev environment to proxy the serverless functions:

```bash
npm install -g netlify-cli
netlify dev
```

Set `ANTHROPIC_API_KEY` in a `.env` file or your Netlify environment variables.

```bash
npm run build   # production build
```
