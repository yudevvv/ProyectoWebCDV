"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Users,
  Zap,
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
    color: "from-rose-500 to-pink-600",
    lightBg: "bg-rose-50",
    borderBg: "border-rose-200",
    mailSubject: "Quiero%20una%20p%C3%A1gina%20web%20para%20mi%20negocio",
    cta: "Cotiza tu página web",
  },
  {
    icon: Bot,
    title: "Automatización de Procesos",
    description:
      "Automatizamos tareas repetitivas: facturación, inventarios, reportes y mailing. Menos trabajo manual, más eficiencia para tu negocio.",
    color: "from-blue-500 to-blue-600",
    lightBg: "bg-blue-50",
    borderBg: "border-blue-200",
    mailSubject: "Quiero%20automatizar%20procesos%20de%20mi%20negocio",
    cta: "Cotiza tu automatización",
  },
  {
    icon: Wrench,
    title: "Soporte Técnico y Reparación",
    description:
      "Mantenimiento y reparación de equipos computacionales. Servicio presencial y remoto con respuesta rápida y solución garantizada.",
    color: "from-rose-400 to-rose-600",
    lightBg: "bg-rose-50",
    borderBg: "border-rose-200",
    mailSubject: "Necesito%20soporte%20t%C3%A9cnico%20o%20reparaci%C3%B3n",
    cta: "Agenda una revisión",
  },
  {
    icon: Trophy,
    title: "Plataforma para Clubes",
    description:
      "SaaS completo para la gestión digital de clubes deportivos: estadísticas, tienda online, socios, votación MVP y más. Cada club con su propio sitio.",
    color: "from-blue-500 to-blue-600",
    lightBg: "bg-blue-50",
    borderBg: "border-blue-200",
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

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/70 backdrop-blur-xl border-b border-rose-100/50 shadow-sm"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <span className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-rose-500 to-blue-500 bg-clip-text text-transparent">
              TOALESCO
            </span>
          </span>
          <a
            href="/login"
            className={`inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium transition-all ${
              scrolled
                ? "bg-rose-500 text-white hover:bg-rose-600 shadow-sm"
                : "bg-white/80 text-rose-600 hover:bg-white border border-rose-200"
            }`}
          >
            Iniciar Sesión
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden min-h-[85vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/40 via-white to-blue-50/40" />
          <div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-rose-200/20 blur-[120px]" />
          <div className="absolute bottom-20 -right-32 w-96 h-96 rounded-full bg-blue-200/20 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-100/10 to-blue-100/10 blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

          <div className="container mx-auto px-4 relative py-32">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-sm text-rose-600 mb-8"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Soluciones digitales para PyMEs
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.9] text-gray-900"
              >
                Hacemos realidad
                <br />
                <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-blue-500 bg-clip-text text-transparent">
                  tu proyecto digital
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mx-auto mt-6 max-w-2xl text-lg text-gray-500"
              >
                Creamos páginas web, automatizamos procesos, reparamos equipos
                y desarrollamos plataformas SaaS para clubes deportivos.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-10 flex items-center justify-center gap-4 flex-wrap"
              >
                <a
                  href="#servicios"
                  className="group inline-flex h-12 items-center justify-center rounded-xl bg-rose-500 px-6 text-sm font-medium text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-200/50 hover:shadow-rose-300/50"
                >
                  Ver servicios
                  <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <a
                  href="mailto:toalesco@tutamail.com?subject=Quiero%20m%C3%A1s%20informaci%C3%B3n"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-sm font-medium text-gray-700 hover:border-rose-200 hover:text-rose-600 transition-all shadow-sm"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contáctanos
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-rose-100/50 bg-rose-50/30 py-14">
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
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-br from-rose-500 to-blue-500 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
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
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Nuestros servicios
              </h2>
              <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
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
                  className={`group relative overflow-hidden rounded-2xl border ${service.borderBg} ${service.lightBg} p-8 hover:shadow-lg transition-all`}
                >
                  <div
                    className={`absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br ${service.color} opacity-[0.03] blur-3xl group-hover:opacity-[0.06] transition-opacity`}
                  />
                  <div className="relative">
                    <div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} mb-5 shadow-sm`}
                    >
                      <service.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <a
                      href={`mailto:toalesco@tutamail.com?subject=${service.mailSubject}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-500 hover:text-rose-600 underline-offset-4"
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
        <section className="relative overflow-hidden py-32 bg-blue-50/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid gap-16 lg:grid-cols-2 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-600 mb-6">
                    <Trophy className="h-3.5 w-3.5" />
                    Producto destacado
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                    Plataforma SaaS para
                    <br />
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                      Clubes Deportivos
                    </span>
                  </h2>
                  <p className="text-lg text-gray-500 leading-relaxed mb-8">
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
                        className="flex items-center gap-2.5 text-sm text-gray-600"
                      >
                        <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-3 w-3 text-blue-500" />
                        </div>
                        <span>{f}</span>
                      </motion.div>
                    ))}
                  </div>
                  <a
                    href="mailto:toalesco@tutamail.com?subject=Quiero%20la%20plataforma%20para%20mi%20club%20deportivo"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-200/50 transition-all shadow-md"
                  >
                    Quiero esto para mi club
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-transparent to-rose-200/30 rounded-3xl blur-3xl" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-2xl border border-blue-100 bg-white p-8 shadow-sm"
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
                          className="rounded-xl border border-gray-100 bg-gray-50/50 p-5 text-center hover:border-blue-100 hover:bg-blue-50/50 transition-all"
                        >
                          <item.icon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <p className="font-semibold text-sm text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
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
        <motion.section {...fadeUp} className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-3">
              Equipo
            </h2>
            <p className="text-gray-500 text-sm mb-10 max-w-md mx-auto">
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
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-rose-100 via-white to-blue-100 flex items-center justify-center text-lg font-bold text-rose-500 mb-3 border border-rose-200">
                    {member.initials}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section {...fadeUp} className="relative overflow-hidden py-32 bg-gradient-to-br from-rose-50/50 via-white to-blue-50/50">
          <div className="container mx-auto px-4 text-center relative">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-8 text-lg">
              Cuéntanos tu idea y te ayudamos a hacerla realidad
            </p>
            <a
              href="mailto:toalesco@tutamail.com?subject=Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20TOALESCO"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-rose-500 px-8 text-sm font-medium text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-200/50 hover:shadow-rose-300/50"
            >
              <Mail className="mr-2 h-4 w-4" />
              Escríbenos
            </a>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-bold bg-gradient-to-r from-rose-500 to-blue-500 bg-clip-text text-transparent mb-2">
            TOALESCO
          </p>
          <p className="text-sm text-gray-500 mb-1">
            Soluciones tecnológicas para PyMEs — Chile
          </p>
          <a
            href="mailto:toalesco@tutamail.com"
            className="text-xs text-gray-400 hover:text-rose-500 transition-colors"
          >
            toalesco@tutamail.com
          </a>
        </div>
      </footer>
    </div>
  );
}
