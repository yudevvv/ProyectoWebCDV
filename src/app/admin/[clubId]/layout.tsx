"use client";

import { useEffect, useState } from "react";
import { ClubThemeProvider } from "@/components/admin/ClubThemeProvider";

export default function AdminClubLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clubId: string }>;
}) {
  const [clubId, setClubId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setClubId(p.clubId));
  }, [params]);

  if (!clubId) return <>{children}</>;

  return <ClubThemeProvider clubId={clubId}>{children}</ClubThemeProvider>;
}
