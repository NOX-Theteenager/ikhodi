"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import ParallaxSection from "./parallax-section"
import FloatingLogo from "./floating-logo"

export default function AboutSection() {
  const advantages = [
    "Expertise en design et développement",
    "Approche centrée sur les résultats",
    "Solutions personnalisées",
    "Support continu",
  ]

  return (
    <section
      id="about"
      className="py-12 md:py-20 bg-gradient-to-r from-rose-pale/30 to-violet-mauve/10 relative overflow-hidden"
    >
      {/* Parallax background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <ParallaxSection baseVelocity={0.2} direction="up">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-rose-vif/5 blur-xl"></div>
        </ParallaxSection>
        <ParallaxSection baseVelocity={0.15} direction="down">
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-violet-mauve/5 blur-xl"></div>
        </ParallaxSection>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gradient-to-r from-violet-mauve to-violet-fonce px-3 py-1 text-sm text-white">
                À propos
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Qui sommes-nous ?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                ikhodi est une agence créative passionnée par l'innovation et l'excellence. Nous combinons expertise
                technique et vision artistique pour créer des expériences digitales mémorables.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-violet-fonce dark:text-rose-pale">Pourquoi nous choisir ?</h3>
              <ul className="grid gap-2">
                {advantages.map((advantage, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="h-5 w-5 text-rose-vif" />
                    <span>{advantage}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center justify-center lg:justify-end"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="relative h-[300px] w-full md:h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-vif/20 via-violet-mauve/20 to-violet-fonce/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <div className="text-center p-6">
                  <FloatingLogo />
                  <h3 className="text-xl font-bold mb-2 text-violet-fonce dark:text-rose-pale">Notre équipe</h3>
                  <p className="text-muted-foreground">Des experts passionnés par le digital</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
