"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, ZoomIn, Download } from "lucide-react"
import OptimizedImage from "./optimized-image"

interface ImageGalleryProps {
  images: string[]
  alt: string
  className?: string
  showThumbnails?: boolean
  allowZoom?: boolean
  allowDownload?: boolean
}

export default function ImageGallery({
  images,
  alt,
  className = "",
  showThumbnails = true,
  allowZoom = true,
  allowDownload = false,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  // Précharger les images adjacentes
  const preloadAdjacentImages = useCallback(
    (index: number) => {
      const indicesToPreload = [
        index - 1 >= 0 ? index - 1 : images.length - 1,
        index + 1 < images.length ? index + 1 : 0,
      ]

      indicesToPreload.forEach((i) => {
        if (!loadedImages.has(i)) {
          const img = new Image()
          img.src = images[i]
          img.onload = () => {
            setLoadedImages((prev) => new Set(prev).add(i))
          }
        }
      })
    },
    [images, loadedImages],
  )

  const nextImage = useCallback(() => {
    const newIndex = (currentIndex + 1) % images.length
    setCurrentIndex(newIndex)
    preloadAdjacentImages(newIndex)
  }, [currentIndex, images.length, preloadAdjacentImages])

  const prevImage = useCallback(() => {
    const newIndex = (currentIndex - 1 + images.length) % images.length
    setCurrentIndex(newIndex)
    preloadAdjacentImages(newIndex)
  }, [currentIndex, images.length, preloadAdjacentImages])

  const goToImage = useCallback(
    (index: number) => {
      setCurrentIndex(index)
      preloadAdjacentImages(index)
    },
    [preloadAdjacentImages],
  )

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  const downloadImage = () => {
    const link = document.createElement("a")
    link.href = images[currentIndex]
    link.download = `image-${currentIndex + 1}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Gestion des touches clavier
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          prevImage()
          break
        case "ArrowRight":
          nextImage()
          break
        case "Escape":
          setIsZoomed(false)
          break
      }
    },
    [nextImage, prevImage],
  )

  // Ajouter les event listeners pour le clavier
  useState(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  })

  if (!images || images.length === 0) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center p-8 ${className}`}>
        <p className="text-muted-foreground">Aucune image disponible</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Image principale */}
      <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full"
          >
            <OptimizedImage
              src={images[currentIndex]}
              alt={`${alt} - Image ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority={currentIndex === 0}
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Contrôles de navigation */}
        {images.length > 1 && (
          <>
            <motion.button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full smooth-transition focus-ring"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full smooth-transition focus-ring"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Image suivante"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </>
        )}

        {/* Contrôles d'action */}
        <div className="absolute top-2 right-2 flex gap-2">
          {allowZoom && (
            <motion.button
              onClick={toggleZoom}
              className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full smooth-transition focus-ring"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Zoomer"
            >
              <ZoomIn className="h-4 w-4" />
            </motion.button>
          )}
          {allowDownload && (
            <motion.button
              onClick={downloadImage}
              className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full smooth-transition focus-ring"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Télécharger"
            >
              <Download className="h-4 w-4" />
            </motion.button>
          )}
        </div>

        {/* Indicateur de progression */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 smooth-transition focus-ring ${
                index === currentIndex ? "border-rose-vif shadow-lg" : "border-transparent hover:border-rose-vif/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <OptimizedImage
                src={image}
                alt={`${alt} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                quality={60}
                sizes="64px"
              />
              {index === currentIndex && <div className="absolute inset-0 bg-rose-vif/20" />}
            </motion.button>
          ))}
        </div>
      )}

      {/* Modal de zoom */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleZoom}
          >
            <motion.button
              onClick={toggleZoom}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full smooth-transition focus-ring"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-6 w-6" />
            </motion.button>
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={images[currentIndex]}
                alt={`${alt} - Image ${currentIndex + 1} (zoom)`}
                width={1200}
                height={900}
                className="object-contain max-w-full max-h-full"
                quality={95}
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
