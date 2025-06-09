"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

const categories = ["Tous", "Design", "Marketing", "Web"]

const projects = [
  {
    id: 1,
    title: "Refonte de marque",
    category: "Design",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    title: "Campagne digitale",
    category: "Marketing",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    title: "Site e-commerce",
    category: "Web",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 4,
    title: "Identité visuelle",
    category: "Design",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 5,
    title: "Application mobile",
    category: "Web",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 6,
    title: "Stratégie SEO",
    category: "Marketing",
    image: "/placeholder.svg?height=300&width=400",
  },
]

export default function PortfolioSection() {
  const [activeTab, setActiveTab] = useState("Tous")

  const filteredProjects =
    activeTab === "Tous" ? projects : projects.filter((project) => project.category === activeTab)

  return (
    <section id="portfolio" className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <motion.div
              className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Portfolio
            </motion.div>
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Nos réalisations
            </motion.h2>
            <motion.p
              className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Découvrez nos projets récents et laissez-vous inspirer par notre créativité.
            </motion.p>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Tabs defaultValue="Tous" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl">
            <TabsList className="grid w-full grid-cols-4">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-rose-vif data-[state=active]:text-white transition-all duration-300"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={activeTab} className="mt-8">
              <motion.div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="group relative overflow-hidden rounded-lg cursor-pointer"
                  >
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-6">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                        <p className="text-sm text-white/80">{project.category}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
