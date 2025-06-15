"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { AnimatePresence } from "framer-motion"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  fill?: boolean
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

// Fonction pour générer un placeholder blur optimisé
const generateBlurDataURL = (width = 10, height = 10): string => {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")

  if (ctx) {
    // Créer un gradient simple comme placeholder
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "#f3f4f6")
    gradient.addColorStop(1, "#e5e7eb")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  return canvas.toDataURL()
}

// Hook pour la détection de la taille d'écran
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop")

  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 768) {
        setScreenSize("mobile")
      } else if (window.innerWidth < 1024) {
        setScreenSize("tablet")
      } else {
        setScreenSize("desktop")
      }
    }

    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [])

  return screenSize
}

// Hook pour l'intersection observer (lazy loading)
const useIntersectionObserver = (threshold = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isIntersecting }
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  placeholder = "blur",
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)

  const screenSize = useScreenSize()
  const { ref, isIntersecting } = useIntersectionObserver()

  // Générer des tailles d'image optimisées selon l'écran
  const getOptimizedSrc = (originalSrc: string, screenSize: string): string => {
    if (originalSrc.includes("placeholder.svg")) {
      // Pour les placeholders, ajuster la taille selon l'écran
      const baseUrl = originalSrc.split("?")[0]
      const params = new URLSearchParams(originalSrc.split("?")[1] || "")

      let newWidth = Number.parseInt(params.get("width") || "400")
      let newHeight = Number.parseInt(params.get("height") || "300")

      switch (screenSize) {
        case "mobile":
          newWidth = Math.min(newWidth, 400)
          newHeight = Math.min(newHeight, 300)
          break
        case "tablet":
          newWidth = Math.min(newWidth, 600)
          newHeight = Math.min(newHeight, 450)
          break
        default:
          // Desktop - taille originale
          break
      }

      return `${baseUrl}?height=${newHeight}&width=${newWidth}`
    }

    // Pour les vraies images, vous pourriez implémenter une logique de redimensionnement côté serveur
    // Exemple : return `${originalSrc}?w=${width}&h=${height}&q=${quality}`
    // Strip query parameters for internal images to ensure next/image handles them correctly
    if (originalSrc.startsWith("/")) {
      return originalSrc.split("?")[0];
    }
    return originalSrc
  }

  // Générer le blurDataURL si non fourni
  const defaultBlurDataURL = blurDataURL || generateBlurDataURL()

  // Générer les sizes responsives si non fournies
  const responsiveSizes = sizes || "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"

  // Ajuster la qualité selon l'écran
  const adaptiveQuality = screenSize === "mobile" ? Math.max(quality - 15, 50) : quality

  useEffect(() => {
    if (isIntersecting || priority) {
      setImageSrc(getOptimizedSrc(src, screenSize))
    }
  }, [src, screenSize, isIntersecting, priority])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Composant de fallback en cas d'erreur
  const ErrorFallback = () => (
    <div className={`bg-muted flex items-center justify-center ${className}`}>
      <div className="text-center p-4">
        <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-xs text-muted-foreground">Image non disponible</p>
      </div>
    </div>
  )

  // Composant de loading
  const LoadingPlaceholder = () => (
    <div className={`bg-muted flex items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <Loader2 className="w-8 h-8 text-muted-foreground" />
      </motion.div>
    </div>
  )

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {hasError ? (
        <ErrorFallback />
      ) : !isIntersecting && !priority ? (
        <div className={`bg-muted animate-pulse ${className}`} />
      ) : (
        <>
          {/* Loading overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="absolute inset-0 z-10 bg-muted flex items-center justify-center"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Loader2 className="w-6 h-6 text-muted-foreground" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image optimisée */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoading ? 0 : 1 }} transition={{ duration: 0.3 }}>
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={alt}
              width={width}
              height={height}
              fill={fill}
              quality={adaptiveQuality}
              sizes={responsiveSizes}
              priority={priority}
              placeholder={placeholder}
              blurDataURL={defaultBlurDataURL}
              className={className}
              onLoad={handleLoad}
              onError={handleError}
            />
          </motion.div>
        </>
      )}
    </div>
  )
}
