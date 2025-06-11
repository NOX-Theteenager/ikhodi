"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, ExternalLink, Eye } from "lucide-react"
import Image from "next/image"

const categories = ["Tous", "Design", "Marketing", "Web"]

const projects = [
  {
    id: 1,
    title: "Refonte de marque complète",
    category: "Design",
    image: "/placeholder.svg?height=300&width=400",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description:
      "Création d'une identité visuelle moderne et impactante pour une startup technologique. Le projet comprenait la conception du logo, de la charte graphique, des supports de communication et de l'ensemble des éléments visuels de la marque.",
    client: "TechStart Inc.",
    year: "2024",
    services: ["Logo Design", "Charte Graphique", "Supports Print", "Guidelines"],
  },
  {
    id: 2,
    title: "Campagne digitale multi-canal",
    category: "Marketing",
    image: "/placeholder.svg?height=300&width=400",
    description:
      "Stratégie marketing complète incluant SEO, réseaux sociaux et publicité payante pour augmenter la visibilité en ligne.",
    client: "Fashion Brand",
    year: "2024",
    services: ["SEO", "Social Media", "Google Ads", "Analytics"],
  },
  {
    id: 3,
    title: "Site e-commerce moderne",
    category: "Web",
    image: "/placeholder.svg?height=300&width=400",
    description:
      "Développement d'une plateforme e-commerce responsive avec système de paiement intégré et interface d'administration.",
    client: "Boutique Online",
    year: "2024",
    services: ["Développement", "UX/UI", "E-commerce", "Responsive"],
  },
  {
    id: 4,
    title: "Identité visuelle restaurant",
    category: "Design",
    image: "/placeholder.svg?height=300&width=400",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description:
      "Création d'une identité visuelle chaleureuse et authentique pour un restaurant gastronomique. Le projet incluait le logo, les menus, la signalétique et tous les supports de communication.",
    client: "Le Gourmet",
    year: "2023",
    services: ["Branding", "Menu Design", "Signalétique", "Packaging"],
  },
  {
    id: 5,
    title: "Application mobile innovante",
    category: "Web",
    image: "/placeholder.svg?height=300&width=400",
    description: "Conception et développement d'une application mobile native avec interface utilisateur intuitive.",
    client: "MobileApp Co.",
    year: "2024",
    services: ["Mobile App", "UI/UX", "Native Development", "API"],
  },
  {
    id: 6,
    title: "Stratégie SEO avancée",
    category: "Marketing",
    image: "/placeholder.svg?height=300&width=400",
    description: "Optimisation complète du référencement naturel avec audit technique et stratégie de contenu.",
    client: "Business Corp",
    year: "2024",
    services: ["SEO Technique", "Content Strategy", "Link Building", "Analytics"],
  },
  {
    id: 7,
    title: "Packaging produit premium",
    category: "Design",
    image: "/placeholder.svg?height=300&width=400",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description:
      "Conception d'un packaging élégant et durable pour une gamme de produits cosmétiques haut de gamme. Focus sur l'expérience utilisateur et l'impact environnemental.",
    client: "Beauty Luxe",
    year: "2023",
    services: ["Packaging Design", "Eco-conception", "Print", "3D Modeling"],
  },
  {
    id: 8,
    title: "Campagne réseaux sociaux",
    category: "Marketing",
    image: "/placeholder.svg?height=300&width=400",
    description: "Gestion complète des réseaux sociaux avec création de contenu et community management.",
    client: "Social Brand",
    year: "2024",
    services: ["Social Media", "Content Creation", "Community Management", "Influencers"],
  },
]

