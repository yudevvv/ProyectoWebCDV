import { Skeleton } from "@/components/ui/skeleton";

type HeroBannerProps = {
  name: string;
  description: string;
  banner?: string;
};

export function HeroBanner({
  name,
  description,
  banner,
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-cyan-700">
      {banner && (
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner})` }}
        />
      )}
      <div className="container mx-auto px-4 relative">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white">
          {name}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/80">{description}</p>
      </div>
    </section>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div className="py-24 md:py-32 bg-muted">
      <div className="container mx-auto px-4">
        <Skeleton className="h-12 w-96 mb-4" />
        <Skeleton className="h-6 w-64" />
      </div>
    </div>
  );
}
