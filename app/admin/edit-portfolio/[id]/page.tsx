"use client"

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, ImageIcon, LinkIcon, Save, ArrowLeft, CheckCircle, AlertCircle, Loader2, Edit3, X } from "lucide-react"
import Image from "next/image" // Import next/image
import Link from "next/link"

const categories = ["Design", "Marketing", "Web"]

interface ProjectState {
  id: number | null
  title: string
  category: string
  image: string
  images: string[]
  description: string
  client: string
  year: string
  services: string[]
  externalLink: string
}

// Variants d'animation
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
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

export default function EditPortfolioPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [projectData, setProjectData] = useState<ProjectState | null>(null)
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [galleryImageFiles, setGalleryImageFiles] = useState<FileList | null>(null)
  const [servicesString, setServicesString] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeletingImage, setIsDeletingImage] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      setError("")
      fetch(`/api/portfolio/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch project (status: ${res.status})`)
          }
          return res.json()
        })
        .then((data: ProjectState) => {
          if (!data || typeof data.id === "undefined") {
            throw new Error("Fetched data is not a valid project.")
          }
          setProjectData(data)
          setServicesString(Array.isArray(data.services) ? data.services.join(", ") : "")
          setIsLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching project:", err)
          setError(err.message || "Could not load project data.")
          setIsLoading(false)
        })
    } else {
      setError("No project ID provided.")
      setIsLoading(false)
    }
  }, [id])

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!projectData) return
    const { name, value } = e.target
    setProjectData({ ...projectData, [name]: value })
  }

  const handleServicesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setServicesString(e.target.value)
    if (projectData) {
      setProjectData({
        ...projectData,
        services: e.target.value
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      })
    }
  }

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMainImageFile(e.target.files?.[0] || null)
  }

  const handleGalleryImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGalleryImageFiles(e.target.files || null)
  }

  const handleDeleteGalleryImage = async (imageUrlToDelete: string) => {
    if (!projectData || !projectData.id) {
      setMessage("Données du projet non disponibles.");
      return;
    }
    if (isDeletingImage) return;

    setIsDeletingImage(true);
    setMessage("");

    const filename = imageUrlToDelete.substring(imageUrlToDelete.lastIndexOf('/') + 1);

    try {
      const response = await fetch(`/api/portfolio/${projectData.id}/images/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjectData((prevData) => ({
          ...prevData!,
          images: prevData!.images.filter((img) => img !== imageUrlToDelete),
        }));
        setMessage("Image de la galerie supprimée avec succès.");
      } else {
        const errorData = await response.json();
        setMessage(`Échec de la suppression de l'image : ${errorData.message || "Erreur inconnue"}`);
      }
    } catch (err: any) {
      console.error("Erreur lors de la suppression de l'image de la galerie:", err);
      setMessage("Une erreur s'est produite lors de la suppression de l'image : " + err.message);
    } finally {
      setIsDeletingImage(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!id || !projectData) {
      setMessage("Les données du projet ou l'ID sont manquants.")
      return
    }
    setIsSubmitting(true)
    setMessage("")
    const formData = new FormData()
    formData.append("title", projectData.title)
    formData.append("category", projectData.category)
    formData.append("description", projectData.description)
    formData.append("client", projectData.client)
    formData.append("year", projectData.year)
    formData.append("services", projectData.services.join(","))
    formData.append("externalLink", projectData.externalLink)

    if (mainImageFile) {
      formData.append("image", mainImageFile)
    }

    if (galleryImageFiles && galleryImageFiles.length > 0) {
      for (let i = 0; i < galleryImageFiles.length; i++) {
        formData.append("images", galleryImageFiles[i])
      }
    }

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: "PUT",
        body: formData,
      })
      if (response.ok) {
        setMessage("Project updated successfully! Redirecting...")
        setTimeout(() => router.push("/admin/portfolio"), 2000)
      } else {
        const errorData = await response.json()
        setMessage(`Failed to update project: ${errorData.message || "Unknown error"}`)
      }
    } catch (err: any) {
      console.error("Error submitting form:", err)
      setMessage("An error occurred while submitting the form: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-pale/20 via-background to-violet-mauve/10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-12 h-12 border-4 border-rose-vif border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-lg text-violet-fonce dark:text-rose-pale">Chargement du projet...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-pale/20 via-background to-violet-mauve/10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-10"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Erreur</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/admin/portfolio">
            <Button variant="outline" className="border-rose-vif text-rose-vif hover:bg-rose-vif hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-pale/20 via-background to-violet-mauve/10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-10"
        >
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-2">Projet introuvable</h2>
          <p className="text-muted-foreground mb-4">Le projet n'a pas pu être chargé.</p>
          <Link href="/admin/portfolio">
            <Button variant="outline" className="border-rose-vif text-rose-vif hover:bg-rose-vif hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-pale/20 via-background to-violet-mauve/10 py-6 sm:py-8 px-4"> {/* Adjusted padding for sm screens */}
      <div className="container max-w-4xl mx-auto"> {/* max-w-4xl is good for larger, container handles smaller */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 sm:space-y-8"> {/* Adjusted spacing */}
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 sm:gap-4"> {/* Adjusted gap */}
            <Link href="/admin/portfolio">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-rose-vif/10 hover:bg-rose-vif/20 smooth-transition"
              >
                <ArrowLeft className="h-5 w-5 text-rose-vif" />
              </motion.div>
            </Link>
            <div className="flex-1 min-w-0"> {/* Added flex-1 and min-w-0 for truncation */}
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-vif to-violet-mauve bg-clip-text text-transparent truncate" title="Modifier le Projet"> {/* Responsive font, truncate */}
                Modifier le Projet
              </h1>
              <p className="text-muted-foreground mt-1 text-sm truncate" title={`ID: ${id} • ${projectData.title}`}> {/* Truncate, responsive text */}
                ID: {id} • {projectData.title}
              </p>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div variants={itemVariants}>
            <Card className="card-depth border-rose-pale/50 hover:border-rose-vif/30 smooth-transition">
              <CardHeader className="pb-4 sm:pb-6 px-4 pt-4 sm:px-6 sm:pt-5"> {/* Adjusted padding */}
                <CardTitle className="text-lg sm:text-xl text-violet-fonce dark:text-rose-pale flex items-center gap-2"> {/* Responsive font */}
                  <Edit3 className="h-5 w-5 text-rose-vif" />
                  Modifier les Détails
                </CardTitle>
                <CardDescription className="text-sm">Modifiez les informations du projet portfolio</CardDescription> {/* Ensure text size is fine */}
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6"> {/* Adjusted padding */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 md:gap-6"> {/* Adjusted gap for tighter mobile */}
                    {/* Title */}
                    <motion.div variants={itemVariants} className="md:col-span-2">
                      <label
                        htmlFor="title"
                        className="block text-xs sm:text-sm font-medium text-violet-fonce dark:text-rose-pale mb-1.5 sm:mb-2" /* Smaller bottom margin on mobile */
                      >
                        Titre du Projet *
                      </label>
                      <Input
                        type="text"
                        id="title"
                        name="title"
                        value={projectData.title}
                        onChange={handleTextChange}
                        required
                        className="focus:border-rose-vif focus:ring-rose-vif text-sm sm:text-base" /* Responsive text */
                      />
                    </motion.div>

                    {/* Category */}
                    <motion.div variants={itemVariants}>
                      <label
                        htmlFor="category"
                        className="block text-xs sm:text-sm font-medium text-violet-fonce dark:text-rose-pale mb-1.5 sm:mb-2"
                      >
                        Catégorie *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={projectData.category}
                        onChange={handleTextChange}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-vif focus:border-rose-vif text-sm sm:text-base" /* Responsive text */
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </motion.div>

                    {/* Year */}
                    <motion.div variants={itemVariants}>
                      <label
                        htmlFor="year"
                        className="block text-xs sm:text-sm font-medium text-violet-fonce dark:text-rose-pale mb-1.5 sm:mb-2"
                      >
                        Année
                      </label>
                      <Input
                        type="text"
                        id="year"
                        name="year"
                        value={projectData.year}
                        onChange={handleTextChange}
                        className="focus:border-rose-vif focus:ring-rose-vif text-sm sm:text-base" /* Responsive text */
                      />
                    </motion.div>

                    {/* Client */}
                    <motion.div variants={itemVariants}>
                      <label
                        htmlFor="client"
                        className="block text-xs sm:text-sm font-medium text-violet-fonce dark:text-rose-pale mb-1.5 sm:mb-2"
                      >
                        Client
                      </label>
                      <Input
                        type="text"
                        id="client"
                        name="client"
                        value={projectData.client}
                        onChange={handleTextChange}
                        className="focus:border-rose-vif focus:ring-rose-vif text-sm sm:text-base" /* Responsive text */
                      />
                    </motion.div>

                    {/* External Link */}
                    <motion.div variants={itemVariants}>
                      <label
                        htmlFor="externalLink"
                        className="block text-xs sm:text-sm font-medium text-violet-fonce dark:text-rose-pale mb-1.5 sm:mb-2"
                      >
                        Lien Externe
                      </label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="url"
                          id="externalLink"
                          name="externalLink"
                          value={projectData.externalLink}
                          onChange={handleTextChange}
                          className="pl-10 focus:border-rose-vif focus:ring-rose-vif text-sm sm:text-base" /* Responsive text */
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Description */}
                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="description"
                      className="block text-xs sm:text-sm font-medium text-violet-fonce dark:text-rose-pale mb-1.5 sm:mb-2"
                    >
                      Description *
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={projectData.description}
                      onChange={handleTextChange}
                      required
                      className="min-h-[100px] sm:min-h-[120px] focus:border-rose-vif focus:ring-rose-vif text-sm sm:text-base" /* Responsive min-height and text */
                    />
                  </motion.div>

                  {/* Services */}
                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="services"
                      className="block text-xs sm:text-sm font-medium text-violet-fonce dark:text-rose-pale mb-1.5 sm:mb-2"
                    >
                      Services (séparés par des virgules)
                    </label>
                    <Input
                      type="text"
                      id="services"
                      name="services"
                      value={servicesString}
                      onChange={handleServicesChange}
                      className="focus:border-rose-vif focus:ring-rose-vif text-sm sm:text-base" /* Responsive text */
                    />
                  </motion.div>

                  {/* Current Images */}
                  <motion.div variants={itemVariants} className="space-y-6">
                    <h3 className="text-md sm:text-lg font-semibold text-violet-fonce dark:text-rose-pale flex items-center gap-2"> {/* Responsive text */}
                      <ImageIcon className="h-5 w-5 text-rose-vif" />
                      Images du Projet
                    </h3>

                    {/* Current Main Image */}
                    <Card className="border-violet-mauve/20">
                      <CardHeader className="pb-3 sm:pb-4 px-3 pt-3 sm:px-4 sm:pt-4"> {/* Adjusted padding */}
                        <CardTitle className="text-sm sm:text-base">Image Principale Actuelle</CardTitle> {/* Responsive text */}
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4 px-3 pb-3 sm:px-4 sm:pb-4"> {/* Adjusted padding and spacing */}
                        {projectData.image ? (
                          <div className="relative group w-full max-w-[320px] h-auto aspect-[16/10] sm:aspect-[16/9]"> {/* Responsive container, aspect ratio */}
                            <Image
                              src={projectData.image || "/placeholder.svg"}
                              alt="Image principale actuelle"
                              layout="fill" // Use fill for responsiveness within aspect ratio container
                              objectFit="contain"
                              className="rounded-lg shadow-sm border border-rose-pale/50"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 smooth-transition rounded-lg flex items-center justify-center">
                              <p className="text-white text-sm">Image actuelle</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">Aucune image principale.</p>
                        )}

                        <div className="space-y-1.5 sm:space-y-2">
                          <label className="block text-xs sm:text-sm font-medium text-violet-fonce dark:text-rose-pale">
                            Remplacer l'image principale
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              id="mainImageFile"
                              accept="image/*"
                              onChange={handleMainImageChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="border-2 border-dashed border-rose-vif/30 rounded-lg p-3 sm:p-4 text-center hover:border-rose-vif/50 smooth-transition"> {/* Adjusted padding */}
                              <Upload className="h-5 sm:h-6 w-5 text-rose-vif mx-auto mb-1 sm:mb-2" /> {/* Adjusted size/margin */}
                              <p className="text-xs sm:text-sm text-muted-foreground"> {/* Responsive text */}
                                {mainImageFile ? `Nouveau fichier: ${mainImageFile.name}` : "Cliquez pour remplacer"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Current Gallery Images */}
                    <Card className="border-violet-mauve/20">
                      <CardHeader className="pb-3 sm:pb-4 px-3 pt-3 sm:px-4 sm:pt-4"> {/* Adjusted padding */}
                        <CardTitle className="text-sm sm:text-base">Galerie Actuelle</CardTitle> {/* Responsive text */}
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4 px-3 pb-3 sm:px-4 sm:pb-4"> {/* Adjusted padding and spacing */}
                        {projectData.images && projectData.images.length > 0 ? (
                          <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3"> {/* Adjusted grid columns for xs, gap */}
                            {projectData.images.map((imgUrl, index) => (
                              <div key={index} className="relative group w-full aspect-square"> {/* Aspect square for gallery thumbs */}
                                <Image
                                  src={imgUrl || "/placeholder.svg"}
                                  alt={`Image galerie ${index + 1}`}
                                  layout="fill" // Use fill for responsiveness
                                  objectFit="cover"
                                  className="rounded-lg shadow-sm border border-violet-mauve/30"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGalleryImage(imgUrl)}
                                  disabled={isDeletingImage}
                                  className="absolute top-1 right-1 p-0.5 bg-red-600/70 hover:bg-red-500 text-white rounded-full smooth-transition opacity-0 group-hover:opacity-100 z-10"
                                  aria-label="Supprimer l'image de la galerie"
                                >
                                  {isDeletingImage ? <Loader2 className="h-3 w-3 animate-spin"/> : <X className="h-3 w-3" />}
                                </button>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 smooth-transition rounded-lg flex items-center justify-center pointer-events-none">
                                  <p className="text-white text-xs">{index + 1}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">Aucune image de galerie.</p>
                        )}

                        <div className="space-y-1.5 sm:space-y-2"> {/* Adjusted spacing */}
                          <label className="block text-xs sm:text-sm font-medium text-violet-fonce dark:text-rose-pale"> {/* Responsive text */}
                            Ajouter de nouvelles images à la galerie
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              id="galleryImageFiles"
                              multiple
                              accept="image/*"
                              onChange={handleGalleryImagesChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="border-2 border-dashed border-violet-mauve/30 rounded-lg p-3 sm:p-4 text-center hover:border-violet-mauve/50 smooth-transition"> {/* Adjusted padding */}
                              <Upload className="h-5 sm:h-6 w-5 sm:h-6 text-violet-mauve mx-auto mb-1 sm:mb-2" /> {/* Adjusted size/margin */}
                              <p className="text-xs sm:text-sm text-muted-foreground"> {/* Responsive text */}
                                {galleryImageFiles && galleryImageFiles.length > 0
                                  ? `${galleryImageFiles.length} nouveau(x) fichier(s) sélectionné(s)`
                                  : "Cliquez pour ajouter des images"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div variants={itemVariants} className="flex flex-col xs:flex-row xs:justify-between items-stretch xs:items-center gap-3 pt-4 sm:pt-6"> {/* Stack on xs, items-stretch for full width buttons when stacked, adjusted gap and padding */}
                    <Link href="/admin/portfolio" className="w-full xs:w-auto">
                      <Button
                        variant="outline"
                        className="border-muted-foreground text-muted-foreground hover:bg-muted w-full xs:w-auto text-sm sm:text-base" /* Full width on stack */
                      >
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                    </Link>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full xs:w-auto">
                      <Button
                        type="submit"
                        disabled={isSubmitting || isDeletingImage}
                        className="px-6 py-3 sm:px-8 bg-gradient-to-r from-rose-vif to-violet-mauve hover:from-rouge-framboise hover:to-violet-fonce smooth-transition shimmer w-full xs:w-auto text-sm sm:text-base" /* Adjusted padding, full width on stack */
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Mise à jour...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Sauvegarder
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`border-l-4 ${
                    message.toLowerCase().startsWith("failed") || message.toLowerCase().startsWith("an error") || message.toLowerCase().startsWith("échec") || message.toLowerCase().startsWith("une erreur")
                      ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-l-green-500 bg-green-50 dark:bg-green-900/20"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {message.toLowerCase().startsWith("failed") || message.toLowerCase().startsWith("an error") || message.toLowerCase().startsWith("échec") || message.toLowerCase().startsWith("une erreur") ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      <p
                        className={`text-sm font-medium ${
                          message.toLowerCase().startsWith("failed") || message.toLowerCase().startsWith("an error") || message.toLowerCase().startsWith("échec") || message.toLowerCase().startsWith("une erreur")
                            ? "text-red-700 dark:text-red-300"
                            : "text-green-700 dark:text-green-300"
                        }`}
                      >
                        {message}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}