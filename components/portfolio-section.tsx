"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, ExternalLink, Eye, Loader2, AlertTriangle } from "lucide-react" // Added Loader2 and AlertTriangle
import OptimizedImage from "./optimized-image"
import ImageGallery from "./image-gallery"
import { preloadImages } from "@/lib/image-utils"

const categories = ["Tous", "Design", "Marketing", "Web"]

// Define a type for our project structure for better type safety
interface Project {
  id: number | string;
  title: string;
  category: string;
  image: string;
  images?: string[];
  description: string;
  client?: string;
  year?: string;
  services?: string[];
  externalLink?: string;
}

const ProjectModal = ({ project, isOpen, onClose }: { project: Project | null; isOpen: boolean; onClose: () => void }) => {
  const handleContactClick = () => {
    const element = document.querySelector("#contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    onClose()
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
                  <ImageGallery
                    images={project.images}
                    alt={project.title}
                    className="w-full h-full max-h-[600px]"
                    showThumbnails={true}
                    allowZoom={true}
                    allowDownload={false}
                  />
                ) : (
                  <OptimizedImage
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-contain p-4"
                    quality={85}
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
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
                    {project.client && project.year && (
                       <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Client: {project.client}</span>
                        <span>•</span>
                        <span>{project.year}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-violet-fonce dark:text-rose-pale">Description</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{project.description}</p>
                  </div>
                  {project.services && project.services.length > 0 && (
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
                  )}
                  <div className="pt-4 space-y-4">
                    {project.externalLink && (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <a
                          href={project.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center bg-rose-vif hover:bg-rouge-framboise smooth-transition text-sm md:text-base py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-vif"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Voir le projet complet
                        </a>
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
  const [portfolioProjects, setPortfolioProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("Tous");
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          console.error("Fetched data is not an array:", data);
          throw new Error("Format de données invalide reçu du serveur.");
        }
        setPortfolioProjects(data);
      } catch (e: any) {
        console.error("Failed to fetch projects:", e);
        setError(e.message || "Erreur lors du chargement des projets.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects =
    activeTab === "Tous" ? portfolioProjects : portfolioProjects.filter((project) => project.category === activeTab);

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6);
  const hasMoreProjects = filteredProjects.length > 6;

  useEffect(() => {
    if (displayedProjects.length > 0) {
      const imagesToPreload = displayedProjects.map((project) => project.image);
      preloadImages(imagesToPreload, 3);
    }
  }, [displayedProjects]);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    if (project.images && project.images.length > 0) {
      preloadImages(project.images, 2);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

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
              {isLoading && (
                <div className="flex flex-col items-center justify-center space-y-2 py-10">
                  <Loader2 className="h-12 w-12 animate-spin text-rose-vif" />
                  <p className="text-muted-foreground">Chargement des projets...</p>
                </div>
              )}
              {error && !isLoading && (
                <div className="flex flex-col items-center justify-center space-y-2 py-10 text-center">
                  <AlertTriangle className="h-12 w-12 text-red-500" />
                  <p className="text-red-500 font-semibold">Erreur de chargement</p>
                  <p className="text-muted-foreground max-w-md">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                    Réessayer
                  </Button>
                </div>
              )}
              {!isLoading && !error && portfolioProjects.length === 0 && (
                 <div className="flex flex-col items-center justify-center space-y-2 py-10 text-center">
                    <Eye className="h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground font-semibold">Aucun projet trouvé</p>
                    <p className="text-muted-foreground max-w-md">Il semble qu'il n'y ait aucun projet à afficher pour le moment.</p>
                 </div>
              )}
              {!isLoading && !error && portfolioProjects.length > 0 && (
                <>
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
                            <OptimizedImage
                              src={project.image || "/placeholder.svg"}
                              alt={project.title}
                              width={400}
                              height={300}
                              className="h-64 w-full object-cover smooth-transition group-hover:scale-105"
                              quality={75}
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              priority={index < 3}
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
                          {showAll ? "Voir moins" : `Voir plus (${filteredProjects.length - displayedProjects.length} projets)`}
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  )
}