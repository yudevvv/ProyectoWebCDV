import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Check,
  Building2,
  Users,
  Calendar,
  ShoppingBag,
  Trophy,
  BarChart3,
  DollarSign,
  Zap,
  Smartphone,
  Globe,
  Shield,
  Server,
  Code,
  ExternalLink,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Plataforma", href: "#plataforma" },
  { label: "Servicios", href: "#servicios" },
  { label: "Precios", href: "#precios" },
  { label: "Recursos", href: "#recursos" },
  { label: "Demo", href: "/demo" },
];

const metrics = [
  { value: "+5000", label: "Hinchas potenciales conectados" },
  { value: "+100", label: "Módulos desarrollados" },
  { value: "24/7", label: "Acceso desde cualquier lugar" },
  { value: "100%", label: "Personalizable" },
];

const problems = [
  {
    icon: Building2,
    title: "Gestión desordenada",
    description: "Socios, jugadores y pagos distribuidos entre Excel, WhatsApp y documentos.",
  },
  {
    icon: Users,
    title: "Poco compromiso",
    description: "Los hinchas no tienen un lugar centralizado para seguir al club.",
  },
  {
    icon: DollarSign,
    title: "Menos ingresos",
    description: "Se desaprovechan oportunidades de patrocinio, merchandising y membresías.",
  },
  {
    icon: BarChart3,
    title: "Falta de datos",
    description: "No existen estadísticas ni métricas para tomar decisiones.",
  },
];

const modules = [
  {
    icon: Users,
    title: "Gestión de Socios",
    features: ["Registro digital", "Control de pagos", "Historial completo", "Membresías"],
  },
  {
    icon: Globe,
    title: "Portal de Hinchas",
    features: ["Noticias", "Calendario", "Resultados", "Tabla de posiciones"],
  },
  {
    icon: Trophy,
    title: "Participación",
    features: ["MVP del partido", "Encuestas", "Predicciones", "Fan Zone"],
  },
  {
    icon: Shield,
    title: "Patrocinadores",
    features: ["Espacios publicitarios", "Estadísticas de visibilidad", "Gestión de auspiciadores"],
  },
  {
    icon: ShoppingBag,
    title: "Tienda Online",
    features: ["Venta de productos", "Control de stock", "Promociones"],
  },
  {
    icon: BarChart3,
    title: "Estadísticas Deportivas",
    features: ["Jugadores", "Equipos", "Temporadas", "Historial"],
  },
];

const stellarFeatures = [
  "Registro de contratos",
  "Historial salarial",
  "Fechas de renovación",
  "Bonificaciones",
  "Incentivos por rendimiento",
  "Alertas de vencimiento",
  "Control de pagos",
  "Exportación de reportes",
];

const services = [
  {
    icon: Code,
    title: "Desarrollo Web",
    description: "Sitios corporativos, landing pages y plataformas personalizadas",
  },
  {
    icon: Server,
    title: "Software a Medida",
    description: "Sistemas adaptados a procesos específicos",
  },
  {
    icon: Zap,
    title: "Automatizaciones",
    description: "Automatización de tareas repetitivas y procesos internos",
  },
  {
    icon: Smartphone,
    title: "Integraciones",
    description: "APIs, ERP, CRM, WhatsApp y herramientas empresariales",
  },
];

const plans = [
  {
    name: "Plataforma Club Starter",
    price: "$49.900",
    period: "/mes",
    features: ["Socios", "Noticias", "Calendario", "MVP", "Panel básico"],
    highlighted: true,
  },
  {
    name: "Plataforma Club Pro",
    price: "$99.900",
    period: "/mes",
    features: ["Todo Starter +", "Estadísticas avanzadas", "Patrocinadores", "Tienda", "Reportes"],
    highlighted: true,
  },
  {
    name: "Desarrollo Web",
    price: "Desde $199.000",
    period: "",
    features: ["Landing pages", "Sitios corporativos", "Plataformas web"],
    highlighted: false,
  },
  {
    name: "Software a Medida",
    price: "Cotización",
    period: "personalizada",
    features: ["Sistemas adaptados", "Procesos específicos", "Escalable"],
    highlighted: false,
  },
  {
    name: "Automatizaciones",
    price: "Desde $299.000",
    period: "",
    features: ["Tareas repetitivas", "Procesos internos", "Workflows"],
    highlighted: false,
  },
];

const articles = [
  "Cómo conseguir patrocinadores para tu club",
  "Cómo aumentar la base de socios",
  "Cómo conseguir financiamiento deportivo",
  "Cómo vender merchandising online",
  "Cómo profesionalizar un club deportivo",
];

const freeTools = [
  "Calculadora de ingresos por socios",
  "Generador de propuestas para patrocinadores",
  "Plantillas administrativas para clubes",
];

