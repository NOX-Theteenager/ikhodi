"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"

const navItems = [
  { name: "Accueil", href: "/" },
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "À propos", href: "#about" },
  { name: "Contact", href: "#contact" },
]

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleNavClick = (href: string) => {
    setIsOpen(false)
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2 hover-lift">
          <Image
            src="/images/logo.png"
            alt="DigitalCraft Studio Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => {
                if (item.href.startsWith("#")) {
                  e.preventDefault()
                  handleNavClick(item.href)
                }
              }}
              className="text-sm font-medium transition-colors hover:text-primary relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-vif transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

          {isMounted && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="ml-2 rounded-full hover:bg-rose-pale/50 border-rose-vif/30"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-rose-vif" />
                ) : (
                  <Moon className="h-5 w-5 text-violet-mauve" />
                )}
                <span className="sr-only">Changer de thème</span>
              </Button>
            </motion.div>
          )}
        </nav>

        {/* Menu mobile */}
        <div className="md:hidden flex items-center gap-2">
          {isMounted && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-rose-pale/50 border-rose-vif/30"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-rose-vif" />
                ) : (
                  <Moon className="h-4 w-4 text-violet-mauve" />
                )}
                <span className="sr-only">Changer de thème</span>
              </Button>
            </motion.div>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="pulse-on-click">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 pt-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/images/logo.png"
                      alt="ikhodi Logo"
                      width={100}
                      height={30}
                      className="object-contain"
                    />
                  </div>
                </div>

                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.startsWith("#")) {
                        e.preventDefault()
                        handleNavClick(item.href)
                      }
                    }}
                    className="text-lg font-medium transition-colors hover:text-primary hover-lift py-2 border-b border-border/50"
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-sm text-muted-foreground mb-4">
                    Votre partenaire pour une présence digitale d'exception
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Email:</strong> vanessandm00@gmail.com
                    </p>
                    <p className="text-sm">
                      <strong>Téléphone:</strong> +237 693 89 88 67
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}