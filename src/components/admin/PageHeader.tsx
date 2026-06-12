"use client";

import { useClub } from "@/hooks/useFirestore";

type PageHeaderProps = {
  clubId: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export function PageHeader({ clubId, title, subtitle, action }: PageHeaderProps) {
  const { data: club } = useClub(clubId);
  const primary = club?.colors?.primary ?? "#0891b2";
  const secondary = club?.colors?.secondary ?? "#059669";
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4"
      style={{ borderBottom: `2px solid ${primary}20` }}
    >
      <div>
        <h1 className="text-2xl font-bold" style={{ color: primary }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground font-mono mt-0.5">
            $ {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
