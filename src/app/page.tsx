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
  Wrench,
  Bot,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Páginas Web para PyMEs",
    description:
      "Creamos sitios web modernos para pequeños y medianos negocios. Desde landing pages hasta plataformas completas con diseño único.",
    color: "from-sky-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    mailSubject: "Quiero%20una%20p%C3%A1gina%20web%20para%20mi%20negocio",
    cta: "Cotiza tu página web",
  },
  {
    icon: Bot,
    title: "Automatización de Procesos",
    description:
      "Automatizamos tareas repetitivas: facturación, inventarios, reportes y mailing. Menos trabajo manual, más eficiencia para tu negocio.",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    mailSubject: "Quiero%20automatizar%20procesos%20de%20mi%20negocio",
    cta: "Cotiza tu automatización",
  },
  {
    icon: Wrench,
    title: "Soporte Técnico y Reparación",
    description:
      "Mantenimiento y reparación de equipos computacionales. Servicio presencial y remoto con respuesta rápida y solución garantizada.",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    mailSubject: "Necesito%20soporte%20t%C3%A9cnico%20o%20reparaci%C3%B3n",
    cta: "Agenda una revisión",
  },
  {
    icon: Trophy,
    title: "Plataforma para Clubes",
    description:
      "SaaS completo para la gestión digital de clubes deportivos: estadísticas, tienda online, socios, votación MVP y más. Cada club con su propio sitio.",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
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
  { name: "Ignacio Colun", role: "Fundador", initials: "IC" },
  { name: "Felipe Aguayo", role: "Desarrollador", initials: "FA" },
  { name: "Alejandro Peña", role: "Desarrollador", initials: "AP" },
];

const stats = [
  { number: "15+", label: "Proyectos entregados" },
  { number: "2+", label: "Años de experiencia" },
  { number: "100%", label: "Satisfacción" },
  { number: "24/7", label: "Soporte técnico" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
            TOALESCO
          </span>
          <a
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
          >
            Iniciar Sesión
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-500/5 blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem]" />

          <div className="container mx-auto px-4 relative py-32">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-8"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Soluciones digitales para PyMEs
              </motion.div>
              <motion.h1
                variants={itemVariants}
                className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.9]"
              >
                Hacemos realidad
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  tu proyecto digital
                </span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
              >
                Creamos páginas web, automatizamos procesos, reparamos equipos
                y desarrollamos plataformas SaaS para clubes deportivos.
                Todo lo que tu negocio necesita en un solo lugar.
              </motion.p>
              <motion.div
                variants={itemVariants}
                className="mt-10 flex items-center justify-center gap-4 flex-wrap"
              >
                <a
                  href="#servicios"
                  className="group inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  Ver servicios
                  <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <a
                  href="mailto:contacto@toalesco.cl?subject=Quiero%20m%C3%A1s%20informaci%C3%B3n"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-medium hover:bg-white/10 transition-all"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contáctanos
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-white/5 py-14">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="servicios" className="py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Nuestros servicios
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
                Soluciones tecnológicas diseñadas para impulsar tu negocio
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {services.map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`group relative overflow-hidden rounded-2xl border ${service.borderColor} ${service.bgColor} p-8 hover:shadow-xl transition-all`}
                >
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${service.color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`}
                  />
                  <div className="relative">
                    <div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} mb-5 shadow-lg`}
                    >
                      <service.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <a
                      href={`mailto:contacto@toalesco.cl?subject=${service.mailSubject}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline underline-offset-4 text-primary"
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

        {/* Club Platform Deep Dive */}
        <section className="relative overflow-hidden py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid gap-16 lg:grid-cols-2 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400 mb-6">
                    <Trophy className="h-3.5 w-3.5" />
                    Producto destacado
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    Plataforma SaaS para
                    <br />
                    <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      Clubes Deportivos
                    </span>
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Transformá la gestión de tu club con nuestra plataforma
                    todo-en-uno. Cada club tiene su propio sitio web con diseño
                    personalizado, dominio propio y todas las herramientas
                    necesarias para crecer.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {features.map((f, i) => (
                      <motion.div
                        key={f}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        </div>
                        <span>{f}</span>
                      </motion.div>
                    ))}
                  </div>
                  <a
                    href="mailto:contacto@toalesco.cl?subject=Quiero%20la%20plataforma%20para%20mi%20club%20deportivo"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 text-sm font-medium text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                  >
                    Quiero esto para mi club
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent rounded-3xl blur-3xl" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-8 backdrop-blur-sm"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Trophy, label: "Estadísticas", desc: "Rendimiento en vivo" },
                        { icon: Users, label: "Socios", desc: "Gestión completa" },
                        { icon: Globe, label: "Sitio web", desc: "Diseño único" },
                        { icon: Zap, label: "Tiempo real", desc: "Resultados al instante" },
                      ].map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                          className="rounded-xl border border-white/5 bg-white/[0.02] p-5 text-center hover:border-white/10 transition-all"
                        >
                          <item.icon className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                          <p className="font-semibold text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.desc}
                          </p>
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
        <section className="border-t border-white/5 py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold tracking-tight mb-3">
                Equipo
              </h2>
              <p className="text-muted-foreground text-sm mb-10 max-w-md mx-auto">
                Los que hacemos posible TOALESCO
              </p>
              <div className="flex flex-wrap items-center justify-center gap-10">
                {team.map((member, i) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 via-purple-500/10 to-blue-500/20 flex items-center justify-center text-lg font-bold text-primary mb-3 border border-white/10">
                      {member.initials}
                    </div>
                    <p className="text-sm font-semibold">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="container mx-auto px-4 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                ¿Listo para empezar?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-lg">
                Cuéntanos tu idea y te ayudamos a hacerla realidad
              </p>
              <a
                href="mailto:contacto@toalesco.cl?subject=Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20TOALESCO"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                <Mail className="mr-2 h-4 w-4" />
                Escríbenos
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-bold bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            TOALESCO
          </p>
          <p className="text-sm text-muted-foreground mb-1">
            Soluciones tecnológicas para PyMEs — Chile
          </p>
          <a
            href="mailto:contacto@toalesco.cl"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            contacto@toalesco.cl
          </a>
        </div>
      </footer>
    </div>
  );
}