const ProjectModal = ({ project, isOpen, onClose }: { project: any; isOpen: boolean; onClose: () => void }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    if (project.images) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
    }
  }

  const prevImage = () => {
    if (project.images) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
    }
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const handleContactClick = () => {
    const element = document.querySelector("#contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    onClose() // Close the modal after scrolling
  }

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-6xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background smooth-transition focus-ring"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-5 w-5" />
            </motion.button>
            <div className="grid lg:grid-cols-2 h-full">
              <div className="relative bg-muted/30 flex items-center justify-center min-h-[300px] md:min-h-[400px] lg:min-h-[600px]">
                {project.images && project.images.length > 0 ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentImageIndex}
                        className="relative w-full h-full flex items-center justify-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image
                          src={project.images[currentImageIndex] || "/placeholder.svg"}
                          alt={`${project.title} - Image ${currentImageIndex + 1}`}
                          fill
                          className="object-contain p-4"
                        />
                      </motion.div>
                    </AnimatePresence>
                    {project.images.length > 1 && (
                      <>
                        <motion.button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background smooth-transition focus-ring"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background smooth-transition focus-ring"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </motion.button>
                      </>
                    )}
                    {project.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {project.images.map((_: string, index: number) => (
                          <motion.button
                            key={index}
                            onClick={() => goToImage(index)}
                            className={`w-2 h-2 rounded-full smooth-transition ${
                              index === currentImageIndex ? "bg-rose-vif" : "bg-white/50 hover:bg-white/70"
                            }`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-contain p-4"
                  />
                )}
              </div>
              <div className="p-6 lg:p-8 overflow-y-auto">
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div>
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-rose-vif/10 text-rose-vif rounded-full mb-3">
                      {project.category}
                    </span>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-violet-fonce dark:text-rose-pale mb-2">
                      {project.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Client: {project.client}</span>
                      <span>•</span>
                      <span>{project.year}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-violet-fonce dark:text-rose-pale">Description</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{project.description}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-violet-fonce dark:text-rose-pale">Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.services.map((service: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm bg-violet-mauve/10 text-violet-mauve rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 space-y-4">
                    {project.category !== "Design" && (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full bg-rose-vif hover:bg-rouge-framboise smooth-transition text-sm md:text-base py-2">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Voir le projet complet
                        </Button>
                      </motion.div>
                    )}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleContactClick}
                        className="w-full bg-rose-vif text-white hover:bg-rouge-framboise smooth-transition focus-ring text-sm md:text-base py-2"
                      >
                        Nous contacter
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function PortfolioSection() {
  const [activeTab, setActiveTab] = useState("Tous")
  const [showAll, setShowAll] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredProjects =
    activeTab === "Tous" ? projects : projects.filter((project) => project.category === activeTab)

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6)
  const hasMoreProjects = filteredProjects.length > 6

  const openModal = (project: any) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  return (
    <section id="portfolio" className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <motion.div
              className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground shimmer"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Portfolio
            </motion.div>
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Nos réalisations
            </motion.h2>
            <motion.p
              className="max-w-[700px] text-muted-foreground text-sm md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Découvrez nos projets récents et laissez-vous inspirer par notre créativité.
            </motion.p>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <Tabs defaultValue="Tous" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 md:gap-0">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-rose-vif data-[state=active]:text-white smooth-transition text-sm py-2"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={activeTab} className="mt-12">
              <motion.div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence>
                  {displayedProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="group relative overflow-hidden rounded-lg cursor-pointer card-depth"
                      onClick={() => openModal(project)}
                    >
                      <div className="relative">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          width={400}
                          height={300}
                          className="h-64 w-full object-cover smooth-transition group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:opacity-0 md:group-hover:opacity-100 smooth-transition flex items-end p-4 md:p-6">
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="md:group-hover:translate-y-0 md:translate-y-4 md:opacity-0 md:group-hover:opacity-100 smooth-transition"
                          >
                            <h3 className="text-lg md:text-xl font-bold text-white mb-1">{project.title}</h3>
                            <p className="text-xs md:text-sm text-white/80 mb-2">{project.category}</p>
                            <p className="text-xs text-white/70 line-clamp-2">{project.description}</p>
                          </motion.div>
                        </div>
                        <div className="absolute top-4 right-4 p-2 bg-rose-vif/90 backdrop-blur-sm rounded-full">
                          <Eye className="h-4 w-4 text-white" />
                        </div>
                        {project.images && project.images.length > 1 && (
                          <div className="absolute top-4 left-4 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs">
                            {project.images.length} images
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              {hasMoreProjects && (
                <motion.div
                  className="flex justify-center mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setShowAll(!showAll)}
                      variant="outline"
                      className="px-6 md:px-8 py-2 md:py-3 border-rose-vif text-rose-vif hover:bg-rose-vif hover:text-white smooth-transition focus-ring text-sm md:text-base"
                    >
                      {showAll ? "Voir moins" : `Voir plus (${filteredProjects.length - 6} projets)`}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  )
}