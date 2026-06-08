import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type NoFirebaseMessageProps = {
  title?: string;
  description?: string;
};

export function NoFirebaseMessage({
  title = "Configuración pendiente",
  description = "Agrega tus credenciales de Firebase en el archivo .env.local para ver el contenido.",
}: NoFirebaseMessageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Para probar TOALESCO localmente:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Crea un proyecto en{" "}
              <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Firebase Console
              </a>
            </li>
            <li>Copia las credenciales a <code className="bg-muted px-1 rounded">.env.local</code></li>
            <li>Habilita Firestore y crea un documento en la colección <code className="bg-muted px-1 rounded">clubs</code></li>
            <li>Reinicia el servidor con <code className="bg-muted px-1 rounded">npm run dev</code></li>
          </ol>
          <p className="pt-2">
            Revisa el{" "}
            <a href="https://github.com/tu-usuario/toalesco#readme" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              README
            </a>{" "}
            para más detalles.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
