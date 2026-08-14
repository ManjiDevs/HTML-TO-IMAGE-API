# n8n-nodes-html-to-image

Official n8n community node for the [HTML TO IMAGE API](https://github.com/ManjiDevs/HTML-TO-IMAGE-API).

Convert HTML + CSS to a PNG directly inside n8n.

## Node

**HTML to Image**

- HTML
- CSS
- Width
- Height
- Binary property name

The node returns the generated PNG as binary data (`data` by default).

## Install

From an n8n instance:

```bash
npm install n8n-nodes-html-to-image
```

For local/self-hosted n8n, install the package as a community node and restart n8n.

No API key or database is required.

## API

The node uses:

`https://html-to-image-api-free.vercel.app/api/render`

For production or high-volume use, self-host the API and change the endpoint in the node source.

## Development

```bash
cd n8n
npm pack
```

## License

MIT
