# MCQ HTML/CSS -> PNG — Vercel + FastAPI

## Why the previous deployment crashed

Playwright itself was installed, but Chromium was not available at runtime. The fix is to install Chromium during the Vercel build with:

`PLAYWRIGHT_BROWSERS_PATH=0 python -m playwright install chromium`

and set `PLAYWRIGHT_BROWSERS_PATH=0` at runtime so Playwright searches the bundled browser.

## Environment variables

Required:

`RENDERER_API_KEY=your-long-random-secret`

If Vercel asks to enable Large Functions because the browser bundle is large, enable the Large Functions beta with:

`VERCEL_SUPPORT_LARGE_FUNCTIONS=1`

and redeploy. Vercel currently supports up to 5 GB for eligible Large Functions on Fluid Compute.

## Endpoint

POST:

`https://YOUR-DOMAIN.vercel.app/render`

Header:

`X-API-Key: your-secret`

JSON:

```json
{
  "html": "<div class='poster'>Hello</div>",
  "css": ".poster{width:1080px;height:1350px;background:#08090d;color:#fff;}",
  "width": 1080,
  "height": 1350
}
```

Returns PNG bytes.

## n8n

HTTP Request:
- Method: POST
- URL: `https://YOUR-DOMAIN.vercel.app/render`
- Header: `X-API-Key`
- Header value: your secret
- Send Body: JSON
- Response: File

JSON body:

```json
{
  "html": "={{ $json.html }}",
  "css": "={{ $json.css }}",
  "width": 1080,
  "height": 1350
}
```

Then connect the binary output to Telegram Send Photo.
