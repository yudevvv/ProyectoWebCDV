import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { useCallback } from "react";

const DEMO_EMAIL = "demo@toalesco.cl";

function getDemoClubSlug(): string {
  return process.env.NEXT_PUBLIC_DEMO_CLUB_SLUG || "demo-club";
}

export function useDemoMode(clubSlug?: string) {
  const { user } = useAuth();
  const isDemoUser = user?.email === DEMO_EMAIL;
  const isDemoClub = clubSlug === getDemoClubSlug();
  const isDemo = isDemoUser && isDemoClub;

  const guard = useCallback(
    (fn?: () => void) => {
      if (isDemo) {
        toast.error("Accion no disponible en modo demo");
        return;
      }
      fn?.();
    },
    [isDemo],
  );

  return { isDemo, guard };
}
