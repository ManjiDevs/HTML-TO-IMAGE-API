# HTML TO IMAGE API

Free, open-source **HTML/CSS → PNG rendering API** built with Next.js, Puppeteer, and `@sparticuz/chromium` for Vercel.

## Features

- Free to use
- No API key
- No authentication
- `POST /api/render`
- HTML + CSS → PNG
- Custom width and height
- CORS enabled
- `1 request / 5 seconds / IP` rate limit
- Basic SSRF protection for remote assets
- HTML/CSS payload limits
- Limited concurrent Chromium renders
- Vercel compatible
- No database or external service required

## API

### Health check

```text
GET /api/render
```

Example response:

```json
{
  "service": "HTML TO IMAGE API",
  "status": "ok",
  "version": "1.1.0",
  "authentication": "none",
  "rateLimit": "1 request / 5 seconds / IP"
}
```

### Render

```text
POST https://YOUR-DOMAIN.vercel.app/api/render
Content-Type: application/json
```

Body:

```json
{
  "html": "<div class='poster'>MCQ TEST</div>",
  "css": ".poster{width:1080px;height:1350px;background:#08090d;color:white;display:grid;place-items:center;font:800 80px Arial}",
  "width": 1080,
  "height": 1350
}
```

The response is a PNG image with `Content-Type: image/png`.

## cURL

```bash
curl -X POST "https://YOUR-DOMAIN.vercel.app/api/render" \
  -H "Content-Type: application/json" \
  --data-raw '{
    "html":"<div class=\"test\">MCQ TEST</div>",
    "css":".test{width:1080px;height:1350px;background:#08090d;color:white;display:flex;align-items:center;justify-content:center;font:800 80px Arial}",
    "width":1080,
    "height":1350
  }' \
  --output test.png
```

No `X-API-Key` header is required.

## n8n

Use an **HTTP Request** node:

```text
Method: POST
URL: https://YOUR-DOMAIN.vercel.app/api/render
Authentication: None
Send Headers: Yes
Content-Type: application/json
Send Body: Yes
Body Content Type: JSON
Response Format: File
```

JSON body:

```json
{
  "html": "={{ $json.html }}",
  "css": "={{ $json.css }}",
  "width": 1080,
  "height": 1350
}
```

The binary output can be passed directly to Telegram's **Send Photo** node.

## Limits

| Resource | Limit |
|---|---:|
| Rate | 1 request / 5 seconds / IP |
| HTML | 512 KB |
| CSS | 512 KB |
| Width | 100–3000 px |
| Height | 100–4000 px |
| Concurrent renders per warm instance | 2 |

When the rate limit is exceeded, the API returns `429 Too Many Requests` with a `Retry-After` header.

## Remote Assets

Remote `http://` and `https://` images/fonts are supported when they are publicly reachable.

Requests to obvious local/private addresses such as `localhost`, loopback, RFC1918 private IPv4 ranges, link-local addresses, and private IPv6 ranges are blocked.

For security, scripts, frames, objects, and arbitrary network connections are disabled by the renderer's Content Security Policy.

## Rate Limiting Architecture

The API intentionally has **no database** and no external rate-limit service.

The rate limiter stores timestamps in the Node.js process memory. This works for a simple, low-cost deployment, but Vercel can run multiple serverless instances. Therefore, the `1 request / 5 seconds / IP` limit is enforced per warm function instance rather than as a globally synchronized counter.

For strict global rate limiting at high traffic, use a shared store such as Redis or Vercel's rate-limiting/firewall infrastructure.

## Local Development

Requirements:

- Node.js 20+
- npm

Install:

```bash
npm install
```

Run:

```bash
npm run dev
```

Test:

```bash
curl -X POST "http://localhost:3000/api/render" \
  -H "Content-Type: application/json" \
  --data-raw '{
    "html":"<h1>Hello</h1>",
    "css":"body{background:#08090d;color:white}",
    "width":1080,
    "height":1350
  }' \
  --output test.png
```

## Deploy to Vercel

```bash
npm install
npm run build
vercel --prod
```

No environment variables are required.

The project already configures `@sparticuz/chromium` and Puppeteer for the Vercel Node.js runtime.

## Architecture

```text
Client
  │
  │ POST HTML + CSS
  ▼
Next.js Route Handler
  │
  ├── IP rate limit
  ├── Input limits
  ├── Asset / SSRF checks
  └── Render concurrency guard
  │
  ▼
Puppeteer
  │
  ▼
Chromium
  │
  ▼
PNG
  │
  ▼
Client / n8n / Bot
```

## Security

This service executes user-supplied HTML and CSS in Chromium. Do not submit passwords, API keys, private tokens, or confidential information.

The API does not execute arbitrary JavaScript from submitted HTML and blocks obvious private-network asset URLs. No security mechanism should be treated as a substitute for keeping the service patched and monitoring abuse.

## License

MIT License. See [LICENSE](LICENSE).

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Project

Maintained by **ManjiDevs**.

Repository:

https://github.com/ManjiDevs/HTML-TO-IMAGE-API
