"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 hover-lift">
              <Image
                          src="/images/logo.png"
                          alt="DigitalCraft Studio Logo"
                          width={120}
                          height={40}
                          className="object-contain"
                        />
            </Link>
            <p className="text-sm text-muted-foreground">
              Votre partenaire pour une présence digitale d'exception. Design graphique, marketing digital et création
              de sites web.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#services"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Design Graphique
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Marketing Digital
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Création de Sites Web
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Stratégie de Marque
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Entreprise</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#about"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="#portfolio"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                {/* <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Carrières
                </Link> */}
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Suivez-nous</h3>
            <div className="flex space-x-4">
              <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <Link href="https://web.facebook.com/Ikhodi237/?_rdc=1&_rdr" className="text-muted-foreground hover:text-rose-vif transition-colors duration-200">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <Link href="#" className="text-muted-foreground hover:text-rose-vif transition-colors duration-200">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <Link href="#" className="text-muted-foreground hover:text-rose-vif transition-colors duration-200">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <Link href="#" className="text-muted-foreground hover:text-rose-vif transition-colors duration-200">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </motion.div>
            </div>
            {/* <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Abonnez-vous à notre newsletter</p>
              <form className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 focus:border-rose-vif"
                />
                <motion.button
                  type="submit"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  OK
                </motion.button>
              </form>
            </div> */}
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ikhodi. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
