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

  const p = club.colors.primary;
  const s = club.colors.secondary;

  function hexToRgb(hex: string) {
    const c = hex.replace("#", "");
    return `${parseInt(c.substring(0, 2), 16)}, ${parseInt(c.substring(2, 4), 16)}, ${parseInt(c.substring(4, 6), 16)}`;
  }

  return (
    <div
      style={
        {
          "--club-primary": p,
          "--club-primary-rgb": hexToRgb(p),
          "--club-secondary": s,
          "--club-secondary-rgb": hexToRgb(s),
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
