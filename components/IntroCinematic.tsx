"use client"

import { useState } from "react"
import { Player } from "@lottiefiles/react-lottie-player"
import animationData from "@/public/cinematiquelogo.json"

const IntroCinematic = ({ onFinish }: { onFinish: () => void }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleAnimationComplete = () => {
    setIsVisible(false)
    onFinish()
  }

  return (
    isVisible && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <Player
          autoplay
          loop={false}
          src={animationData}
          style={{ width: "100%", height: "100%", maxWidth: "800px" }}
          onEvent={(event) => {
            if (event === "complete") {
              handleAnimationComplete()
            }
          }}
        />
      </div>
    )
  )
}

export default IntroCinematic