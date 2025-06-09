"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { isInIframe, throttle } from "@/lib/security-utils"

// Contexte pour partager l'état de sécurité dans l'application
type SecurityContextType = {
  isSecure: boolean
  isLoaded: boolean
}

const SecurityContext = createContext<SecurityContextType>({
  isSecure: true,
  isLoaded: false,
})

export const useSecurityContext = () => useContext(SecurityContext)

// Composant optimisé qui charge les mesures de sécurité progressivement
export default function OptimizedSecurityProvider({ children }: { children: ReactNode }) {
  const [securityState, setSecurityState] = useState<SecurityContextType>({
    isSecure: true,
    isLoaded: false,
  })

  useEffect(() => {
    // Vérifications de sécurité initiales (prioritaires)
    const initialCheck = () => {
      // Vérifier si nous sommes dans une iframe
      if (isInIframe()) {
        setSecurityState({ isSecure: false, isLoaded: true })
        return false
      }
      return true
    }

    // Si les vérifications initiales passent, continuer avec les vérifications secondaires
    if (initialCheck()) {
      // Marquer comme chargé
      setSecurityState({ isSecure: true, isLoaded: true })

      // N'ajouter ces protections qu'en production
      if (process.env.NODE_ENV === "production") {
        // Utiliser throttle pour limiter la fréquence des événements
        const throttledKeyHandler = throttle((e: KeyboardEvent) => {
          // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
          if (
            e.key === "F12" ||
            (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
            (e.ctrlKey && e.key === "u")
          ) {
            e.preventDefault()
          }
        }, 300)

        // Utiliser passive: true quand possible pour améliorer les performances
        document.addEventListener("contextmenu", (e) => e.preventDefault())
        document.addEventListener("keydown", throttledKeyHandler, { passive: false })

        return () => {
          document.removeEventListener("contextmenu", (e) => e.preventDefault())
          document.removeEventListener("keydown", throttledKeyHandler)
        }
      }
    }
  }, [])

  return <SecurityContext.Provider value={securityState}>{children}</SecurityContext.Provider>
}
