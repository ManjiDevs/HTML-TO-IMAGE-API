# HTML TO IMAGE API

Free, open-source **HTML/CSS → PNG API** powered by Next.js, Puppeteer and Chromium.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ManjiDevs/HTML-TO-IMAGE-API)

**Live:** https://html-to-image-api-free.vercel.app/

Convert HTML + CSS into a PNG with one simple request.

## Features

- Free & open source
- No API key or authentication
- No database
- Self-hostable
- One-click Vercel deployment
- Custom image dimensions
- CORS enabled
- n8n community node included

## API

```http
POST https://html-to-image-api-free.vercel.app/api/render
Content-Type: application/json
```

```json
{
  "html": "<h1>Hello</h1>",
  "css": "body{background:#08090d;color:white}",
  "width": 1080,
  "height": 1350
}
```

Returns the PNG directly as `image/png`.

## n8n Node

This repository also contains the official **HTML to Image** n8n community node.

Package: `n8n-nodes-html-to-image`

Source: [`/n8n`](./n8n)

The node accepts HTML, CSS, width and height and returns the generated PNG as binary data. It defaults to the public API and supports a custom API URL for self-hosted deployments.

### Install for self-hosted n8n

```bash
npm install n8n-nodes-html-to-image
```

Then enable/install it as a community node and restart n8n.

## Deploy Your Own API

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ManjiDevs/HTML-TO-IMAGE-API)

No environment variables required.

## cURL

```bash
curl -X POST "https://html-to-image-api-free.vercel.app/api/render" \
  -H "Content-Type: application/json" \
  --data-raw '{
    "html":"<h1>Hello</h1>",
    "css":"body{background:#08090d;color:white}",
    "width":1080,
    "height":1350
  }' --output image.png
```

## Limits

- HTML: 512 KB
- CSS: 512 KB
- Width: 100–3000 px
- Height: 100–4000 px
- 2 concurrent renders per warm instance

There is no application-level rate limit. Add your own rate limiting when running a public instance if needed.

## Self-Hosting

```bash
git clone https://github.com/ManjiDevs/HTML-TO-IMAGE-API.git
cd HTML-TO-IMAGE-API
npm install
npm run dev
```

Requires Node.js 20+.

## Security

The renderer blocks obvious private/local asset destinations and uses a restrictive Content Security Policy. Do not submit secrets or confidential data.

## ⭐ Support

If this project is useful, **star the repository**. It helps other developers discover it.

## Credits

Built and maintained by **ManjiDevs**.

If you use this project in your own app or service, credit the developer team:

**ManjiDevs** — https://github.com/ManjiDevs

## Contributing

Pull requests and improvements are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License — see [LICENSE](LICENSE).

---

**ManjiDevs • Open Source Developer Team**
