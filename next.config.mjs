/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Warmail-style slug → our existing privacy page (keeps inbound links working).
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
    ];
  },
};

export default nextConfig;
