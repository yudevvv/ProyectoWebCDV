"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Player } from "@/types";

type PlayerCardProps = {
  player: Player;
};

export function PlayerCard({ player }: PlayerCardProps) {
  const initials = `${player.firstName[0]}${player.lastName[0]}`;

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="aspect-[3/4] relative bg-muted flex items-center justify-center">
          {player.photo ? (
            <Avatar className="w-full h-full rounded-none">
              <AvatarImage src={player.photo} alt={`${player.firstName} ${player.lastName}`} />
              <AvatarFallback className="rounded-none text-4xl font-bold text-muted-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          ) : (
            <span className="text-6xl font-bold text-muted-foreground">
              {player.number}
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-white font-bold text-lg">
              {player.firstName} {player.lastName}
            </p>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{player.position}</p>
            {player.height && (
              <p className="text-xs text-muted-foreground">{player.height}</p>
            )}
          </div>
          <Badge variant="outline" className="text-lg font-bold">
            #{player.number}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
