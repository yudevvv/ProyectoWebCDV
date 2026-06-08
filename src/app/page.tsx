"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  Monitor,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Globe,
  Zap,
  Users,
  Mail,
  Sparkles,
  Wrench,
  Bot,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Páginas Web para PyMEs",
    description:
      "Creamos sitios web modernos y funcionales para pequeños y medianos negocios. Desde landing pages hasta plataformas completas.",
    color: "from-blue-500 to-cyan-500",
    mailSubject: "Quiero%20una%20p%C3%A1gina%20web%20para%20mi%20negocio",
    cta: "Cotiza tu página web",
  },
  {
    icon: Bot,
    title: "Programas de Automatización",
    description:
      "Automatizamos procesos repetitivos de tu negocio: facturación, inventarios, reportes, mailing y más. Menos trabajo manual, más eficiencia.",
    color: "from-purple-500 to-pink-500",
    mailSubject: "Quiero%20automatizar%20procesos%20de%20mi%20negocio",
    cta: "Cotiza tu automatización",
  },
  {
    icon: Wrench,
    title: "Soporte Técnico y Reparación",
    description:
      "Mantenimiento, reparación y soporte técnico de equipos computacionales. Presencial y remoto, con respuesta rápida y solución efectiva.",
    color: "from-orange-500 to-red-500",
    mailSubject: "Necesito%20soporte%20t%C3%A9cnico%20o%20reparaci%C3%B3n",
    cta: "Agenda una revisión",
  },
  {
    icon: Trophy,
    title: "Plataforma para Clubes",
    description:
      "Nuestro producto estrella: SaaS completo para la gestión digital de clubes deportivos con estadísticas, tienda, socios y más.",
    color: "from-emerald-500 to-teal-500",
    mailSubject: "Quiero%20la%20plataforma%20para%20mi%20club%20deportivo",
    cta: "Quiero esto para mi club",
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

const team = [
  { name: "Ignacio Colun", role: "Fundador" },
  { name: "Felipe Aguayo", role: "Desarrollador" },
  { name: "Alejandro Peña", role: "Desarrollador" },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay: i * 0.1 },
});

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
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4a4a4a_1px,transparent_1px),linear-gradient(to_bottom,#4a4a4a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-500/5 blur-[80px] animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-purple-500/5 blur-[80px] animate-pulse [animation-delay:2s]" />
          <div className="container mx-auto px-4 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-muted-foreground mb-8"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Tecnología al servicio de tu negocio
              </motion.div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                Hacemos realidad tu
                <br />
                <span className="bg-gradient-to-r from-primary via-primary/80 to-blue-500 bg-clip-text text-transparent">
                  proyecto digital
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
              >
                En TOALESCO creamos soluciones tecnológicas para PyMEs:
                páginas web, automatización de procesos, soporte técnico
                y una plataforma SaaS para la gestión de clubes deportivos.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-10 flex items-center justify-center gap-4"
              >
                <a
                  href="#servicios"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  Nuestros servicios
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="mailto:contacto@toalesco.cl?subject=Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20TOALESCO"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium hover:bg-muted transition-colors"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contáctanos
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <motion.section {...fadeUp} className="border-y border-white/5 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "15+", label: "Proyectos entregados" },
                { number: "2+", label: "Años de experiencia" },
                { number: "100%", label: "Satisfacción garantizada" },
                { number: "24/7", label: "Soporte técnico" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Services */}
        <section id="servicios" className="border-b border-white/5 py-24">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-16">
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
                  {...stagger(i)}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 hover:border-white/20 transition-all hover:shadow-xl"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
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
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <a
                      href={`mailto:contacto@toalesco.cl?subject=${service.mailSubject}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4"
                    >
                      {service.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Club Platform Feature */}
        <section className="border-b border-white/5 py-24 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp}>
              <div className="grid gap-12 lg:grid-cols-2 items-center">
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
                    Transformá la gestión de tu club con nuestra plataforma
                    todo-en-uno. Cada club tiene su propio sitio web con diseño
                    personalizado, dominio propio y las herramientas que necesita
                    para crecer.
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {features.map((f, i) => (
                      <motion.div
                        key={f}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span>{f}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-8 flex gap-4">
                    <a
                      href="mailto:contacto@toalesco.cl?subject=Quiero%20la%20plataforma%20para%20mi%20club%20deportivo"
                      className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-all hover:shadow-lg hover:shadow-primary/25"
                    >
                      Quiero esto para mi club
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-2xl blur-3xl" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-8"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Trophy, label: "Estadísticas" },
                        { icon: Users, label: "Socios" },
                        { icon: Globe, label: "Sitio web propio" },
                        { icon: Zap, label: "En tiempo real" },
                      ].map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                          className="flex flex-col items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-4 text-center hover:border-white/10 transition-colors"
                        >
                          <item.icon className="h-6 w-6 text-primary" />
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team */}
        <motion.section {...fadeUp} className="border-b border-white/5 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-8">
              Equipo
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mx-auto mb-2 flex items-center justify-center text-lg font-bold text-primary">
                    {member.name.charAt(0)}
                  </div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <section className="border-b border-white/5 py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.div {...fadeUp}>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                ¿Listo para empezar?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Contáctanos y conversemos cómo podemos ayudar a tu negocio
              </p>
              <div className="flex items-center justify-center gap-4">
                <a
                  href="mailto:contacto@toalesco.cl?subject=Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20TOALESCO"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Escríbenos
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            TOALESCO
          </p>
          <p className="text-sm text-muted-foreground mb-1">
            Soluciones tecnológicas para PyMEs — Chile
          </p>
          <p className="text-xs text-muted-foreground">
            <a href="mailto:contacto@toalesco.cl" className="hover:text-primary transition-colors">
              contacto@toalesco.cl
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
