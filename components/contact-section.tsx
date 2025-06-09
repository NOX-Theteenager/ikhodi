"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function ContactSection() {
  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5 md:h-6 md:w-6 text-rose-vif" />,
      title: "Email",
      details: "vanessandm00@gmail.com",
    },
    {
      icon: <Phone className="h-5 w-5 md:h-6 md:w-6 text-violet-mauve" />,
      title: "Téléphone",
      details: "+237 693 89 88 67",
    },
    {
      icon: <MapPin className="h-5 w-5 md:h-6 md:w-6 text-rouge-framboise" />,
      title: "Adresse",
      details: "Yaoundé, Montée Anne rouge, Cameroun",
    },
  ]

  // const apiKey = "clé_api_google_maps" 
  // const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=3.848032,11.502075&zoom=15&size=600x200&maptype=roadmap&markers=color:red%7C3.848032,11.502075&key=${apiKey}`
  const googleMapsUrl = "https://maps.app.goo.gl/fQBbLEy4cwMwoYrGA"

  return (
    <section id="contact" className="py-8 md:py-12 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <motion.div
              className="inline-block rounded-lg bg-gradient-to-r from-rouge-framboise to-rose-vif px-3 py-1 text-sm text-white"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Contact
            </motion.div>
            <motion.h2
              className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Parlons de votre projet
            </motion.h2>
            <motion.p
              className="max-w-[700px] text-muted-foreground text-base md:text-lg lg:text-xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Prêt à transformer votre vision en réalité ? Contactez-nous dès aujourd'hui.
            </motion.p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 md:py-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-violet-fonce dark:text-rose-pale">
                Contactez-nous directement
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Choisissez votre moyen de communication préféré pour nous contacter
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Bouton Email */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="mailto:vanessandm00@gmail.com?subject=Demande de renseignements&body=Bonjour,%0D%0A%0D%0AJe souhaiterais obtenir des informations sur vos services.%0D%0A%0D%0ACordialement"
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-rose-vif to-rouge-framboise p-4 md:p-6 text-white transition-all duration-300 hover:shadow-lg hover:shadow-rose-vif/25 block"
                >
                  <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                    <motion.div
                      className="p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-sm"
                      whileHover={{ rotate: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Mail className="h-6 w-6 md:h-8 md:w-8" />
                    </motion.div>
                    <div>
                      <h4 className="text-base md:text-lg font-semibold">Envoyer un Email</h4>
                      <p className="text-xs md:text-sm opacity-90">vanessandm00@gmail.com</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </a>
              </motion.div>

              {/* Bouton WhatsApp */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="https://wa.me/237693898867?text=Bonjour%20ikhodi%2C%0AJe%20souhaiterais%20obtenir%20des%20informations%20sur%20vos%20services%20de%20design%20graphique%2C%20marketing%20digital%20et%20création%20de%20sites%20web.%0AMerci%20!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-violet-mauve to-violet-fonce p-4 md:p-6 text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet-mauve/25 block"
                >
                  <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                    <motion.div
                      className="p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-sm"
                      whileHover={{ rotate: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MessageCircle className="h-6 w-6 md:h-8 md:w-8" />
                    </motion.div>
                    <div>
                      <h4 className="text-base md:text-lg font-semibold">WhatsApp</h4>
                      <p className="text-xs md:text-sm opacity-90">+237 693 89 88 67</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </a>
              </motion.div>
            </div>

            <div className="text-center">
              <p className="text-xs md:text-sm text-muted-foreground">
                Nous vous répondrons dans les plus brefs délais !
              </p>
            </div>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {contactInfo.map((item, index) => (
              <motion.div key={index} whileHover={{ scale: 1.02, y: -2 }} transition={{ duration: 0.2 }}>
                <Card className="border-rose-pale/50 hover:border-rose-vif/30 transition-colors hover:shadow-md card-glow">
                  <CardContent className="flex items-center gap-3 md:gap-4 p-4 md:p-6">
                    <motion.div
                      className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-pale/50 to-violet-mauve/10"
                      whileHover={{ rotate: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-sm md:text-base font-medium text-violet-fonce dark:text-rose-pale">
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{item.details}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <motion.a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              <Card className="overflow-hidden border-rose-pale/50 hover:shadow-md transition-all duration-300 card-glow">
                <CardContent className="p-0">
                  <img
                    // src={mapUrl}
                    src="/images/ikhodiMap.png"
                    alt="Carte de la boutique à Yaoundé"
                    width="100%"
                    height="200"
                    className="object-cover"
                  />
                </CardContent>
              </Card>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}