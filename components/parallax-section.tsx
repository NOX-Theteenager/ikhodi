"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxSectionProps {
  children: React.ReactNode
  baseVelocity?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
}

export default function ParallaxSection({
  children,
  baseVelocity = 0.2,
  direction = "up",
  className = "",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const isHorizontal = direction === "left" || direction === "right"
  const factor = direction === "up" || direction === "left" ? -1 : 1

  const y = useTransform(scrollYProgress, [0, 1], isHorizontal ? [0, 0] : [0, 100 * baseVelocity * factor])

  const x = useTransform(scrollYProgress, [0, 1], isHorizontal ? [0, 100 * baseVelocity * factor] : [0, 0])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, x }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  )
}
