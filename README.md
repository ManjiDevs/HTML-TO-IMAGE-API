# HTML TO IMAGE API

Free and open-source **HTML/CSS → PNG rendering API** built with Next.js, Puppeteer, and `@sparticuz/chromium`.

Convert HTML and CSS into a PNG image through a simple HTTP API.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ManjiDevs/HTML-TO-IMAGE-API)

## Features

- Free and open source
- No API key
- No authentication
- No database
- No external rendering service
- Self-hostable
- One-click Vercel deployment
- HTML + CSS → PNG
- Custom width and height
- CORS enabled
- Payload limits
- Concurrent render protection
- Basic SSRF protection for remote assets
- Vercel-compatible Chromium

## Quick Deploy

Deploy your own instance to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ManjiDevs/HTML-TO-IMAGE-API)

After deployment, your API will be available at:

```text
https://YOUR-PROJECT.vercel.app/api/render
```

No environment variables or API keys are required.

## API

### Health Check

```http
GET /api/render
```

Example:

```json
{
  "service": "HTML TO IMAGE API",
  "status": "ok",
  "version": "1.2.0",
  "authentication": "none",
  "rateLimit": "none"
}
```

### Render HTML

```http
POST /api/render
Content-Type: application/json
```

Request:

```json
{
  "html": "<div class='poster'>MCQ TEST</div>",
  "css": ".poster{width:1080px;height:1350px;background:#08090d;color:white;display:grid;place-items:center;font:800 80px Arial}",
  "width": 1080,
  "height": 1350
}
```

Response:

```http
Content-Type: image/png
```

The PNG bytes are returned directly.

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

Pass the binary output directly to Telegram `Send Photo`, Discord, storage, or another service.

## Limits

| Resource | Limit |
|---|---:|
| HTML | 512 KB |
| CSS | 512 KB |
| Width | 100–3000 px |
| Height | 100–4000 px |
| Concurrent renders | 2 per warm function instance |

There is **no application-level rate limit**. This project is intended primarily for self-hosting, where the operator controls infrastructure and can add rate limiting at the reverse proxy, CDN, firewall, or hosting layer if needed.

## Remote Assets

Public `http://` and `https://` images and fonts can be used in generated HTML/CSS.

Obvious local/private destinations such as `localhost`, loopback, RFC1918 private IPv4 ranges, link-local addresses, and private IPv6 ranges are blocked.

## Security

The renderer runs submitted HTML/CSS inside Chromium.

The generated document uses a Content Security Policy that disables scripts, frames, objects, arbitrary connections, and private/local asset destinations. The API does not require authentication because it is designed to be deployed and controlled by the operator.

Do not submit passwords, API keys, private tokens, credentials, or confidential information in HTML/CSS.

If you expose a self-hosted instance publicly, add your own rate limiting and access controls at the infrastructure layer when required.

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

### One click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ManjiDevs/HTML-TO-IMAGE-API)

### CLI

```bash
npm install
git clone https://github.com/ManjiDevs/HTML-TO-IMAGE-API.git
cd HTML-TO-IMAGE-API
npm install
vercel --prod
```

No environment variables are required.

## Self-Hosting

You can run the project on your own server or hosting provider that supports the Next.js Node.js runtime and Chromium dependencies.

The project has no database and no required external service.

## Architecture

```text
Client
  │
  │ POST HTML + CSS
  ▼
Next.js Route Handler
  │
  ├── Input validation
  ├── Payload limits
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

## Use Cases

- MCQ and educational posters
- Social media graphics
- Code snippets as images
- Automated reports
- Certificates
- Quote cards
- Telegram and Discord bots
- n8n workflows
- Dynamic HTML screenshots
- Developer tools

## License

MIT License. See [LICENSE](LICENSE).

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Project

Maintained by **ManjiDevs**.

Repository:

https://github.com/ManjiDevs/HTML-TO-IMAGE-API
