"use client";

import { useClub } from "@/hooks/useFirestore";
import type { ReactNode } from "react";

type ClubThemeProviderProps = {
  clubId: string;
  children: ReactNode;
};

export function ClubThemeProvider({ clubId, children }: ClubThemeProviderProps) {
  const { data: club } = useClub(clubId);

  if (!club) return <>{children}</>;

  return (
    <div
      style={
        {
          "--club-primary": club.colors.primary,
          "--club-secondary": club.colors.secondary,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
