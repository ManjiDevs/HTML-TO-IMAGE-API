# HTML TO IMAGE API

Free, open-source **HTML/CSS → PNG API** powered by Next.js, Puppeteer and Chromium.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ManjiDevs/HTML-TO-IMAGE-API)

Convert HTML + CSS into a PNG with one simple request.

## Features

- Free & open source
- No API key or authentication
- No database
- No external services
- Self-hostable
- Vercel one-click deploy
- Custom image dimensions
- CORS enabled
- Input and render protections

## Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ManjiDevs/HTML-TO-IMAGE-API)

No environment variables required.

## API

```http
POST /api/render
Content-Type: application/json
```

```json
{
  "html": "<h1>Hello</h1>",
  "css": "body{width:1080px;height:1350px;background:#08090d;color:white}",
  "width": 1080,
  "height": 1350
}
```

Returns the PNG directly as `image/png`.

### cURL

```bash
curl -X POST "https://YOUR-DOMAIN.vercel.app/api/render" \
  -H "Content-Type: application/json" \
  --data-raw '{
    "html":"<h1>Hello</h1>",
    "css":"body{background:#08090d;color:white}",
    "width":1080,
    "height":1350
  }' --output image.png
```

## n8n

Use an **HTTP Request** node:

```text
POST https://YOUR-DOMAIN.vercel.app/api/render
Authentication: None
Content-Type: application/json
Response Format: File
```

```json
{
  "html": "={{ $json.html }}",
  "css": "={{ $json.css }}",
  "width": 1080,
  "height": 1350
}
```

## Limits

- HTML: 512 KB
- CSS: 512 KB
- Width: 100–3000 px
- Height: 100–4000 px
- 2 concurrent renders per warm instance

There is **no application-level rate limit**. Add your own rate limiting when running a public instance if needed.

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

If you use this project in your own app or service, credit the project and the developer team:

**ManjiDevs** — https://github.com/ManjiDevs

## Contributing

Pull requests and improvements are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License — see [LICENSE](LICENSE).

---

**ManjiDevs • Open Source Developer Team**
