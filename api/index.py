import os
from contextlib import asynccontextmanager

# Keep Playwright looking inside the deployed function bundle.
os.environ.setdefault("PLAYWRIGHT_BROWSERS_PATH", "0")

from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field
from playwright.async_api import async_playwright

API_KEY = os.getenv("RENDERER_API_KEY", "")
browser = None
pw = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global browser, pw
    pw = await async_playwright().start()
    browser = await pw.chromium.launch(
        headless=True,
        args=[
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
        ],
    )
    yield
    if browser:
        await browser.close()
    if pw:
        await pw.stop()


app = FastAPI(title="MCQ HTML/CSS Renderer", lifespan=lifespan)


class RenderRequest(BaseModel):
    html: str = Field(..., max_length=500_000)
    css: str = Field("", max_length=500_000)
    width: int = Field(1080, ge=100, le=3000)
    height: int = Field(1350, ge=100, le=4000)


@app.get("/")
async def root():
    return {"service": "mcq-renderer", "status": "ok"}


@app.get("/health")
async def health():
    return {"ok": True}


@app.post("/render")
async def render(req: RenderRequest, x_api_key: str = Header(default="")):
    if not API_KEY or x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")

    page = await browser.new_page(
        viewport={"width": req.width, "height": req.height},
        device_scale_factor=1,
        java_script_enabled=False,
    )

    try:
        document = f"""<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width={req.width}, initial-scale=1">
<style>
html, body {{
  margin: 0;
  padding: 0;
  width: {req.width}px;
  height: {req.height}px;
  overflow: hidden;
}}
* {{ box-sizing: border-box; }}
{req.css}
</style>
</head>
<body>{req.html}</body>
</html>"""

        await page.set_content(document, wait_until="load")
        try:
            await page.wait_for_load_state("networkidle", timeout=4000)
        except Exception:
            pass

        image = await page.screenshot(
            type="png",
            full_page=False,
            animations="disabled",
        )

        return Response(
            content=image,
            media_type="image/png",
            headers={
                "Content-Disposition": 'inline; filename="mcq.png"',
                "Cache-Control": "no-store",
            },
        )
    finally:
        await page.close()
