/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@mtosity/design-system",
    "@mtosity/lib",
    "@mtosity/whisper",
    "@mtosity/tool-speech-to-text",
    "@mtosity/tool-img-grid",
    "@mtosity/tool-instagram",
    "@mtosity/admin",
  ],
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node", "sharp"],
  // Globs relative to the app dir plus monorepo-root-relative fallbacks —
  // the tracing root moved to the workspace root when this became a monorepo.
  outputFileTracingIncludes: {
    "/api/instagram/info": ["./bin/yt-dlp-linux-*", "apps/web/bin/yt-dlp-linux-*"],
    "/api/instagram/audio": ["./bin/yt-dlp-linux-*", "apps/web/bin/yt-dlp-linux-*"],
    "/api/instagram/download": ["./bin/yt-dlp-linux-*", "apps/web/bin/yt-dlp-linux-*"],
  },
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@huggingface/**",
      "node_modules/onnxruntime-node/**",
      "node_modules/onnxruntime-web/**",
      "node_modules/onnxruntime-common/**",
      "node_modules/sharp/**",
      "node_modules/@img/**",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "j1upd1ez6gz24psx.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
