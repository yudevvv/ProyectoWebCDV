"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClubThemeProvider } from "@/components/admin/ClubThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import { getClubBySlug, getClubsByUser } from "@/lib/firebase/firestore";

export default function AdminClubLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clubId: string }>;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [clubId, setClubId] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    params.then((p) => setClubId(p.clubId));
  }, [params]);

  useEffect(() => {
    if (!clubId || loading || !user) return;
    (async () => {
      try {
        const club = await getClubBySlug(clubId);
        if (!club) {
          router.replace("/admin");
          return;
        }
        if (club.ownerId === user.uid) {
          setAuthorized(true);
          return;
        }
        const userDoc = await getClubsByUser(user.uid);
        if (userDoc.some((c) => c.slug === clubId)) {
          setAuthorized(true);
          return;
        }
        router.replace("/admin");
      } catch {
        router.replace("/admin");
      }
    })();
  }, [clubId, user, loading, router]);

  if (!clubId || !authorized) return null;

  return <ClubThemeProvider clubId={clubId}>{children}</ClubThemeProvider>;
}
