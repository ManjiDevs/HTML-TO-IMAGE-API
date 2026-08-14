import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import net from "node:net";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const MAX_HTML_BYTES = 512 * 1024;
const MAX_CSS_BYTES = 512 * 1024;
const MAX_CONCURRENT_RENDERS = 2;

const state = (globalThis.__HTML_TO_IMAGE_API__ ??= {
  activeRenders: 0,
});

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: {
      ...CORS_HEADERS,
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

function byteLength(value) {
  return Buffer.byteLength(value, "utf8");
}

function isPrivateHostname(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");

  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host === "0.0.0.0" ||
    host === "::" ||
    host === "::1"
  ) return true;

  const type = net.isIP(host);

  if (type === 4) {
    const [a, b] = host.split(".").map(Number);
    return (
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }

  if (type === 6) {
    return (
      host === "::1" ||
      host.startsWith("fc") ||
      host.startsWith("fd") ||
      host.startsWith("fe8") ||
      host.startsWith("fe9") ||
      host.startsWith("fea") ||
      host.startsWith("feb")
    );
  }

  return false;
}

function isAllowedAssetUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol === "data:" || url.protocol === "blob:") return true;
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    return !isPrivateHostname(url.hostname);
  } catch {
    return false;
  }
}

function buildDocument(html, css, width, height) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=${width}, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' https: data:; img-src https: data: blob:; font-src https: data: blob:; media-src data: blob:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none';">
<style>
html,body{margin:0;padding:0;width:${width}px;height:${height}px;overflow:hidden}
*,*::before,*::after{box-sizing:border-box}
${css}
</style>
</head>
<body>${html}</body>
</html>`;
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  return json({
    service: "HTML TO IMAGE API",
    status: "ok",
    version: "1.2.0",
    authentication: "none",
    rateLimit: "none",
  });
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const html = typeof body?.html === "string" ? body.html : "";
  const css = typeof body?.css === "string" ? body.css : "";

  if (!html) {
    return json({ error: "html is required and must be a string" }, 400);
  }

  if (byteLength(html) > MAX_HTML_BYTES) {
    return json({ error: "html is too large", maxBytes: MAX_HTML_BYTES }, 413);
  }

  if (byteLength(css) > MAX_CSS_BYTES) {
    return json({ error: "css is too large", maxBytes: MAX_CSS_BYTES }, 413);
  }

  const widthValue = Number(body?.width);
  const heightValue = Number(body?.height);

  const width = Number.isFinite(widthValue)
    ? Math.min(Math.max(Math.round(widthValue), 100), 3000)
    : 1080;
  const height = Number.isFinite(heightValue)
    ? Math.min(Math.max(Math.round(heightValue), 100), 4000)
    : 1350;

  if (state.activeRenders >= MAX_CONCURRENT_RENDERS) {
    return json(
      {
        error: "Renderer busy",
        message: "Too many renders are running. Try again shortly.",
      },
      503,
      { "Retry-After": "2" }
    );
  }

  state.activeRenders++;
  let browser;

  try {
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        "--disable-dev-shm-usage",
        "--no-first-run",
        "--no-default-browser-check",
      ],
      defaultViewport: { width, height, deviceScaleFactor: 1 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on("request", (request) => {
      const url = request.url();
      if (isAllowedAssetUrl(url)) {
        request.continue().catch(() => {});
      } else {
        request.abort("blockedbyclient").catch(() => {});
      }
    });

    page.on("pageerror", (error) => {
      console.warn("Page error:", error.message);
    });

    await page.setDefaultNavigationTimeout(15_000);
    await page.setDefaultTimeout(15_000);

    await page.setContent(buildDocument(html, css, width, height), {
      waitUntil: "domcontentloaded",
    });

    await Promise.race([
      page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
        await Promise.all(
          Array.from(document.images).map((image) => {
            if (image.complete) return Promise.resolve();
            return new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", resolve, { once: true });
            });
          })
        );
      }),
      new Promise((resolve) => setTimeout(resolve, 5_000)),
    ]);

    const image = await page.screenshot({ type: "png", fullPage: false });

    return new Response(image, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="render.png"',
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Renderer error:", error);

    return json(
      {
        error: "Rendering failed",
        message:
          process.env.NODE_ENV === "development"
            ? error?.message || String(error)
            : "Unable to render the supplied HTML/CSS.",
      },
      500
    );
  } finally {
    if (browser) {
      try { await browser.close(); } catch {}
    }
    state.activeRenders--;
  }
}
