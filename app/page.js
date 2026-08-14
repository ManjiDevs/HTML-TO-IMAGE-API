"use client";

import { useState } from "react";

const DEFAULT_HTML = `<div class="card">\n  <h1>Hello World</h1>\n  <p>HTML TO IMAGE API</p>\n</div>`;

const DEFAULT_CSS = `.card {\n  width: 1080px;\n  height: 1350px;\n  display: grid;\n  place-content: center;\n  text-align: center;\n  background: #08090d;\n  color: white;\n  font-family: Arial, sans-serif;\n}\n\nh1 { font-size: 72px; margin: 0 0 20px; }\np { font-size: 28px; opacity: .7; }`;

export default function Home() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1350);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function renderImage() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          css,
          width: Number(width),
          height: Number(height),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || data.error || `Request failed (${response.status})`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "render.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Rendering failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <nav className="nav">
        <a href="/" className="brand">HTML TO IMAGE</a>
        <a href="https://github.com/ManjiDevs/HTML-TO-IMAGE-API" target="_blank" rel="noreferrer" className="github">GitHub ↗</a>
      </nav>

      <section className="hero">
        <div className="badge">FREE · OPEN SOURCE · NO AUTH</div>
        <h1>HTML + CSS<br /><span>to PNG.</span></h1>
        <p>Paste your HTML and CSS. Render it with Chromium and download the PNG.</p>
      </section>

      <section className="workspace">
        <div className="panel editor-panel">
          <div className="panel-head">
            <span>HTML</span>
            <span className="dot" />
          </div>
          <textarea value={html} onChange={(e) => setHtml(e.target.value)} spellCheck="false" />
        </div>

        <div className="panel editor-panel">
          <div className="panel-head">
            <span>CSS</span>
            <span className="dot" />
          </div>
          <textarea value={css} onChange={(e) => setCss(e.target.value)} spellCheck="false" />
        </div>

        <div className="controls">
          <label>Width <input type="number" min="100" max="3000" value={width} onChange={(e) => setWidth(e.target.value)} /></label>
          <label>Height <input type="number" min="100" max="4000" value={height} onChange={(e) => setHeight(e.target.value)} /></label>
          <button onClick={renderImage} disabled={loading}>
            {loading ? "Rendering..." : "Render & Download ↓"}
          </button>
        </div>

        {error && <div className="error">{error}</div>}
      </section>

      <footer>
        <span>Built by <b>ManjiDevs</b></span>
        <a href="https://github.com/ManjiDevs/HTML-TO-IMAGE-API" target="_blank" rel="noreferrer">Star on GitHub ★</a>
      </footer>

      <style jsx>{`
        * { box-sizing: border-box; }
        .page { min-height: 100vh; background:#08090d; color:#f4f4f5; font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; padding:0 5vw; background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px); background-size:60px 60px; }
        .nav { height:78px; max-width:1250px; margin:auto; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #202127; }
        a { color:inherit; text-decoration:none; }
        .brand { font-size:14px; font-weight:800; letter-spacing:2px; }
        .github { font-size:13px; color:#aaa; }
        .hero { max-width:1250px; margin:0 auto; padding:90px 0 60px; }
        .badge { display:inline-block; border:1px solid #303138; border-radius:999px; padding:8px 13px; font-size:11px; letter-spacing:1.5px; color:#aaa; margin-bottom:24px; }
        h1 { font-size:clamp(58px,9vw,110px); line-height:.9; letter-spacing:-6px; margin:0; font-weight:850; }
        h1 span { color:#777; }
        .hero p { max-width:560px; margin:28px 0 0; color:#8e8e96; font-size:17px; line-height:1.6; }
        .workspace { max-width:1250px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .panel { background:#0d0e13; border:1px solid #24252c; border-radius:16px; overflow:hidden; }
        .panel-head { height:48px; padding:0 17px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #24252c; color:#a4a4ad; font-size:11px; font-weight:700; letter-spacing:2px; }
        .dot { width:7px; height:7px; border-radius:50%; background:#666; }
        textarea { display:block; width:100%; height:330px; resize:vertical; border:0; outline:0; padding:20px; background:transparent; color:#e5e5e7; font:13px/1.65 "SFMono-Regular",Consolas,"Liberation Mono",monospace; }
        .controls { grid-column:1/-1; display:flex; align-items:center; gap:10px; margin-top:2px; }
        label { display:flex; align-items:center; gap:8px; border:1px solid #292a31; background:#0d0e13; border-radius:10px; padding:8px 10px 8px 13px; color:#888; font-size:12px; }
        input { width:82px; background:transparent; color:#eee; border:0; outline:0; font:inherit; }
        button { margin-left:auto; border:0; border-radius:10px; padding:13px 20px; background:#f4f4f5; color:#090a0d; font-weight:800; cursor:pointer; }
        button:hover { background:#fff; }
        button:disabled { opacity:.55; cursor:wait; }
        .error { grid-column:1/-1; border:1px solid #572b2b; background:#211113; color:#ff9d9d; border-radius:10px; padding:12px 14px; font-size:13px; }
        footer { max-width:1250px; margin:70px auto 0; padding:25px 0 35px; border-top:1px solid #202127; display:flex; justify-content:space-between; color:#666; font-size:12px; }
        footer a { color:#aaa; }
        @media (max-width:800px) { .workspace { grid-template-columns:1fr; } .controls { grid-column:auto; flex-wrap:wrap; } button { width:100%; margin-left:0; } .hero { padding-top:65px; } h1 { letter-spacing:-4px; } textarea { height:280px; } }
      `}</style>
    </main>
  );
}
