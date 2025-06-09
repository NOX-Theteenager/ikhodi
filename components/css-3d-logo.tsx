"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import Image from "next/image"

export default function CSS3DLogo() {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-300, 300], [15, -15]))
  const rotateY = useSpring(useTransform(x, [-300, 300], [-15, 15]))

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={ref}
      className="w-full h-[300px] flex items-center justify-center perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-64 h-32 preserve-3d"
        style={{
          rotateX,
          rotateY,
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Logo principal */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/images/logo.png"
              alt="Jutu Logo"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(0,195,255,0.6)]"
            />
          </div>
        </motion.div>

        {/* Ombre/reflet */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{
            rotateY: 180,
            transform: "translateZ(-10px)",
          }}
        >
          <div className="relative w-full h-full opacity-30 blur-sm">
            <Image src="/images/logo.png" alt="Jutu Logo Reflection" fill className="object-contain" />
          </div>
        </motion.div>

        {/* Effets de lumière */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-yellow-500/20 rounded-lg"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  )
}
