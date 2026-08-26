/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false, // don't advertise "X-Powered-By: Next.js" to every request
  webpack: (config) => {
    // pdfjs-dist's build references the Node `canvas` package as an optional
    // fallback for server-side rendering. We only ever run pdf.js in the
    // browser, so it's never needed — stub it out to keep webpack happy.
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
