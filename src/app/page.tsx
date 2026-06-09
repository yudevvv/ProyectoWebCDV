"use client";

import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Páginas Web para PyMEs",
    description:
      "Creamos sitios web modernos para pequeños y medianos negocios. Desde landing pages hasta plataformas completas con diseño único.",
    code: "import { Site } from 'toalesco'",
    href: "#web",
    mailSubject: "Quiero%20una%20p%C3%A1gina%20web%20para%20mi%20negocio",
    cta: "Cotiza tu página web",
  },
  {
    icon: Bot,
    title: "Automatización de Procesos",
    description:
      "Automatizamos tareas repetitivas: facturación, inventarios, reportes y mailing. Menos trabajo manual, más eficiencia.",
    code: "pipeline = workflow.auto()",
    href: "#automation",
    mailSubject: "Quiero%20automatizar%20procesos%20de%20mi%20negocio",
    cta: "Cotiza tu automatización",
  },
  {
    icon: Wrench,
    title: "Soporte Técnico y Reparación",
    description:
      "Mantenimiento y reparación de equipos computacionales. Servicio presencial y remoto con respuesta rápida y solución garantizada.",
    code: "status: online · ping 12ms",
    href: "#soporte",
    mailSubject: "Necesito%20soporte%20t%C3%A9cnico%20o%20reparaci%C3%B3n",
    cta: "Agenda una revisión",
  },
  {
    icon: Trophy,
    title: "Plataforma para Clubes",
    description:
      "SaaS completo para la gestión digital de clubes deportivos: estadísticas, tienda online, socios, votación MVP y más.",
    code: "<Club theme='custom' />",
    href: "#clubes",
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

const navLinks = [
  { label: "paginas-web", href: "#web" },
  { label: "automatizaciones", href: "#automation" },
  { label: "soporte", href: "#soporte" },
  { label: "saas-clubes", href: "#clubes" },
];

function StaticNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const dots: { x: number; y: number }[] = [];
    for (let i = 0; i < 30; i++) {
      dots.push({ x: Math.random() * w, y: Math.random() * h });
    }

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(8, 145, 178, ${(1 - dist / 200) * 0.1})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(dots[i].x, dots[i].y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(8, 145, 178, 0.3)";
      ctx.fill();
    }
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

function TypingStatus() {
  const [text, setText] = useState("");
  const fullText = "toalesco.services — status: online";
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setText(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(interval);
    }, 40);
    const cursorInterval = setInterval(() => setCursor((c) => !c), 530);
    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <span className="font-mono tracking-wide">
      {text}
      {cursor && text.length < fullText.length ? <span className="text-[#0891b2]">_</span> : null}
    </span>
  );
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[60] opacity-[0.012]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(8,145,178,0.08) 1px, rgba(8,145,178,0.08) 2px)",
          backgroundSize: "100% 2px",
        }}
      />

      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-white/80 backdrop-blur-2xl border-b border-gray-200"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <span className="text-xl font-bold tracking-tight text-slate-900 shrink-0">
            TOALESCO
          </span>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative px-3 py-1.5 text-xs font-mono text-slate-500 hover:text-[#0891b2] transition-colors"
              >
                {hoveredLink === link.label ? (
                  <span className="text-[#0891b2]">{">"} /{link.label}</span>
                ) : (
                  <span>/{link.label}</span>
                )}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <span className="flex items-center gap-2 text-[10px] font-mono text-slate-400 tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]" />
              </span>
              SYS_STATUS: OPERANDO 24/7
            </span>
            <a
              href="/login"
              className="inline-flex items-center gap-1 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
            >
              <span className="text-slate-300">[</span>
              <span>Iniciar_Sesión</span>
              <span className="text-slate-300">]</span>
            </a>
            <a
              href="mailto:toalesco@tutamail.com?subject=Quiero%20m%C3%A1s%20informaci%C3%B3n"
              className="inline-flex h-8 items-center justify-center rounded-md border border-[#0891b2]/40 bg-[#0891b2]/5 px-3 text-[11px] font-mono font-medium text-[#0891b2] hover:bg-[#0891b2]/10 hover:border-[#0891b2]/60 transition-all"
            >
              EJECUTAR_CONTACTO
              <ArrowRight className="ml-1.5 h-3 w-3" />
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block h-px w-5 bg-slate-500 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[2.5px]" : ""}`} />
            <span className={`block h-px w-5 bg-slate-500 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-slate-500 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[2.5px]" : ""}`} />
          </button>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-2xl"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-mono text-slate-500 hover:text-[#0891b2] transition-colors py-1.5"
                >
                  {">"} /{link.label}
                </a>
              ))}
              <div className="border-t border-gray-200 pt-3 mt-1 flex flex-col gap-3">
                <span className="flex items-center gap-2 text-[10px] font-mono text-slate-400 tracking-wider uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]" />
                  </span>
                  SYS_STATUS: OPERANDO 24/7
                </span>
                <a
                  href="/login"
                  className="text-sm font-mono text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <span className="text-slate-300">[</span> Iniciar_Sesión <span className="text-slate-300">]</span>
                </a>
                <a
                  href="mailto:toalesco@tutamail.com?subject=Quiero%20m%C3%A1s%20informaci%C3%B3n"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-[#0891b2]/40 bg-[#0891b2]/5 px-3 text-xs font-mono font-medium text-[#0891b2] hover:bg-[#0891b2]/10 hover:border-[#0891b2]/60 transition-all w-fit"
                >
                  EJECUTAR_CONTACTO <ArrowRight className="ml-1.5 h-3 w-3" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-white">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0891b2]/[0.02] via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#0891b2]/[0.04] blur-[150px]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(0deg, #cbd5e1 1px, transparent 1px)",
              backgroundSize: "100% 40px",
            }}
          />
          <StaticNetwork />

          <div className="container mx-auto px-4 relative z-10 py-32">
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
                className="inline-flex items-center gap-2 rounded-lg border border-[#0891b2]/20 bg-[#0891b2]/5 px-4 py-1.5 text-sm text-[#0891b2] mb-8 font-mono"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-pulse shadow-[0_0_4px_#059669]" />
                <TypingStatus />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.9] text-slate-900"
              >
                Hacemos realidad
                <br />
                <span className="text-[#0891b2]">tu proyecto digital</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mx-auto mt-6 max-w-2xl text-lg text-slate-500"
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
                  className="group inline-flex h-12 items-center justify-center rounded-lg bg-[#0891b2] px-6 text-sm font-medium text-white hover:bg-[#0891b2]/90 transition-all shadow-[0_0_16px_rgba(8,145,178,0.2)] hover:shadow-[0_0_24px_rgba(8,145,178,0.3)]"
                >
                  Ver servicios
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <a
                  href="mailto:toalesco@tutamail.com?subject=Quiero%20m%C3%A1s%20informaci%C3%B3n"
                  className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 hover:border-[#0891b2]/30 hover:text-[#0891b2] transition-all"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contáctanos
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-slate-200 bg-slate-50 py-14">
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
                  <div className="text-3xl md:text-4xl font-black text-[#0891b2]">{stat.number}</div>
                  <div className="mt-1 text-sm text-slate-500 font-mono text-xs">{stat.label.toUpperCase()}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="servicios" className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Nuestros servicios</h2>
              <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg font-mono text-sm tracking-wide">
                $ ls -la /toalesco/services/
              </p>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-2 max-w-5xl mx-auto">
              {services.map((service, i) => (
                <motion.div
                  key={service.title}
                  id={service.href.replace("#", "")}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-xl bg-slate-50 border border-slate-200 p-8 hover:border-[#0891b2]/30 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(8,145,178,0.015)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:bg-[position:100%_100%] transition-all duration-700" />
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#0891b2]/[0.02] blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white border border-slate-200 group-hover:border-[#0891b2]/20 transition-all">
                        <service.icon className="h-5 w-5 text-[#0891b2]" />
                      </div>
                      <span className="text-xs text-slate-400 font-mono tracking-wide">
                        <span className="text-[#0891b2]">{">"}</span> {service.code}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">{service.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6">{service.description}</p>
                    <a
                      href={`mailto:toalesco@tutamail.com?subject=${service.mailSubject}`}
                      className="inline-flex items-center gap-1.5 text-sm font-mono font-medium text-[#0891b2] hover:text-[#0891b2]/70 transition-colors"
                    >
                      <span className="text-slate-300">$</span> {service.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Club Platform */}
        <section id="clubes" className="relative overflow-hidden py-32 bg-slate-50">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0891b2]/[0.015] via-transparent to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid gap-16 lg:grid-cols-2 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500 mb-6 font-mono tracking-wide">
                    <span className="text-[#059669]">$</span> ./producto_destacado --feature clubes
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
                    Plataforma SaaS para
                    <br />
                    <span className="text-[#0891b2]">Clubes Deportivos</span>
                  </h2>
                  <p className="text-lg text-slate-500 leading-relaxed mb-8">
                    Transformá la gestión de tu club con nuestra plataforma todo-en-uno.
                    Cada club tiene su propio sitio web con diseño personalizado,
                    dominio propio y todas las herramientas necesarias para crecer.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {features.map((f, i) => (
                      <motion.div
                        key={f}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                        className="flex items-center gap-2.5 text-sm text-slate-600"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#0891b2] shrink-0" />
                        <span className="font-mono text-xs">{f}</span>
                      </motion.div>
                    ))}
                  </div>
                  <a
                    href="mailto:toalesco@tutamail.com?subject=Quiero%20la%20plataforma%20para%20mi%20club%20deportivo"
                    className="group inline-flex h-12 items-center justify-center rounded-lg bg-[#0891b2] px-6 text-sm font-medium text-white hover:bg-[#0891b2]/90 transition-all shadow-[0_0_16px_rgba(8,145,178,0.15)]"
                  >
                    Quiero esto para mi club
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0891b2]/[0.03] via-transparent to-transparent rounded-2xl blur-3xl" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-xl border border-slate-200 bg-white p-8"
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
                          className="rounded-lg border border-slate-100 bg-slate-50 p-5 text-center hover:border-[#0891b2]/20 hover:bg-[#0891b2]/[0.01] transition-all"
                        >
                          <item.icon className="h-8 w-8 text-[#0891b2] mx-auto mb-2" />
                          <p className="font-semibold text-sm text-slate-900">{item.label}</p>
                          <p className="text-xs text-slate-400 mt-0.5 font-mono">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Terminal output */}
        <section className="py-12 bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-xs font-mono text-slate-400 space-y-2 leading-relaxed">
                <p><span className="text-[#059669]">$</span> cat /toalesco/metrics.txt</p>
                <p className="text-slate-300">Proyectos entregados: <span className="text-[#0891b2]">15+</span></p>
                <p className="text-slate-300">Tiempo operativo: <span className="text-[#059669]">99.9%</span></p>
                <p className="text-slate-300">Soporte: <span className="text-[#059669]">24/7 activo</span></p>
                <p className="text-slate-300">Estado: <span className="text-[#059669]">✅ online</span></p>
                <p><span className="text-[#059669]">$</span> <span className="animate-pulse text-slate-400">_</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">Equipo</h2>
              <p className="text-slate-500 text-sm mb-10 max-w-md mx-auto font-mono">$ cat /toalesco/team.json</p>
              <div className="flex flex-wrap items-center justify-center gap-12">
                {team.map((member, i) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex flex-col items-center group"
                  >
                    <div className="h-16 w-16 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-lg font-bold text-[#0891b2] mb-3 group-hover:border-[#0891b2]/40 transition-all">
                      {member.initials}
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{member.role}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Instagram */}
        <section className="relative overflow-hidden py-24 bg-slate-50">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0891b2]/[0.015] via-transparent to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
                  <span className="text-[#059669]">$</span> curl -s https://instagram.com/toalesco
                  <span className="animate-pulse text-[#0891b2]">_</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center shrink-0">
                    <svg className="h-10 w-10 text-[#0891b2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-lg font-semibold text-slate-900 mb-1">@toalesco</p>
                    <p className="text-sm text-slate-500 mb-4 font-mono text-xs">
                      Desarrollo web · Automatización · Soporte técnico · SaaS para clubes
                    </p>
                    <a
                      href="https://instagram.com/toalesco"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-mono text-[#0891b2] hover:text-[#0891b2]/70 border border-[#0891b2]/30 bg-[#0891b2]/5 px-4 py-2 rounded-lg transition-all hover:border-[#0891b2]/50"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      SEGUIR_EN_INSTAGRAM &gt;
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-32 bg-white">
          <div className="container mx-auto px-4 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">¿Listo para empezar?</h2>
              <p className="text-slate-500 max-w-xl mx-auto mb-8 text-lg">Cuéntanos tu idea y te ayudamos a hacerla realidad</p>
              <a
                href="mailto:toalesco@tutamail.com?subject=Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20TOALESCO"
                className="group inline-flex h-12 items-center justify-center rounded-lg bg-[#0891b2] px-8 text-sm font-medium text-white hover:bg-[#0891b2]/90 transition-all shadow-[0_0_16px_rgba(8,145,178,0.2)]"
              >
                <Mail className="mr-2 h-4 w-4" />
                Escríbenos
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-bold text-slate-900 mb-2">TOALESCO</p>
          <p className="text-sm text-slate-500 mb-1 font-mono text-xs">Soluciones tecnológicas para PyMEs — Chile</p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 font-mono">
            <a href="mailto:toalesco@tutamail.com" className="hover:text-[#0891b2] transition-colors">
              toalesco@tutamail.com
            </a>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]" />
              </span>
              Soporte Operando 24/7
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
