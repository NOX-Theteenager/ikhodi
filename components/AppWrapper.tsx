"use client"

import { useState } from "react"
import IntroCinematic from "@/components/IntroCinematic"
import Header from "@/components/header"
import Footer from "@/components/footer"
import dynamic from "next/dynamic"

const OptimizedSecurityProvider = dynamic(() => import("@/components/optimized-security-provider"), {
  ssr: false,
  loading: () => null,
})

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showApp, setShowApp] = useState(false)

  const handleCinematicFinish = () => {
    setShowApp(true)
  }

  return (
    <>
      {!showApp && <IntroCinematic onFinish={handleCinematicFinish} />}
      {showApp && (
        <>
          <OptimizedSecurityProvider>
            <Header />
            {children}
            <Footer />
          </OptimizedSecurityProvider>
        </>
      )}
    </>
  )
}