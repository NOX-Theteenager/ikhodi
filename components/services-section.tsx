"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, LineChart, Globe } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import ParallaxSection from "./parallax-section"

const services = [
  {
    icon: <Palette className="h-8 w-8 md:h-10 md:w-10 text-rose-vif" />,
    title: "Design Graphique",
    description:
      "Création d'identités visuelles, logos, chartes graphiques et supports de communication qui reflètent l'essence de votre marque.",
  },
  {
    icon: <LineChart className="h-8 w-8 md:h-10 md:w-10 text-violet-mauve" />,
    title: "Marketing Digital",
    description:
      "Stratégies marketing personnalisées, gestion des réseaux sociaux, SEO et campagnes publicitaires pour accroître votre visibilité.",
  },
  {
    icon: <Globe className="h-8 w-8 md:h-10 md:w-10 text-rouge-framboise" />,
    title: "Création de Sites Web",
    description:
      "Conception et développement de sites web responsifs, intuitifs et optimisés pour convertir vos visiteurs en clients.",
  },
]

// Variants d'animation optimisées
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="services" className="py-8 md:py-12 lg:py-20 relative overflow-hidden" ref={ref}>
      {/* Parallax background optimisé */}
      <div className="absolute inset-0 overflow-hidden">
        <ParallaxSection baseVelocity={0.1} direction="right">
          <div className="absolute top-1/4 left-0 w-32 h-32 md:w-48 md:h-48 rounded-full bg-rose-vif/4 blur-xl float-subtle"></div>
        </ParallaxSection>
        <ParallaxSection baseVelocity={0.08} direction="left">
          <div
            className="absolute bottom-1/4 right-0 w-40 h-40 md:w-60 md:h-60 rounded-full bg-violet-mauve/4 blur-xl float-subtle"
            style={{ animationDelay: "3s" }}
          ></div>
        </ParallaxSection>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="space-y-2">
            <motion.div
              className="inline-block rounded-lg bg-gradient-to-r from-rose-vif to-violet-mauve px-3 py-1 text-sm text-white shimmer"
              variants={itemVariants}
            >
              Nos Services
            </motion.div>
            <motion.h2
              className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl"
              variants={itemVariants}
            >
              Solutions créatives pour votre succès
            </motion.h2>
            <motion.p
              className="max-w-[700px] text-muted-foreground text-base md:text-lg lg:text-xl"
              variants={itemVariants}
            >
              Nous proposons une gamme complète de services pour répondre à tous vos besoins digitaux.
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:gap-6 py-8 md:py-12 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 400, damping: 17 },
              }}
              className="h-full"
            >
              <Card className="h-full card-depth smooth-transition border-rose-pale/50 hover:border-rose-vif/30 focus-ring">
                <CardHeader className="pb-4">
                  <motion.div
                    className="mb-3 p-2 md:p-3 rounded-full bg-gradient-to-br from-rose-pale/50 to-violet-mauve/10 w-fit"
                    whileHover={{
                      rotate: [0, -5, 5, -5, 0],
                      scale: 1.05,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {service.icon}
                  </motion.div>
                  <CardTitle className="text-lg md:text-xl text-violet-fonce dark:text-rose-pale">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm md:text-base">{service.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}