"use client"

import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import CSS3DLogo from "./css-3d-logo"
import ParallaxSection from "./parallax-section"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    title: "Transformez votre vision en réalité digitale",
    description:
      "Nous créons des expériences digitales uniques qui captivent votre audience et propulsent votre marque vers de nouveaux sommets.",
    highlight: "Design • Marketing • Web",
  },
  {
    id: 2,
    title: "Votre succès digital commence ici",
    description:
      "De la conception graphique au marketing digital, nous accompagnons votre entreprise dans sa transformation numérique avec expertise et créativité.",
    highlight: "Innovation • Créativité • Performance",
  },
  {
    id: 3,
    title: "L'excellence digitale à votre portée",
    description:
      "Nos solutions sur mesure allient design moderne, stratégie marketing efficace et développement web de pointe pour maximiser votre impact en ligne.",
    highlight: "Stratégie • Design • Développement",
  },
  {
    id: 4,
    title: "Créons ensemble votre identité digitale",
    description:
      "Faites confiance à notre équipe d'experts pour développer une présence en ligne qui reflète parfaitement vos valeurs et attire vos clients idéaux.",
    highlight: "Branding • UX/UI • Marketing",
  },
]

// Variants d'animation optimisées
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 30 : -30,
    opacity: 0,
  }),
}

export default function HeroSection() {
  const ref = useRef(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Auto-play optimisé
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setDirection(1)
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section ref={ref} className="relative overflow-hidden py-12 md:py-20 lg:py-32">
      {/* Parallax background optimisé */}
      <div className="absolute inset-0 overflow-hidden">
        <ParallaxSection baseVelocity={0.08} direction="up">
          <div className="absolute top-20 left-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-rose-vif/8 blur-xl float-subtle"></div>
        </ParallaxSection>
        <ParallaxSection baseVelocity={0.12} direction="down">
          <div
            className="absolute top-40 right-20 w-20 h-20 md:w-32 md:h-32 rounded-full bg-violet-mauve/8 blur-xl float-subtle"
            style={{ animationDelay: "2s" }}
          ></div>
        </ParallaxSection>
        <ParallaxSection baseVelocity={0.15} direction="left">
          <div
            className="absolute bottom-20 left-1/3 w-24 h-24 md:w-40 md:h-40 rounded-full bg-rose-pale/15 blur-xl float-subtle"
            style={{ animationDelay: "4s" }}
          ></div>
        </ParallaxSection>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ y, opacity }}
          >
            <div className="space-y-2 relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                  }}
                  className="space-y-4"
                >
                  <motion.h1
                    className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl bg-gradient-to-r from-rose-vif to-violet-mauve bg-clip-text text-transparent"
                    variants={itemVariants}
                  >
                    {slides[currentSlide].title}
                  </motion.h1>
                  <motion.p
                    className="max-w-[600px] text-muted-foreground text-base md:text-lg lg:text-xl"
                    variants={itemVariants}
                  >
                    {slides[currentSlide].description}
                  </motion.p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation optimisée */}
              <motion.div className="flex items-center justify-between mt-6" variants={itemVariants}>
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-rose-vif/10 hover:bg-rose-vif/20 smooth-transition focus-ring"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <ChevronLeft className="h-4 w-4 text-rose-vif" />
                  </motion.button>
                  <motion.button
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-rose-vif/10 hover:bg-rose-vif/20 smooth-transition focus-ring"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <ChevronRight className="h-4 w-4 text-rose-vif" />
                  </motion.button>
                </div>

                {/* Indicateurs optimisés */}
                <div className="flex gap-2">
                  {slides.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full smooth-transition focus-ring ${
                        index === currentSlide ? "bg-rose-vif w-6" : "bg-rose-vif/30 hover:bg-rose-vif/50 w-2"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Barre de progression optimisée */}
              <motion.div
                className="w-full bg-rose-vif/10 rounded-full h-1 mt-4 overflow-hidden"
                variants={itemVariants}
              >
                <motion.div
                  className="bg-gradient-to-r from-rose-vif to-violet-mauve h-1 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: isAutoPlaying
                      ? "100%"
                      : `${((currentSlide + 1) / slides.length) * 100}%`,
                  }}
                  transition={{
                    duration: isAutoPlaying ? 6 : 0.3,
                    ease: isAutoPlaying ? "linear" : [0.16, 1, 0.3, 1],
                  }}
                />
              </motion.div>
            </div>

            <motion.div className="flex flex-col gap-3 min-[400px]:flex-row" variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  className="w-full min-[400px]:w-auto px-6 md:px-8 bg-rose-vif hover:bg-rouge-framboise smooth-transition shimmer focus-ring"
                  onClick={() => {
                    const element = document.querySelector("#services")
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  Nos services
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full min-[400px]:w-auto px-6 md:px-8 border-violet-mauve text-violet-mauve hover:bg-violet-mauve hover:text-white smooth-transition focus-ring"
                  onClick={() => {
                    const element = document.querySelector("#contact")
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  Contactez-nous
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center mt-8 lg:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="relative h-[250px] w-full md:h-[350px] lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-vif/15 via-violet-mauve/15 to-violet-fonce/15 rounded-lg flex items-center justify-center backdrop-blur-sm card-depth">
                <motion.div
                  className="text-center p-4 md:p-6 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <CSS3DLogo />
                  <AnimatePresence mode="wait">
                    <motion.h3
                      key={currentSlide}
                      className="text-lg md:text-xl font-bold mb-2 text-violet-fonce dark:text-rose-pale mt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {slides[currentSlide].highlight}
                    </motion.h3>
                  </AnimatePresence>
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