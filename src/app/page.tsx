"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Cpu,
  Monitor,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Globe,
  Zap,
  Users,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Páginas Web para PyMEs",
    description:
      "Creamos sitios web modernos y funcionales para pequeños y medianos negocios. Desde landing pages hasta plataformas completas como la nuestra para clubes deportivos.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Cpu,
    title: "Programas de Automatización",
    description:
      "Automatizamos procesos repetitivos de tu negocio: facturación, inventarios, reportes, mailing y más. Menos trabajo manual, más eficiencia.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Monitor,
    title: "Soporte Técnico y Reparación",
    description:
      "Mantenimiento, reparación y soporte técnico de equipos computacionales. Presencial y remoto, con respuesta rápida y solución efectiva.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Trophy,
    title: "Plataforma para Clubes",
    description:
      "Nuestro producto estrella: SaaS completo para la gestión digital de clubes deportivos con estadísticas, tienda, socios y más.",
    color: "from-emerald-500 to-teal-500",
  },
];

const features = [
  "Perfil del Club personalizable",
  "Estadísticas de jugadores y equipo",
  "Calendario y resultados de partidos",
  "Votación MVP del partido",
  "Fan Zone con predicciones",
  "Gestión de socios",
  "Tienda online",
  "Noticias y galería",
  "Gestión de auspiciadores",
  "Paneles administrativos",
];

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            TOALESCO
          </span>
          <div className="flex items-center gap-4">
            <a
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Iniciar Sesión
            </a>
            <a
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
            >
              Comenzar
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4a4a4a_1px,transparent_1px),linear-gradient(to_bottom,#4a4a4a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />
          <div className="container mx-auto px-4 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-muted-foreground mb-8">
                <Zap className="h-3.5 w-3.5 text-primary" />
                Tecnología al servicio de tu negocio
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                Hacemos realidad tu
                <br />
                <span className="bg-gradient-to-r from-primary via-primary/80 to-blue-500 bg-clip-text text-transparent">
                  proyecto digital
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                En TOALESCO creamos soluciones tecnológicas para PyMEs:
                páginas web, automatización de procesos, soporte técnico
                y una plataforma SaaS para la gestión de clubes deportivos.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <a
                  href="#servicios"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
                >
                  Nuestros servicios
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Acceder a la plataforma
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <motion.section {...fadeIn} className="border-t border-white/5 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "50+", label: "Proyectos entregados" },
                { number: "5+", label: "Años de experiencia" },
                { number: "100%", label: "Satisfacción garantizada" },
                { number: "24/7", label: "Soporte técnico" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Services */}
        <section id="servicios" className="border-t border-white/5 py-24">
          <div className="container mx-auto px-4">
            <motion.div {...fadeIn} className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Lo que hacemos
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Soluciones tecnológicas completas para impulsar tu negocio
              </p>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-2">
              {services.map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 hover:border-white/20 transition-all"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity`}
                  />
                  <div className="relative">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${service.color} mb-4`}
                    >
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Club Platform Feature */}
        <section className="border-t border-white/5 py-24 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent">
          <div className="container mx-auto px-4">
            <motion.div {...fadeIn} className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-muted-foreground mb-6">
                  <Trophy className="h-3.5 w-3.5 text-primary" />
                  Producto destacado
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                  Plataforma SaaS para
                  <br />
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Clubes Deportivos
                  </span>
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Transformá la gestión de tu club con nuestra plataforma todo-en-uno.
                  Cada club tiene su propio sitio web con diseño personalizado, dominio
                  propio y las herramientas que necesita para crecer.
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex gap-4">
                  <a
                    href="/login"
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
                  >
                    Quiero esto para mi club
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-2xl blur-3xl" />
                <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Trophy, label: "Estadísticas" },
                      { icon: Users, label: "Socios" },
                      { icon: Globe, label: "Sitio web propio" },
                      { icon: Zap, label: "En tiempo real" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex flex-col items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-4 text-center"
                      >
                        <item.icon className="h-6 w-6 text-primary" />
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/5 py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.div {...fadeIn}>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                ¿Listo para empezar?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Contactanos y conversemos cómo podemos ayudar a tu negocio
              </p>
              <div className="flex items-center justify-center gap-4">
                <a
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
                >
                  Crear cuenta gratis
                </a>
                <a
                  href="mailto:contacto@toalesco.cl"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Contactar
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            TOALESCO
          </p>
          <p className="text-sm text-muted-foreground">
            Soluciones tecnológicas para PyMEs — Chile
          </p>
        </div>
      </footer>
    </div>
  );
}