const footerLinks = [
  { label: "Plataforma", href: "#plataforma" },
  { label: "Servicios", href: "#servicios" },
  { label: "Precios", href: "#precios" },
  { label: "Recursos", href: "#recursos" },
  { label: "Demo", href: "/demo" },
  { label: "Contacto", href: "mailto:toalesco@tutamail.com" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* ===== 1. NAVBAR ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 shrink-0">
            TOALESCO
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-slate-600 hover:text-cyan-600 transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-slate-600 hover:text-cyan-600 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <Link
            href="#solicitar-demo"
            className="hidden md:inline-flex h-8 items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 px-3 text-sm font-medium text-white transition-all"
          >
            Solicitar Demo <ArrowRight className="h-4 w-4" />
          </Link>
          {/* Mobile hamburger - static, no interactivity needed for SSR */}
          <div className="md:hidden flex flex-col gap-1.5 p-2">
            <span className="block h-px w-5 bg-slate-500" />
            <span className="block h-px w-5 bg-slate-500" />
            <span className="block h-px w-5 bg-slate-500" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ===== 2. HERO ===== */}
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-50 via-white to-white" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-cyan-400/10 blur-[150px]" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-slate-900">
                Transformamos clubes deportivos en{" "}
                <span className="text-cyan-600">organizaciones digitales.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 leading-relaxed">
                Gestiona socios, jugadores, estadísticas, pagos, patrocinadores y la experiencia de
                tus hinchas desde una única plataforma.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="#solicitar-demo"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-cyan-600 hover:bg-cyan-700 px-8 text-base font-medium text-white transition-all"
                >
                  Solicitar Demo
                </Link>
                <Link
                  href="#plataforma"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 bg-white hover:border-cyan-400 hover:text-cyan-600 px-8 text-base font-medium text-slate-700 transition-all"
                >
                  Ver Plataforma
                </Link>
              </div>
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {metrics.map((m) => (
                  <Card key={m.label} className="border-slate-200 bg-white/70 backdrop-blur">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl md:text-3xl font-black text-cyan-600">{m.value}</p>
                      <p className="mt-1 text-xs text-slate-500">{m.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== 3. PROBLEMS SECTION ===== */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 max-w-2xl mx-auto">
              La mayoría de los clubes siguen gestionando todo manualmente.
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {problems.map((p) => (
                <Card key={p.title} className="border-slate-200 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                        <p.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">{p.title}</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{p.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 4. VALUE PROPOSITION - MÓDULOS ===== */}
        <section id="plataforma" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900">
              Todo tu club en una sola plataforma.
            </h2>
            <p className="mt-3 text-center text-slate-500 max-w-xl mx-auto">
              Cada módulo está diseñado para cubrir una necesidad específica de tu institución.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((mod) => (
                <Card key={mod.title} className="border-slate-200 bg-white hover:border-cyan-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 mb-4">
                      <mod.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">{mod.title}</h3>
                    <ul className="space-y-1.5">
                      {mod.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-500">
                          <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 5. STELLAR MODULE - SUELDOS Y CONTRATOS ===== */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-emerald-50" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #0891b2 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-4">
                <Badge variant="default" className="bg-cyan-600 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Próximamente
                </Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Gestión de Sueldos y Contratos
              </h2>
              <p className="mt-3 text-lg text-slate-500 max-w-2xl">
                Sistema diseñado para clubes que necesitan controlar información financiera de
                jugadores y cuerpo técnico.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {stellarFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-200">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  En desarrollo
                </Badge>
                <Badge variant="outline" className="border-cyan-300 text-cyan-700 bg-cyan-50">
                  Disponible próximamente
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 6. DEMO PUBLIC SECTION ===== */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Prueba la plataforma</h2>
            <p className="mt-3 text-lg text-slate-400">
              La mejor forma de entender TOALESCO es usarla.
            </p>
            <Link
              href="/demo"
              className="inline-flex mt-8 h-12 items-center justify-center rounded-lg bg-cyan-600 hover:bg-cyan-500 px-10 text-base font-medium text-white transition-all"
            >
              Ingresar a Demo
            </Link>
            <div className="mt-8 inline-flex items-center gap-4 rounded-lg bg-slate-800 px-6 py-3 text-sm text-slate-300 border border-slate-700">
              <span><span className="text-slate-500">USUARIO:</span> <span className="text-cyan-400 font-mono">demo</span></span>
              <span className="text-slate-600">|</span>
              <span><span className="text-slate-500">CONTRASEÑA:</span> <span className="text-cyan-400 font-mono">demo123</span></span>
            </div>
          </div>
        </section>

        {/* ===== 7. SERVICES SECTION ===== */}
        <section id="servicios" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                También desarrollamos soluciones digitales para empresas
              </h2>
              <p className="mt-3 text-slate-500 max-w-xl mx-auto">
                Llevamos la misma calidad y compromiso a proyectos corporativos.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((svc) => (
                <Card key={svc.title} className="border-slate-200 bg-white hover:border-cyan-200 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-cyan-600 mx-auto mb-4">
                      <svc.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2">{svc.title}</h3>
                    <p className="text-sm text-slate-500">{svc.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 8. PRICING ===== */}
        <section id="precios" className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900">Planes</h2>
            <p className="mt-3 text-center text-slate-500 max-w-xl mx-auto">
              Elige el plan que mejor se adapte a tu club o proyecto.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-start">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`border ${plan.highlighted ? "border-cyan-300 ring-1 ring-cyan-200 bg-white" : "border-slate-200 bg-white"}`}
                >
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-900">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-2">
                      <span className="text-2xl font-black text-slate-900">{plan.price}</span>
                      {plan.period && (
                        <span className="text-sm text-slate-500 ml-1">{plan.period}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                          <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 9. RESOURCES SECTION ===== */}
        <section id="recursos" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900">
              Centro de Recursos para Clubes
            </h2>
            <p className="mt-3 text-center text-slate-500 max-w-xl mx-auto">
              Contenido gratuito para ayudarte a profesionalizar tu institución.
            </p>
            <div className="mt-12 grid gap-10 md:grid-cols-2 max-w-4xl mx-auto">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <ChevronRight className="h-5 w-5 text-cyan-600" />
                  Artículos
                </h3>
                <ul className="space-y-3">
                  {articles.map((a) => (
                    <li key={a}>
                      <a
                        href="#"
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-cyan-600 transition-colors group"
                      >
                        <span className="h-1 w-1 rounded-full bg-slate-300 group-hover:bg-cyan-500 transition-colors shrink-0" />
                        {a}
                        <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-cyan-400 ml-auto shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <ChevronRight className="h-5 w-5 text-cyan-600" />
                  Herramientas Gratuitas
                </h3>
                <ul className="space-y-3">
                  {freeTools.map((t) => (
                    <li key={t}>
                      <a
                        href="#"
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-cyan-600 transition-colors group"
                      >
                        <span className="h-1 w-1 rounded-full bg-slate-300 group-hover:bg-cyan-500 transition-colors shrink-0" />
                        {t}
                        <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-cyan-400 ml-auto shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 10. SUCCESS STORIES ===== */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900">
              Casos de Éxito
            </h2>
            <div className="mt-4 text-center">
              <Badge variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Próximamente
              </Badge>
            </div>
            <p className="mt-4 text-sm text-slate-500 text-center max-w-lg mx-auto">
              Cuando existan clientes reales, sus casos aparecerán aquí.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-dashed border-slate-300 bg-slate-50/50">
                  <CardContent className="p-6">
                    <div className="h-2 w-16 rounded bg-slate-200 mb-4" />
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="text-[10px] border-red-200 text-red-500 shrink-0">
                          Problema
                        </Badge>
                        <div className="h-3 w-full rounded bg-slate-200" />
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="text-[10px] border-cyan-200 text-cyan-600 shrink-0">
                          Solución
                        </Badge>
                        <div className="h-3 w-full rounded bg-slate-200" />
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="text-[10px] border-emerald-200 text-emerald-600 shrink-0">
                          Resultado
                        </Badge>
                        <div className="h-3 w-full rounded bg-slate-200" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-slate-200" />
                      <div className="space-y-1 flex-1">
                        <div className="h-2.5 w-24 rounded bg-slate-200" />
                        <div className="h-2 w-16 rounded bg-slate-200" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 11. FINAL CTA ===== */}
        <section id="solicitar-demo" className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-cyan-800" />
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "30px 30px",
            }}
          />
          <div className="container mx-auto px-4 relative text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto leading-tight">
              Tu club merece más que hojas de cálculo y grupos de WhatsApp.
            </h2>
            <p className="mt-4 text-lg text-cyan-100 max-w-xl mx-auto">
              Digitaliza la gestión de tu institución, mejora la experiencia de tus hinchas y crea
              nuevas fuentes de ingresos.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="#solicitar-demo"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white hover:bg-slate-100 px-8 text-base font-medium text-cyan-700 transition-all"
              >
                Solicitar Demo
              </Link>
              <a
                href="mailto:toalesco@tutamail.com?subject=Quiero%20hablar%20con%20TOALESCO"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/40 hover:bg-white/10 px-8 text-base font-medium text-white transition-all"
              >
                Hablar con Nosotros
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ===== 12. FOOTER ===== */}
      <footer className="border-t border-slate-200 py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              &copy; 2026 TOALESCO. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {footerLinks.map((link) =>
                link.href.startsWith("mailto:") ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-xs text-slate-500 hover:text-cyan-600 transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-xs text-slate-500 hover:text-cyan-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
