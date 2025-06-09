"use client"

import { useEffect } from "react"

export default function SecurityHeaders() {
  useEffect(() => {
    // Détection d'iframe optimisée - exécutée une seule fois au chargement
    if (window.self !== window.top) {
      const securityMessage = document.createElement("div")
      securityMessage.innerHTML = "Ce site ne peut pas être affiché dans une iframe."
      securityMessage.style.position = "fixed"
      securityMessage.style.top = "0"
      securityMessage.style.left = "0"
      securityMessage.style.width = "100%"
      securityMessage.style.height = "100%"
      securityMessage.style.backgroundColor = "#000"
      securityMessage.style.color = "#fff"
      securityMessage.style.display = "flex"
      securityMessage.style.justifyContent = "center"
      securityMessage.style.alignItems = "center"
      securityMessage.style.zIndex = "9999"
      document.body.appendChild(securityMessage)
      return // Sortir tôt pour éviter d'ajouter des event listeners inutiles
    }

    // Optimisation: n'ajouter ces protections qu'en production
    if (process.env.NODE_ENV === "production") {
      // Utilisation de passive: true pour améliorer les performances des event listeners
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault()
      }

      // Debouncing pour réduire l'impact des événements clavier fréquents
      let lastKeyTime = 0
      const keyThreshold = 300 // ms

      const handleKeyDown = (e: KeyboardEvent) => {
        const now = Date.now()
        if (now - lastKeyTime < keyThreshold) return // Ignorer les événements trop rapprochés
        lastKeyTime = now

        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
          (e.ctrlKey && e.key === "u")
        ) {
          e.preventDefault()
        }
      }

      // Utiliser { passive: true } quand possible pour améliorer les performances
      document.addEventListener("contextmenu", handleContextMenu)
      document.addEventListener("keydown", handleKeyDown, { passive: false })

      return () => {
        document.removeEventListener("contextmenu", handleContextMenu)
        document.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, []) // Dépendances vides pour n'exécuter qu'une seule fois

  // Ne rien rendre dans le DOM = meilleure performance
  return null
}
