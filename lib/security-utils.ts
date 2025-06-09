export const isInIframe = (): boolean => {
  try {
    return window.self !== window.top
  } catch (e) {
    // Si une erreur se produit, c'est probablement à cause des restrictions de sécurité
    // ce qui signifie que nous sommes dans une iframe cross-origin
    return true
  }
}

// Fonction pour sanitizer les entrées utilisateur
export const sanitizeInput = (input: string): string => {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

// Fonction pour générer un nonce aléatoire pour CSP
export const generateNonce = (): string => {
  const array = new Uint8Array(16)
  window.crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

// Fonction pour détecter les tentatives de XSS
export const detectXSS = (input: string): boolean => {
  const xssPatterns = [/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, /javascript:/gi, /on\w+=/gi, /data:/gi]

  return xssPatterns.some((pattern) => pattern.test(input))
}

// Fonction optimisée pour throttle les événements
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}
