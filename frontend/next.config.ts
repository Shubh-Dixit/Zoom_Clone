import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Reescribir las llamadas a /api/* al backend FastAPI solo en desarrollo.
  // En producción (Vercel) el frontend llama directamente al backend via env var.
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Solo aplicar rewrites cuando el backend es localhost (desarrollo)
    if (backendUrl.includes('localhost')) {
      return [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
      ];
    }

    return [];
  },
};

export default nextConfig;
