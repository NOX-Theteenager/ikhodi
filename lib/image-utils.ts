"use client"

import { useEffect } from "react"

import { useState } from "react"

/**
 * Utilitaires pour l'optimisation des images
 */

// Types pour les configurations d'images
export interface ImageConfig {
  quality: number
  format: "webp" | "jpeg" | "png"
  sizes: string[]
  placeholder: boolean
}

// Configurations prédéfinies selon le type d'usage
export const imageConfigs: Record<string, ImageConfig> = {
  thumbnail: {
    quality: 60,
    format: "webp",
    sizes: ["64px", "128px"],
    placeholder: true,
  },
  gallery: {
    quality: 80,
    format: "webp",
    sizes: ["400px", "800px", "1200px"],
    placeholder: true,
  },
  hero: {
    quality: 85,
    format: "webp",
    sizes: ["100vw"],
    placeholder: true,
  },
  portfolio: {
    quality: 75,
    format: "webp",
    sizes: ["(max-width: 768px) 100vw", "(max-width: 1024px) 50vw", "33vw"],
    placeholder: true,
  },
}

// Fonction pour générer des URLs d'images optimisées
export const getOptimizedImageUrl = (
  src: string,
  width?: number,
  height?: number,
  quality?: number,
  format?: string,
): string => {
  // Pour les placeholders, ajuster les paramètres
  if (src.includes("placeholder.svg")) {
    const url = new URL(src, window.location.origin)
    if (width) url.searchParams.set("width", width.toString())
    if (height) url.searchParams.set("height", height.toString())
    return url.toString()
  }

  // Pour les vraies images, vous pourriez implémenter une logique de CDN
  // Exemple avec un service d'optimisation d'images :
  // return `https://your-cdn.com/optimize?src=${encodeURIComponent(src)}&w=${width}&h=${height}&q=${quality}&f=${format}`

  return src
}

// Fonction pour calculer les tailles responsives
export const generateResponsiveSizes = (breakpoints: Record<string, string>): string => {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `${breakpoint} ${size}`)
    .join(", ")
}

// Fonction pour précharger les images critiques
export const preloadImage = (src: string, priority = false): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject

    if (priority) {
      img.fetchPriority = "high"
    }

    img.src = src
  })
}

// Fonction pour précharger plusieurs images
export const preloadImages = async (urls: string[], maxConcurrent = 3): Promise<void> => {
  const chunks = []
  for (let i = 0; i < urls.length; i += maxConcurrent) {
    chunks.push(urls.slice(i, i + maxConcurrent))
  }

  for (const chunk of chunks) {
    await Promise.allSettled(chunk.map((url) => preloadImage(url)))
  }
}

// Fonction pour détecter le support WebP
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA"
  })
}

// Fonction pour compresser les images côté client (si nécessaire)
export const compressImage = (file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    const img = new Image()

    img.onload = () => {
      // Calculer les nouvelles dimensions
      let { width, height } = img

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      // Dessiner l'image redimensionnée
      ctx.drawImage(img, 0, 0, width, height)

      // Convertir en blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        }
        // Optionally, you can reject or handle the null case here if needed
      }, "image/jpeg", quality)
    }

    img.src = URL.createObjectURL(file)
  })
}

// Hook pour surveiller la bande passante
export const useNetworkStatus = () => {
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  useEffect(() => {
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    if (connection) {
      const updateConnectionStatus = () => {
        // Considérer comme lente si < 1 Mbps
        setIsSlowConnection(connection.downlink < 1)
      }

      updateConnectionStatus()
      connection.addEventListener("change", updateConnectionStatus)

      return () => {
        connection.removeEventListener("change", updateConnectionStatus)
      }
    }
  }, [])

  return { isSlowConnection }
}

// Fonction pour adapter la qualité selon la connexion
export const getAdaptiveQuality = (baseQuality: number, isSlowConnection: boolean): number => {
  return isSlowConnection ? Math.max(baseQuality - 20, 40) : baseQuality
}
