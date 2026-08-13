# MCQ HTML → Image API

Next.js API using Puppeteer + `@sparticuz/chromium`, designed for Vercel.

## Deploy

```bash
npm install
npm run build
vercel --prod
```

Set this Vercel environment variable:

```text
RENDERER_API_KEY=your-long-random-secret
```

## Test

Health:

```text
GET /api/render
```

Render:

```text
POST /api/render
X-API-Key: your-secret
Content-Type: application/json
```

Body:

```json
{
  "html": "<div class='poster'><h1>Hello</h1></div>",
  "css": ".poster{width:1080px;height:1350px;background:#08090d;color:white;padding:80px}",
  "width": 1080,
  "height": 1350
}
```

The response is a PNG image.

## n8n

HTTP Request node:

- Method: `POST`
- URL: `https://YOUR-DOMAIN.vercel.app/api/render`
- Header: `X-API-Key: YOUR_SECRET`
- Header: `Content-Type: application/json`
- Send Body: JSON
- Response: File

JSON:

```json
{
  "html": "={{ $json.html }}",
  "css": "={{ $json.css }}",
  "width": 1080,
  "height": 1350
}
```

The output can then go directly to Telegram's Send Photo node.
