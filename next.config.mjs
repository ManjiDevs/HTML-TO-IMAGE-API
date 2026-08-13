/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    "@sparticuz/chromium",
    "puppeteer-core"
  ],
  
  outputFileTracingIncludes: {
    "/api/render": [
      "./node_modules/@sparticuz/chromium/bin/**/*"
    ]
  }
};

export default nextConfig;