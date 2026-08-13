import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";
export const maxDuration = 60;

const API_KEY = process.env.RENDERER_API_KEY;

export async function GET() {
  return Response.json({
    service: "MCQ HTML/CSS Renderer",
    status: "ok",
  });
}

export async function POST(request) {
  try {
    if (!API_KEY) {
      return Response.json(
        { error: "RENDERER_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const suppliedKey = request.headers.get("x-api-key");

    if (suppliedKey !== API_KEY) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const html = String(body.html ?? "");
    const css = String(body.css ?? "");
    const width = Math.min(Math.max(Number(body.width) || 1080, 100), 3000);
    const height = Math.min(Math.max(Number(body.height) || 1350, 100), 4000);

    if (!html) {
      return Response.json({ error: "html is required" }, { status: 400 });
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: {
        width,
        height,
        deviceScaleFactor: 1,
      },
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    try {
      const page = await browser.newPage();

      const document = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=${width}, initial-scale=1">
<style>
html,body {
  margin:0;
  padding:0;
  width:${width}px;
  height:${height}px;
  overflow:hidden;
}
*,*::before,*::after { box-sizing:border-box; }
${css}
</style>
</head>
<body>${html}</body>
</html>`;

      await page.setContent(document, {
        waitUntil: "networkidle0",
      });

      const image = await page.screenshot({
        type: "png",
        fullPage: false,
      });

      return new Response(image, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": 'inline; filename="mcq.png"',
          "Cache-Control": "no-store",
        },
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error("Renderer error:", error);

    return Response.json(
      {
        error: "Rendering failed",
        message: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
