"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, Eye, EyeOff, Shield, AlertCircle, Loader2 } from "lucide-react"

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

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        router.push("/admin/portfolio")
      } else {
        const data = await response.json()
        setError(data.message || "Mot de passe invalide.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Une erreur s'est produite lors de la connexion.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-pale/20 via-background to-violet-mauve/10 flex items-center justify-center p-3 xs:p-4"> {/* Slightly less padding on xxs */}
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-rose-vif/5 blur-xl" /* Smaller on mobile */
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-violet-mauve/5 blur-xl" /* Smaller on mobile */
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <Card className="card-depth border-rose-pale/50 hover:border-rose-vif/30 smooth-transition overflow-hidden">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-rose-vif to-violet-mauve p-4 sm:p-6 text-white"> {/* Adjusted padding */}
            <motion.div variants={itemVariants} className="text-center">
              <motion.div
                className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full mb-3 sm:mb-4" /* Responsive size and margin */
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Shield className="h-6 w-6 sm:h-8 sm:w-8" /> {/* Responsive icon size */}
              </motion.div>
              <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Panneau d'Administration</h1> {/* Responsive font and margin */}
              <p className="text-white/80 text-xs sm:text-sm">Accès sécurisé au tableau de bord</p> {/* Responsive font */}
            </motion.div>

            {/* Decorative pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-50" />
          </div>

          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6"> {/* Adjusted padding and spacing */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6"> {/* Adjusted spacing */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium text-violet-fonce dark:text-rose-pale mb-1 sm:mb-1.5" /* Responsive text and margin */
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-12 focus:border-rose-vif focus:ring-rose-vif text-sm sm:text-base" /* Responsive text */
                    placeholder="Entrez votre mot de passe"
                  />
                  <motion.button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted smooth-transition focus-ring"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    variants={itemVariants}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"> {/* Adjusted padding and gap */}
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" /> {/* Responsive icon size */}
                      <p className="text-xs sm:text-sm text-red-700 dark:text-red-300">{error}</p> {/* Responsive text */}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-rose-vif to-violet-mauve hover:from-rouge-framboise hover:to-violet-fonce smooth-transition shimmer focus-ring text-sm sm:text-base" /* Adjusted padding, responsive text */
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connexion en cours...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Se connecter
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </form>

            {/* Security Notice */}
            <motion.div variants={itemVariants} className="text-center pt-3 sm:pt-4 border-t border-border/50"> {/* Adjusted padding */}
              <p className="text-xs text-muted-foreground">🔒 Connexion sécurisée • Accès administrateur uniquement</p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <motion.div variants={itemVariants} className="mt-4 sm:mt-6 text-center"> {/* Adjusted margin */}
          <p className="text-xs sm:text-sm text-muted-foreground">Besoin d'aide ? Contactez l'administrateur système</p> {/* Responsive text */}
        </motion.div>
      </motion.div>
    </div>
  )
}