"use client"

import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import CSS3DLogo from "./css-3d-logo"
import ParallaxSection from "./parallax-section"

export default function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 300])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative overflow-hidden py-12 md:py-20 lg:py-32">
      {/* Parallax background elements - optimisés pour mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <ParallaxSection baseVelocity={0.1} direction="up">
          <div className="absolute top-20 left-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-rose-vif/10 blur-xl"></div>
        </ParallaxSection>
        <ParallaxSection baseVelocity={0.15} direction="down">
          <div className="absolute top-40 right-20 w-20 h-20 md:w-32 md:h-32 rounded-full bg-violet-mauve/10 blur-xl"></div>
        </ParallaxSection>
        <ParallaxSection baseVelocity={0.2} direction="left">
          <div className="absolute bottom-20 left-1/3 w-24 h-24 md:w-40 md:h-40 rounded-full bg-rose-pale/20 blur-xl"></div>
        </ParallaxSection>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ y, opacity }}
          >
            <div className="space-y-2">
              <motion.h1
                className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl bg-gradient-to-r from-rose-vif to-violet-mauve bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Transformez votre vision en réalité digitale
              </motion.h1>
              <motion.p
                className="max-w-[600px] text-muted-foreground text-base md:text-lg lg:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Nous créons des expériences digitales uniques qui captivent votre audience et propulsent votre marque
                vers de nouveaux sommets.
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-3 min-[400px]:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="w-full min-[400px]:w-auto px-6 md:px-8 bg-rose-vif hover:bg-rouge-framboise ripple"
                  onClick={() => window.scrollTo({ top: document.getElementById("services")?.offsetTop, behavior: "smooth" })}
                >
                  Nos services
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full min-[400px]:w-auto px-6 md:px-8 border-violet-mauve text-violet-mauve hover:bg-violet-mauve hover:text-white ripple"
                  onClick={() => window.scrollTo({ top: document.getElementById("contact")?.offsetTop, behavior: "smooth" })}
                >
                  Contactez-nous
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex items-center justify-center mt-8 lg:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative h-[250px] w-full md:h-[350px] lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-vif/20 via-violet-mauve/20 to-violet-fonce/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <motion.div
                  className="text-center p-4 md:p-6 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <CSS3DLogo />
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-violet-fonce dark:text-rose-pale mt-4">
                    Design • Marketing • Web
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Votre partenaire pour une présence digitale d'exception
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
