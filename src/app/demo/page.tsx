import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KeyRound, User, ArrowRight, Monitor, Smartphone, Globe } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="font-bold text-lg" style={{ color: "#0891b2" }}>
            TOALESCO
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: "#0891b2" }}
          >
            Iniciar Sesión
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="mb-4" style={{ backgroundColor: "#0891b2" }}>Demo</Badge>
          <h1 className="text-4xl font-bold mb-4">Prueba la Plataforma</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            La mejor forma de entender TOALESCO es usarla. Ingresa con las credenciales de demo.
          </p>
        </div>

        <Card className="max-w-md mx-auto mb-12 border-2" style={{ borderColor: "#0891b220" }}>
          <CardHeader className="text-center">
            <CardTitle>Credenciales de Acceso</CardTitle>
            <CardDescription>Usa estos datos para explorar la plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#f8fafc" }}>
              <User className="w-5 h-5" style={{ color: "#0891b2" }} />
              <div>
                <p className="text-xs text-muted-foreground">USUARIO</p>
                <p className="font-mono font-bold text-sm">demo@toalesco.cl</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#f8fafc" }}>
              <KeyRound className="w-5 h-5" style={{ color: "#059669" }} />
              <div>
                <p className="text-xs text-muted-foreground">CONTRASEÑA</p>
                <p className="font-mono font-bold text-sm">demo123</p>
              </div>
            </div>
            <Link href="/login" className="block mt-6">
              <Button className="w-full text-base py-6" style={{ backgroundColor: "#0891b2" }}>
                Ingresar a Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold mb-6">Lo que puedes explorar</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {[
              { icon: Monitor, title: "Dashboard", desc: "Próximos partidos, resultados y estadísticas del equipo" },
              { icon: User, title: "Jugadores", desc: "Perfiles con estadísticas y rendimiento" },
              { icon: Globe, title: "Portal Hinchas", desc: "Noticias, calendario, MVP y más" },
              { icon: Smartphone, title: "MVP del Partido", desc: "Sistema de votación completamente funcional" },
              { icon: Monitor, title: "Tienda", desc: "Productos y merchandising del club" },
              { icon: Monitor, title: "Panel Admin", desc: "Gestión de socios, noticias y configuraciones" },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="pt-6">
                  <item.icon className="w-8 h-8 mb-3" style={{ color: "#0891b2" }} />
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center py-8 border-t">
          <p className="text-sm text-muted-foreground">
            ¿Preguntas? Escríbenos a{" "}
            <a href="mailto:contacto@toalesco.cl" className="font-medium" style={{ color: "#0891b2" }}>
              contacto@toalesco.cl
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
