"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type MatchStatus = "upcoming" | "live" | "finished" | "cancelled";

type MatchCardProps = {
  opponent: string;
  date: Date;
  location: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  competition?: string;
  homeTeam?: string;
};

const statusConfig: Record<MatchStatus, { label: string; className: string }> =
  {
    upcoming: {
      label: "Próximo",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    live: {
      label: "EN VIVO",
      className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 animate-pulse",
    },
    finished: {
      label: "Finalizado",
      className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    cancelled: {
      label: "Cancelado",
      className: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    },
  };

export function MatchCard({
  opponent,
  date,
  location,
  status,
  homeScore = 0,
  awayScore = 0,
  competition,
  homeTeam = "Local",
}: MatchCardProps) {
  const config = statusConfig[status];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge className={config.className}>{config.label}</Badge>
          {competition && (
            <span className="text-xs text-muted-foreground">
              {competition}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-right">
            <p className="font-semibold">{homeTeam}</p>
          </div>
          <div className="flex items-center gap-3">
            {status === "finished" || status === "live" ? (
              <div className="flex items-center gap-2 text-2xl font-bold tabular-nums">
                <span>{homeScore}</span>
                <span className="text-muted-foreground">-</span>
                <span>{awayScore}</span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">vs</div>
            )}
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold">{opponent}</p>
          </div>
        </div>
        <div className="mt-4 text-xs text-muted-foreground flex items-center justify-between">
          <span>
            {format(date, "d MMM yyyy · HH:mm", { locale: es })}
          </span>
          <span>{location}</span>
        </div>
      </CardContent>
    </Card>
  );
}
