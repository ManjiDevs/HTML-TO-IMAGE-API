# MCQ HTML/CSS → PNG — Vercel + FastAPI

## Project structure

api/index.py
requirements.txt
vercel.json

## Environment variable

Set this in Vercel:

RENDERER_API_KEY=use-a-long-random-secret

## Deploy

```bash
npm i -g vercel
vercel login
vercel
```

For production:

```bash
vercel --prod
```

The API is:

POST https://YOUR-DOMAIN.vercel.app/render

Header:

X-API-Key: your-secret

JSON body:

```json
{
  "html": "<div class='poster'>Hello</div>",
  "css": ".poster{width:1080px;height:1350px;background:#08090d;color:#fff;}",
  "width": 1080,
  "height": 1350
}
```

Response: PNG image bytes.

## n8n HTTP Request

Method: POST

URL:
https://YOUR-DOMAIN.vercel.app/render

Headers:
- X-API-Key: your-secret
- Content-Type: application/json

Body JSON:

```json
{
  "html": "={{ $json.html }}",
  "css": "={{ $json.css }}",
  "width": 1080,
  "height": 1350
}
```

Response format: File.

Then connect the HTTP Request node to Telegram "Send Photo" and select the binary property produced by the HTTP Request node.

## Important

This renderer intentionally disables JavaScript inside generated HTML. HTML/CSS, fonts, images and SVG are supported, but arbitrary `<script>` code is not.

Vercel supports FastAPI/Python Functions. Playwright/Chromium makes this heavier than a normal API, so the first request after a cold start can be slower. Vercel's current Python bundle limits are large enough for this approach, but browser automation still consumes CPU/memory.
