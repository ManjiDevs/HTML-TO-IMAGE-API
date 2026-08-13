export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#08090d",
      color: "white",
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1>MCQ HTML → Image API</h1>
        <p>Next.js + Puppeteer + Chromium</p>
        <code>POST /api/render</code>
      </div>
    </main>
  );
}
