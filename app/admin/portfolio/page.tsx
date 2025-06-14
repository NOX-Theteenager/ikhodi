"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Edit3,
  Trash2,
  Plus,
  Calendar,
  User,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Loader2,
  ImageIcon,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import OptimizedImage from "@/components/optimized-image"
import clsx from "clsx"

interface Project {
  id: number
  title: string
  category: string
  description: string
  client?: string
  year?: string
  image?: string
  images?: string[]
  services?: string[]
  externalLink?: string
}

// Variants d'animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  },
}

export default function AdminPortfolioListPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  // Récupérer les catégories uniques
  const categories = ["all", ...Array.from(new Set(projects.map((p) => p.category)))]

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      setFeedbackMessage(null)
      try {
        const response = await fetch("/api/portfolio")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log("Fetched projects:", data) // Debug: Log API response
        setProjects(Array.isArray(data) ? data : [])
        setError(null)
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "Failed to load projects."
        console.error("Failed to fetch projects:", errorMessage)
        setError(errorMessage)
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Filtrer les projets
  useEffect(() => {
    let filtered = projects
    console.log("Projects for filtering:", projects) // Debug: Log projects before filtering
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.client?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((project) => project.category === selectedCategory)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, selectedCategory])

  const handleDelete = async (id: number) => {
    setFeedbackMessage(null)
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.")) {
      setDeletingId(id)
      try {
        const response = await fetch(`/api/portfolio/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setProjects((prevProjects) => prevProjects.filter((p) => p.id !== id))
          setFeedbackMessage("Projet supprimé avec succès.")
          setTimeout(() => setFeedbackMessage(null), 3000)
        } else {
          const errorData = await response.json()
          setFeedbackMessage(`Erreur: ${errorData.message || "Impossible de supprimer le projet."}`)
        }
      } catch (e: unknown) {
        setFeedbackMessage("Erreur: Une erreur inattendue s'est produite lors de la suppression.")
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleLogout = async () => {
    setFeedbackMessage(null)
    setIsLoggingOut(true)
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })
      if (response.ok) {
        // Rediriger vers la page de login
        router.push("/admin/login")
      } else {
        const errorData = await response.json()
        setFeedbackMessage(`Erreur: ${errorData.message || "Échec de la déconnexion."}`)
      }
    } catch (e: unknown) {
      setFeedbackMessage("Erreur: Une erreur inattendue s'est produite lors de la déconnexion.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Composant de carte projet
  const ProjectCard = ({ project }: { project: Project }) => {
    console.log(`ProjectCard image for ${project.title}:`, project.image) // Debug: Log image URL
    return (
      <motion.div variants={cardVariants} layout>
        <Card className="group relative overflow-hidden border-rose-pale/50 hover:border-rose-vif/30 smooth-transition card-depth">
          <div className="relative">
            {/* Image du projet */}
            <div className="relative h-48 bg-muted overflow-hidden">
              {project.image ? (
                // Temporary fallback: Use standard img tag for debugging
                // <img
                //   src={project.image}
                //   alt={project.title}
                //   className="object-cover w-full h-full group-hover:scale-105 smooth-transition"
                // />
                <OptimizedImage
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 smooth-transition"
                  quality={75}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-pale/30 to-violet-mauve/20">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              {/* Badge catégorie */}
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 text-xs font-medium bg-rose-vif/90 text-white rounded-full backdrop-blur-sm">
                  {project.category}
                </span>
              </div>
              {/* Indicateur d'images multiples */}
              {project.images && project.images.length > 1 && (
                <div className="absolute top-3 right-3 px-2 py-1 text-xs bg-black/70 text-white rounded-full backdrop-blur-sm">
                  {project.images.length} images
                </div>
              )}
            </div>

            <CardHeader className="pb-3 px-4 pt-4 sm:px-6 sm:pt-5"> {/* Adjusted padding */}
              <div className="flex flex-col xs:flex-row items-start justify-between gap-2 xs:gap-0"> {/* Stack on very small, then row */}
                <div className="flex-1 min-w-0 order-2 xs:order-1"> {/* Ensure title takes space, reorder for stacking */}
                  <h3 className="text-base sm:text-lg font-semibold text-violet-fonce dark:text-rose-pale truncate" title={project.title}>
                    {project.title}
                  </h3>
                  <div className="flex flex-col xs:flex-row xs:items-center gap-x-3 gap-y-1 mt-1 text-xs sm:text-sm text-muted-foreground"> {/* Stack details, then row. Adjusted gap. */}
                    {project.client && (
                      <div className="flex items-center gap-1 min-w-0"> {/* min-w-0 for truncate */}
                        <User className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate" title={project.client}>{project.client}</span>
                      </div>
                    )}
                    {project.client && project.year && <span className="hidden xs:inline">•</span>} {/* Separator for row view */}
                    {project.year && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span>{project.year}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full order-1 xs:order-2 self-start xs:self-auto"> {/* Smaller padding, reorder for stacking */}
                  #{project.id}
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-0 pb-4 px-4 sm:px-6"> {/* Adjusted padding */}
              {/* Services */}
              {project.services && project.services.length > 0 && (
                <div className="mb-3"> {/* Adjusted margin */}
                  <div className="flex flex-wrap gap-1">
                    {project.services.slice(0, 3).map((service, index) => (
                      <span key={index} className="px-1.5 py-0.5 text-[10px] sm:text-xs bg-violet-mauve/10 text-violet-mauve rounded-full"> {/* Adjusted padding and font size */}
                        {service}
                      </span>
                    ))}
                    {project.services.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] sm:text-xs bg-muted text-muted-foreground rounded-full"> {/* Adjusted padding and font size */}
                        +{project.services.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center xs:justify-between gap-2"> {/* Stacks on xs, then row. Gap for stacking. items-stretch for full width buttons when stacked */}
                <div className="flex flex-col xxs:flex-row items-stretch xxs:items-center gap-2"> {/* Stacks on xxs, then row. For "Modifier" and "Voir" */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full xxs:w-auto">
                    <Link href={`/admin/edit-portfolio/${project.id}`} className="block w-full xxs:w-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 border-violet-mauve/30 hover:bg-violet-mauve/10 w-full xxs:w-auto text-xs sm:text-sm justify-center" // Full width on stack
                      >
                        <Edit3 className="h-3 w-3 mr-1.5 flex-shrink-0" />
                        Modifier
                      </Button>
                    </Link>
                  </motion.div>
                  {project.externalLink && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full xxs:w-auto">
                      <Button size="sm" variant="ghost" className="h-8 w-full xxs:w-auto xxs:px-3 p-0 text-xs sm:text-sm justify-center" asChild>
                        <a href={project.externalLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                          <ExternalLink className="h-3 w-3 sm:mr-1.5 flex-shrink-0" />
                          <span className="hidden sm:inline">Voir</span>
                          <span className="sm:hidden">Lien</span>
                        </a>
                      </Button>
                    </motion.div>
                  )}
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full xs:w-auto">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 w-full xs:w-auto text-xs sm:text-sm justify-center" // Full width on stack
                  >
                    {deletingId === project.id ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                    ) : (
                      <Trash2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    )}
                    Supprimer
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    )
  }

  // Composant de ligne tableau
  const ProjectRow = ({ project }: { project: Project }) => {
    console.log(`ProjectRow image for ${project.title}:`, project.image) // Debug: Log image URL
    return (
      <motion.tr
        variants={itemVariants}
        className="hover:bg-rose-pale/10 dark:hover:bg-rose-vif/5 smooth-transition border-b border-rose-pale/20"
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {project.image ? (
                // Temporary fallback: Use standard img tag for debugging
                // <img
                //   src={project.image}
                //   alt={project.title}
                //   className="object-cover w-full h-full"
                // />
                <OptimizedImage
                  src={project.image}
                  alt={project.title}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-violet-fonce dark:text-rose-pale truncate">{project.title}</div>
              <div className="text-sm text-muted-foreground">#{project.id}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="px-2 py-1 text-xs font-medium bg-rose-vif/10 text-rose-vif rounded-full">
            {project.category}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-muted-foreground">{project.client || "N/A"}</td>
        <td className="px-6 py-4 text-sm text-muted-foreground">{project.year || "N/A"}</td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={`/admin/edit-portfolio/${project.id}`}>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            {project.externalLink && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                  <a href={project.externalLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(project.id)}
                disabled={deletingId === project.id}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                {deletingId === project.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          </div>
        </td>
      </motion.tr>
    )
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4" // Changed sm: to md: for a bit later stacking
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-vif to-violet-mauve bg-clip-text text-transparent"> {/* Responsive font size */}
            Portfolio
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Gérez vos projets et réalisations</p> {/* Responsive font size */}
        </div>
        <div className="flex flex-col xs:flex-row gap-2"> {/* Stacks on very small (col), then row for xs and up */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full xs:w-auto"> {/* Full width on col stack */}
            <Link href="/admin/add-portfolio">
              <Button className="bg-rose-vif hover:bg-rouge-framboise smooth-transition w-full xs:w-auto"> {/* Full width on col stack */}
                <Plus className="h-4 w-4 mr-2" />
                Nouveau projet
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full xs:w-auto"> {/* Full width on col stack */}
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              className="border-rose-vif text-rose-vif hover:bg-rose-vif hover:text-white smooth-transition w-full xs:w-auto" // Full width on col stack
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <LogOut className="h-4 w-4 mr-2" />
              )}
              Déconnexion
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Message de feedback */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={clsx(
              "p-4 rounded-lg flex items-center gap-3",
              feedbackMessage.startsWith("Erreur:")
                ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                : "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800",
            )}
          >
            {feedbackMessage.startsWith("Erreur:") ? (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <span>{feedbackMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtres et recherche */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4"> {/* Changed sm: to md:, adjusted gap */}
          {/* Recherche */}
          <div className="relative flex-1 min-w-0"> {/* Added min-w-0 */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par titre, catégorie ou client..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 border-rose-pale/50 focus:border-rose-vif text-sm" /* Added text-sm */
            />
          </div>

          {/* Filtre par catégorie */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" /> {/* Added flex-shrink-0 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-rose-pale/50 rounded-md bg-background text-foreground focus:border-rose-vif focus:outline-none text-sm" // Added w-full md:w-auto, text-sm
            >
              <option value="all">Toutes les catégories</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle vue */}
          <div className="flex items-center border border-rose-pale/50 rounded-md p-0.5"> {/* Reduced p-1 to p-0.5 */}
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "ghost"}
              onClick={() => setViewMode("grid")}
              className={clsx(
                "h-8 px-2 sm:px-3", // Adjusted padding for smaller screens
                viewMode === "grid" && "bg-rose-vif hover:bg-rouge-framboise",
              )}
              aria-label="Vue en grille"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "ghost"}
              onClick={() => setViewMode("list")}
              className={clsx(
                "h-8 px-2 sm:px-3", // Adjusted padding for smaller screens
                viewMode === "list" && "bg-rose-vif hover:bg-rouge-framboise",
              )}
              aria-label="Vue en liste"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"> {/* Added flex-wrap and gap-y-2 */}
          <span>Total: {projects.length} projets</span>
          {(searchTerm || selectedCategory !== "all") && <span>Affichés: {filteredProjects.length} projets</span>}
        </div>
      </motion.div>

      {/* Contenu */}
      <motion.div variants={itemVariants}>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Chargement des projets...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
              <AlertCircle className="h-6 w-6" />
              <div>
                <div className="font-medium">Erreur de chargement</div>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex flex-col items-center gap-4 px-6 py-8 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
              <div className="w-16 h-16 rounded-full bg-rose-vif/10 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-rose-vif" />
              </div>
              <div>
                <div className="font-medium text-lg mb-2">
                  {projects.length === 0 ? "Aucun projet trouvé" : "Aucun résultat"}
                </div>
                <p className="text-muted-foreground mb-4">
                  {projects.length === 0
                    ? "Commencez par ajouter votre premier projet."
                    : "Essayez de modifier vos critères de recherche."}
                </p>
                {projects.length === 0 && (
                  <Link href="/admin/add-portfolio">
                    <Button className="bg-rose-vif hover:bg-rouge-framboise">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un projet
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="bg-background rounded-lg border border-rose-pale/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-rose-pale/20 dark:bg-rose-vif/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-violet-fonce dark:text-rose-pale">
                      Projet
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-violet-fonce dark:text-rose-pale">
                      Catégorie
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-violet-fonce dark:text-rose-pale">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-violet-fonce dark:text-rose-pale">
                      Année
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-violet-fonce dark:text-rose-pale">
                      Actions
                    </th>
                  </tr>
                </thead>
                <motion.tbody variants={containerVariants}>
                  <AnimatePresence>
                    {filteredProjects.map((project) => (
                      <ProjectRow key={project.id} project={project} />
                    ))}
                  </AnimatePresence>
                </motion.tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}