const nextConfig = {
  // Configuration de sécurité optimisée
  async headers() {
    return [
      {
        // N'appliquer les headers de sécurité qu'aux routes nécessaires
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Optimisation: HSTS avec une durée plus courte pour faciliter les tests
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // CSP optimisé avec des directives plus précises
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "frame-ancestors 'none'",
              // Ajout de la directive pour optimiser les performances
              "prefetch-src 'self'",
              // Permettre les workers pour améliorer les performances
              "worker-src 'self' blob:",
            ].join("; "),
          },
          // Ajout de Feature-Policy pour limiter les API du navigateur
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ]
  },
  // Optimisations de performance
  experimental: {
    optimizeCss: true,
  },
  // Configuration des images
  images: {
    domains: ["blob.v0.dev"],
    formats: ["image/webp", "image/avif"],
  },
  // Compression
  compress: true,
  // Variables d'environnement publiques
  env: {
    SITE_URL: process.env.SITE_URL || "http://localhost:3000",
  },
  // Optimisation de la compilation
  swcMinify: true, // Utiliser SWC pour la minification
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimisation du cache
  onDemandEntries: {
    // période (en ms) où les pages compilées restent en mémoire
    maxInactiveAge: 60 * 1000,
    // nombre de pages à garder en mémoire
    pagesBufferLength: 5,
  },
}

module.exports = nextConfig
