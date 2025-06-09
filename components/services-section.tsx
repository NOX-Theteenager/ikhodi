"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, LineChart, Globe } from "lucide-react"
import { motion } from "framer-motion"
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

export default function ServicesSection() {
  return (
    <section id="services" className="py-8 md:py-12 lg:py-20 relative overflow-hidden">
      {/* Parallax background elements - réduits sur mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <ParallaxSection baseVelocity={0.15} direction="right">
          <div className="absolute top-1/4 left-0 w-32 h-32 md:w-64 md:h-64 rounded-full bg-rose-vif/5 blur-xl"></div>
        </ParallaxSection>
        <ParallaxSection baseVelocity={0.1} direction="left">
          <div className="absolute bottom-1/4 right-0 w-40 h-40 md:w-80 md:h-80 rounded-full bg-violet-mauve/5 blur-xl"></div>
        </ParallaxSection>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <motion.div
              className="inline-block rounded-lg bg-gradient-to-r from-rose-vif to-violet-mauve px-3 py-1 text-sm text-white"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Nos Services
            </motion.div>
            <motion.h2
              className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Solutions créatives pour votre succès
            </motion.h2>
            <motion.p
              className="max-w-[700px] text-muted-foreground text-base md:text-lg lg:text-xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Nous proposons une gamme complète de services pour répondre à tous vos besoins digitaux.
            </motion.p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:gap-6 py-8 md:py-12 md:grid-cols-3">
          {services.map((service, index) => (
            <ParallaxSection key={index} baseVelocity={0.05} direction={index % 2 === 0 ? "up" : "down"}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-rose-pale/50 hover:border-rose-vif/30 card-glow">
                  <CardHeader className="pb-4">
                    <motion.div
                      className="mb-3 p-2 md:p-3 rounded-full bg-gradient-to-br from-rose-pale/50 to-violet-mauve/10 w-fit"
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
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
            </ParallaxSection>
          ))}
        </div>
      </div>
    </section>
  )
}
