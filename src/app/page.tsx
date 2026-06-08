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

function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots: { x: number; y: number; vx: number; vy: number }[] = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseleave", () => { mouse.x = -1000; mouse.y = -1000; });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((dot) => {
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        if (Math.abs(dx) < 200 && Math.abs(dy) < 200) {
          dot.x += (dx > 0 ? 1 : -1) * 0.2;
          dot.y += (dy > 0 ? 1 : -1) * 0.2;
        }
      });
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(0, 210, 255, ${(1 - dist / 180) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(dots[i].x, dots[i].y, 1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 210, 255, 0.3)";
        ctx.fill();
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", () => {});
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />;
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
      {cursor && text.length < fullText.length ? <span className="text-[#00D2FF]">_</span> : null}
    </span>
  );
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[60] opacity-[0.015]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,210,255,0.15) 1px, rgba(0,210,255,0.15) 2px)",
          backgroundSize: "100% 2px",
        }}
      />

      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/[0.04]"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <span className="text-xl font-bold tracking-tight text-white shrink-0">
            TOALESCO
          </span>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative px-3 py-1.5 text-xs font-mono text-[#8A9AAB] hover:text-[#00D2FF] transition-colors"
              >
                {hoveredLink === link.label ? (
                  <span>{">"} /{link.label}</span>
                ) : (
                  <span>/{link.label}</span>
                )}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Uptime indicator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-[#8A9AAB] tracking-wider uppercase"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676] shadow-[0_0_6px_#00E676]" />
              </span>
              SYS_STATUS: OPERANDO 24/7
            </motion.div>

            {/* [ Iniciar_Sesión ] */}
            <a
              href="/login"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-[#8A9AAB] hover:text-[#EDEDED] transition-colors"
            >
              <span className="text-[#5a6a7a]">[</span>
              <span>Iniciar_Sesión</span>
              <span className="text-[#5a6a7a]">]</span>
            </a>

            {/* EJECUTAR_CONTACTO > */}
            <a
              href="mailto:toalesco@tutamail.com?subject=Quiero%20m%C3%A1s%20informaci%C3%B3n"
              className="inline-flex h-8 items-center justify-center rounded-md border border-[#00D2FF]/30 bg-[#00D2FF]/5 px-3 text-[11px] font-mono font-medium text-[#00D2FF] hover:bg-[#00D2FF]/10 hover:border-[#00D2FF]/50 transition-all"
            >
              EJECUTAR_CONTACTO
              <ArrowRight className="ml-1.5 h-3 w-3" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00d2ff]/[0.02] via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#00d2ff]/[0.03] blur-[150px]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D2FF]/20 to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(0deg, transparent 24%, rgba(0,210,255,0.03) 25%, rgba(0,210,255,0.03) 26%, transparent 27%, transparent 74%, rgba(0,210,255,0.03) 75%, rgba(0,210,255,0.03) 76%, transparent 77%, transparent)",
              backgroundSize: "100% 50px",
              animation: "drift 20s linear infinite",
            }}
          />
          <ParticleNetwork />

          <div className="container mx-auto px-4 relative z-20 py-32">
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
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-1.5 text-sm text-[#8A9AAB] mb-8"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_6px_#00E676]" />
                <TypingStatus />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.9] text-[#EDEDED] group"
              >
                <span className="relative inline-block">
                  Hacemos realidad
                  <br />
                  <span className="text-[#00D2FF] relative">
                    tu proyecto digital
                    <span className="absolute inset-0 bg-[#00D2FF]/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </span>
                </span>
                <span
                  className="absolute inset-0 text-[#00D2FF] opacity-0 group-hover:opacity-30 transition-all duration-200 pointer-events-none"
                  style={{ clipPath: "inset(20% 0 40% 0)", transform: "translate(-2px, -2px)" }}
                  aria-hidden
                >
                  Hacemos realidad<br />tu proyecto digital
                </span>
                <span
                  className="absolute inset-0 text-[#00D2FF] opacity-0 group-hover:opacity-30 transition-all duration-200 pointer-events-none"
                  style={{ clipPath: "inset(50% 0 10% 0)", transform: "translate(2px, 2px)" }}
                  aria-hidden
                >
                  Hacemos realidad<br />tu proyecto digital
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mx-auto mt-6 max-w-2xl text-lg text-[#8A9AAB]"
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
                  className="group inline-flex h-12 items-center justify-center rounded-lg bg-[#00D2FF] px-6 text-sm font-medium text-black hover:bg-[#00D2FF]/90 transition-all shadow-[0_0_20px_#00D2FF]/20 hover:shadow-[0_0_30px_#00D2FF]/40"
                >
                  Ver servicios
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <a
                  href="mailto:toalesco@tutamail.com?subject=Quiero%20m%C3%A1s%20informaci%C3%B3n"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] px-6 text-sm font-medium text-[#EDEDED] hover:bg-white/[0.06] hover:border-[#00D2FF]/30 transition-all"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contáctanos
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-white/[0.04] bg-[#111111] py-14">
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
                  <div className="text-3xl md:text-4xl font-black text-[#EDEDED]">{stat.number}</div>
                  <div className="mt-1 text-sm text-[#8A9AAB]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="servicios" className="py-32 bg-black">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#EDEDED]">Nuestros servicios</h2>
              <p className="mt-4 text-[#8A9AAB] max-w-2xl mx-auto text-lg">
                Soluciones tecnológicas diseñadas para impulsar tu negocio
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
                  className="group relative overflow-hidden rounded-xl bg-[#111111] border border-white/[0.04] p-8 hover:border-[#00D2FF]/20 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,210,255,0.01)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:bg-[position:100%_100%] transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00D2FF]/[0.01] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#00D2FF]/[0.015] blur-3xl group-hover:bg-[#00D2FF]/[0.03] transition-all duration-700" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06] group-hover:border-[#00D2FF]/20 transition-all">
                        <service.icon className="h-5 w-5 text-[#00D2FF]" />
                      </div>
                      <span className="text-xs text-[#8A9AAB] font-mono tracking-wide">
                        {">"} {service.code}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#EDEDED] mb-3">{service.title}</h3>
                    <p className="text-sm text-[#8A9AAB] leading-relaxed mb-6">{service.description}</p>
                    <a
                      href={`mailto:toalesco@tutamail.com?subject=${service.mailSubject}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00D2FF] hover:text-[#00D2FF]/80 transition-colors"
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

        {/* Club Platform */}
        <section id="clubes" className="relative overflow-hidden py-32 bg-[#111111]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00D2FF]/[0.01] via-transparent to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D2FF]/10 to-transparent" />
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid gap-16 lg:grid-cols-2 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-sm text-[#8A9AAB] mb-6 font-mono tracking-wide">
                    <span className="text-[#00E676] text-xs">$</span> producto_destacado --feature=clubes
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#EDEDED] mb-6">
                    Plataforma SaaS para
                    <br />
                    <span className="text-[#00D2FF] relative">
                      Clubes Deportivos
                      <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-[#00D2FF]/50 to-transparent" />
                    </span>
                  </h2>
                  <p className="text-lg text-[#8A9AAB] leading-relaxed mb-8">
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
                        className="flex items-center gap-2.5 text-sm text-[#8A9AAB]"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#00D2FF] shrink-0" />
                        <span>{f}</span>
                      </motion.div>
                    ))}
                  </div>
                  <a
                    href="mailto:toalesco@tutamail.com?subject=Quiero%20la%20plataforma%20para%20mi%20club%20deportivo"
                    className="group inline-flex h-12 items-center justify-center rounded-lg bg-[#00D2FF] px-6 text-sm font-medium text-black hover:bg-[#00D2FF]/90 transition-all shadow-[0_0_20px_#00D2FF]/20 hover:shadow-[0_0_30px_#00D2FF]/40"
                  >
                    Quiero esto para mi club
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00D2FF]/[0.03] via-transparent to-transparent rounded-2xl blur-3xl" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-xl border border-white/[0.04] bg-black p-8"
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
                          className="rounded-lg border border-white/[0.04] bg-[#111111] p-5 text-center hover:border-[#00D2FF]/10 hover:bg-[#00D2FF]/[0.01] transition-all"
                        >
                          <item.icon className="h-8 w-8 text-[#00D2FF] mx-auto mb-2" />
                          <p className="font-semibold text-sm text-[#EDEDED]">{item.label}</p>
                          <p className="text-xs text-[#8A9AAB] mt-0.5">{item.desc}</p>
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
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold tracking-tight text-[#EDEDED] mb-3">Equipo</h2>
              <p className="text-[#8A9AAB] text-sm mb-10 max-w-md mx-auto">Los que hacemos posible TOALESCO</p>
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
                    <div className="h-16 w-16 rounded-full bg-[#111111] border border-white/[0.06] flex items-center justify-center text-lg font-bold text-[#00D2FF] mb-3 group-hover:border-[#00D2FF]/20 group-hover:shadow-[0_0_15px_#00D2FF]/10 transition-all">
                      {member.initials}
                    </div>
                    <p className="text-sm font-semibold text-[#EDEDED]">{member.name}</p>
                    <p className="text-xs text-[#8A9AAB]">{member.role}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-32 bg-[#111111]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#00D2FF]/[0.03] blur-[150px]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D2FF]/10 to-transparent" />
          <div className="container mx-auto px-4 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#EDEDED] mb-4">¿Listo para empezar?</h2>
              <p className="text-[#8A9AAB] max-w-xl mx-auto mb-8 text-lg">Cuéntanos tu idea y te ayudamos a hacerla realidad</p>
              <a
                href="mailto:toalesco@tutamail.com?subject=Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20TOALESCO"
                className="group inline-flex h-12 items-center justify-center rounded-lg bg-[#00D2FF] px-8 text-sm font-medium text-black hover:bg-[#00D2FF]/90 transition-all shadow-[0_0_20px_#00D2FF]/20 hover:shadow-[0_0_30px_#00D2FF]/40"
              >
                <Mail className="mr-2 h-4 w-4" />
                Escríbenos
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.04] py-12 bg-black">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-bold text-[#EDEDED] mb-2">TOALESCO</p>
          <p className="text-sm text-[#8A9AAB] mb-1">Soluciones tecnológicas para PyMEs — Chile</p>
          <div className="flex items-center justify-center gap-4 text-xs text-[#8A9AAB]">
            <a href="mailto:toalesco@tutamail.com" className="hover:text-[#00D2FF] transition-colors">
              toalesco@tutamail.com
            </a>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676] shadow-[0_0_6px_#00E676]" />
              </span>
              Soporte Operando 24/7
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
