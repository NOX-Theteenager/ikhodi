"use client"

import { useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import Image from "next/image"

export default function FloatingLogo() {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: false })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [controls, inView])

  const logoVariants = {
    hidden: { opacity: 0, y: 50, rotateY: 0 },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: [0, 10, -10, 10, 0],
      transition: {
        duration: 1,
        rotateY: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 6,
          ease: "easeInOut",
        },
      },
    },
  }

  const shadowVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 0.3,
      scale: [1, 1.1, 1],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 3,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div ref={ref} className="relative w-40 h-20 mx-auto my-8 perspective-1000">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-yellow-500/30 rounded-full blur-xl"
        variants={shadowVariants}
        initial="hidden"
        animate={controls}
      />
      <motion.div
        className="relative w-full h-full preserve-3d"
        variants={logoVariants}
        initial="hidden"
        animate={controls}
      >
        <Image
          src="/images/logo.png"
          alt="Jutu Logo"
          fill
          className="object-contain drop-shadow-[0_0_10px_rgba(0,195,255,0.6)]"
        />
      </motion.div>
    </div>
  )
}
