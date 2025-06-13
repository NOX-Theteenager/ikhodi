"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, ImageIcon, LinkIcon, Plus, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

const categories = ["Design", "Marketing", "Web"]

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

export default function AddPortfolioPage() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState(categories[0])
  const [description, setDescription] = useState("")
  const [client, setClient] = useState("")
  const [year, setYear] = useState("")
  const [services, setServices] = useState("")
  const [externalLink, setExternalLink] = useState("")
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [galleryImageFiles, setGalleryImageFiles] = useState<FileList | null>(null)
  const [mainImageUrl, setMainImageUrl] = useState("")
  const [galleryImageUrls, setGalleryImageUrls] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMainImageFile(e.target.files?.[0] || null)
  }

  const handleGalleryImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGalleryImageFiles(e.target.files || null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setMessage("")
    const formData = new FormData()
    formData.append("title", title)
    formData.append("category", category)
    formData.append("description", description)
    formData.append("client", client)
    formData.append("year", year)
    formData.append("services", services)
    formData.append("externalLink", externalLink)

    if (mainImageFile) {
      formData.append("image", mainImageFile)
    } else if (mainImageUrl.trim() !== "") {
      formData.append("image_url", mainImageUrl.trim())
    }

    if (galleryImageFiles && galleryImageFiles.length > 0) {
      for (let i = 0; i < galleryImageFiles.length; i++) {
        formData.append("images", galleryImageFiles[i])
      }
    } else if (galleryImageUrls.trim() !== "") {
      formData.append("images_urls", galleryImageUrls.trim())
    }

    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        body: formData,
      })
      if (response.ok) {
        setMessage("Project added successfully! Redirecting...")
        setTitle("")
        setCategory(categories[0])
        setDescription("")
        setClient("")
        setYear("")
        setServices("")
        setExternalLink("")
        setMainImageFile(null)
        setGalleryImageFiles(null)
        setMainImageUrl("")
        setGalleryImageUrls("")
        const form = event.target as HTMLFormElement
        form.reset()
        setTimeout(() => router.push("/admin/portfolio"), 2000)
      } else {
        const errorData = await response.json()
        setMessage(`Failed to add project: ${errorData.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setMessage("An error occurred while submitting the form.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-pale/20 via-background to-violet-mauve/10 py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <Link href="/admin/portfolio">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-rose-vif/10 hover:bg-rose-vif/20 smooth-transition"
              >
                <ArrowLeft className="h-5 w-5 text-rose-vif" />
              </motion.div>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-vif to-violet-mauve bg-clip-text text-transparent">
                Ajouter un Projet
              </h1>
              <p className="text-muted-foreground mt-1">Créez un nouveau projet pour votre portfolio</p>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div variants={itemVariants}>
            <Card className="card-depth border-rose-pale/50 hover:border-rose-vif/30 smooth-transition">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl text-violet-fonce dark:text-rose-pale flex items-center gap-2">
                  <Plus className="h-5 w-5 text-rose-vif" />
                  Détails du Projet
                </CardTitle>
                <CardDescription>Remplissez les informations du nouveau projet portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <motion.div variants={itemVariants} className="md:col-span-2">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-violet-fonce dark:text-rose-pale mb-2"
                      >
                        Titre du Projet *
                      </label>
                      <Input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="focus:border-rose-vif focus:ring-rose-vif"
                        placeholder="Ex: Refonte de marque complète"
                      />
                    </motion.div>

                    {/* Category */}
                    <motion.div variants={itemVariants}>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-violet-fonce dark:text-rose-pale mb-2"
                      >
                        Catégorie *
                      </label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-vif focus:border-rose-vif"
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
                        className="block text-sm font-medium text-violet-fonce dark:text-rose-pale mb-2"
                      >
                        Année
                      </label>
                      <Input
                        type="text"
                        id="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="focus:border-rose-vif focus:ring-rose-vif"
                        placeholder="2024"
                      />
                    </motion.div>

                    {/* Client */}
                    <motion.div variants={itemVariants}>
                      <label
                        htmlFor="client"
                        className="block text-sm font-medium text-violet-fonce dark:text-rose-pale mb-2"
                      >
                        Client
                      </label>
                      <Input
                        type="text"
                        id="client"
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        className="focus:border-rose-vif focus:ring-rose-vif"
                        placeholder="Nom du client"
                      />
                    </motion.div>

                    {/* External Link */}
                    <motion.div variants={itemVariants}>
                      <label
                        htmlFor="externalLink"
                        className="block text-sm font-medium text-violet-fonce dark:text-rose-pale mb-2"
                      >
                        Lien Externe
                      </label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="url"
                          id="externalLink"
                          value={externalLink}
                          onChange={(e) => setExternalLink(e.target.value)}
                          className="pl-10 focus:border-rose-vif focus:ring-rose-vif"
                          placeholder="https://example.com"
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Description */}
                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-violet-fonce dark:text-rose-pale mb-2"
                    >
                      Description *
                    </label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="min-h-[120px] focus:border-rose-vif focus:ring-rose-vif"
                      placeholder="Décrivez le projet en détail..."
                    />
                  </motion.div>

                  {/* Services */}
                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="services"
                      className="block text-sm font-medium text-violet-fonce dark:text-rose-pale mb-2"
                    >
                      Services (séparés par des virgules)
                    </label>
                    <Input
                      type="text"
                      id="services"
                      value={services}
                      onChange={(e) => setServices(e.target.value)}
                      className="focus:border-rose-vif focus:ring-rose-vif"
                      placeholder="Design, Développement, Marketing"
                    />
                  </motion.div>

                  {/* Images Section */}
                  <motion.div variants={itemVariants} className="space-y-6">
                    <h3 className="text-lg font-semibold text-violet-fonce dark:text-rose-pale flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-rose-vif" />
                      Images du Projet
                    </h3>

                    {/* Main Image */}
                    <Card className="border-violet-mauve/20">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-base">Image Principale</CardTitle>
                        <CardDescription>Téléchargez l'image principale du projet</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="relative">
                          <input
                            type="file"
                            id="imageFile"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="border-2 border-dashed border-rose-vif/30 rounded-lg p-6 text-center hover:border-rose-vif/50 smooth-transition">
                            <Upload className="h-8 w-8 text-rose-vif mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Cliquez pour télécharger ou glissez-déposez</p>
                            {mainImageFile && (
                              <p className="text-xs text-rose-vif mt-2">Fichier sélectionné: {mainImageFile.name}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">ou</div>
                        <Input
                          type="text"
                          value={mainImageUrl}
                          onChange={(e) => setMainImageUrl(e.target.value)}
                          placeholder="URL de l'image (fallback)"
                          className="focus:border-rose-vif focus:ring-rose-vif"
                        />
                      </CardContent>
                    </Card>

                    {/* Gallery Images */}
                    <Card className="border-violet-mauve/20">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-base">Galerie d'Images</CardTitle>
                        <CardDescription>Téléchargez plusieurs images pour la galerie</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="relative">
                          <input
                            type="file"
                            id="galleryImageFiles"
                            multiple
                            accept="image/*"
                            onChange={handleGalleryImagesChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="border-2 border-dashed border-violet-mauve/30 rounded-lg p-6 text-center hover:border-violet-mauve/50 smooth-transition">
                            <Upload className="h-8 w-8 text-violet-mauve mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Sélectionnez plusieurs images pour la galerie
                            </p>
                            {galleryImageFiles && galleryImageFiles.length > 0 && (
                              <p className="text-xs text-violet-mauve mt-2">
                                {galleryImageFiles.length} fichier(s) sélectionné(s)
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">ou</div>
                        <Input
                          type="text"
                          value={galleryImageUrls}
                          onChange={(e) => setGalleryImageUrls(e.target.value)}
                          placeholder="URLs des images séparées par des virgules (fallback)"
                          className="focus:border-violet-mauve focus:ring-violet-mauve"
                        />
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={itemVariants} className="flex justify-end pt-6">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="px-8 py-3 bg-gradient-to-r from-rose-vif to-violet-mauve hover:from-rouge-framboise hover:to-violet-fonce smooth-transition shimmer"
                      >
                        {submitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                            Ajout en cours...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter le Projet
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
                    message.startsWith("Failed") || message.startsWith("An error")
                      ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-l-green-500 bg-green-50 dark:bg-green-900/20"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {message.startsWith("Failed") || message.startsWith("An error") ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      <p
                        className={`text-sm font-medium ${
                          message.startsWith("Failed") || message.startsWith("An error")
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