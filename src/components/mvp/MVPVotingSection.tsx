"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { castMVPVote, getMVPResults } from "@/lib/mvp";
import { getFingerprint } from "@/lib/fingerprint";
import { toast } from "sonner";
import type { Player } from "@/types";

type MVPVotingSectionProps = {
  matchId: string;
  players: Player[];
  matchStatus: string;
  matchEndedAt?: Date;
};

export function MVPVotingSection({
  matchId,
  players,
  matchStatus,
  matchEndedAt,
}: MVPVotingSectionProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [votedPlayer, setVotedPlayer] = useState<string | null>(null);
  const [results, setResults] = useState<
    { playerId: string; playerName: string; playerNumber: number; voteCount: number; votePercentage: number }[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [votingOpen, setVotingOpen] = useState(false);
  const isLive = matchStatus === "live";

  useEffect(() => {
    const check = () => {
      setVotingOpen(
        matchStatus === "live" ||
        (matchStatus === "finished" && !!matchEndedAt && (Date.now() - matchEndedAt.getTime()) < 5 * 60 * 1000)
      );
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, [matchStatus, matchEndedAt]);

  const loadResults = async () => {
    const r = await getMVPResults(matchId, players);
    setResults(r);
    setShowResults(true);
  };

  useEffect(() => {
    if (matchStatus === "finished") {
      getMVPResults(matchId, players).then((r) => {
        setResults(r);
        setShowResults(true);
      });
    }
  }, [matchStatus]);

  const handleVote = async (playerId: string) => {
    setLoading(true);
    try {
      const fp = getFingerprint();
      await castMVPVote({
        matchId,
        playerId,
        userFingerprint: fp,
      });
      setHasVoted(true);
      setVotedPlayer(playerId);
      toast.success("Voto registrado");
      await loadResults();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al votar");
      if (err instanceof Error && err.message.includes("Ya votaste")) {
        setHasVoted(true);
        await loadResults();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏅 MVP del Partido
          {isLive && (
            <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 animate-pulse">
              EN VIVO
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {votingOpen
            ? "Vota por el jugador más valioso del partido"
            : matchStatus === "finished"
              ? "Votación cerrada"
              : "La votación se activará durante el partido"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {players.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay jugadores disponibles</p>
        )}

        <div className="space-y-3">
          {players.map((player) => {
            const playerResult = results.find((r) => r.playerId === player.id);
            const isSelected = votedPlayer === player.id;

            return (
              <div
                key={player.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  isSelected ? "border-primary bg-primary/5" : ""
                } ${!votingOpen ? "opacity-70" : ""}`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={player.photo} />
                  <AvatarFallback>
                    {player.firstName[0]}
                    {player.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {player.firstName} {player.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    #{player.number} · {player.position}
                  </p>
                </div>

                {showResults && playerResult ? (
                  <div className="text-right w-24">
                    <p className="text-sm font-bold">
                      {playerResult.votePercentage.toFixed(0)}%
                    </p>
                    <Progress value={playerResult.votePercentage} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {playerResult.voteCount} votos
                    </p>
                  </div>
                ) : (
                  votingOpen && (
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => handleVote(player.id)}
                      disabled={loading || hasVoted}
                    >
                      {loading ? "..." : hasVoted ? "Votado" : "Votar"}
                    </Button>
                  )
                )}
              </div>
            );
          })}
        </div>

        {!showResults && !votingOpen && matchStatus === "finished" && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={loadResults}
          >
            Ver resultados
          </Button>
        )}

        {showResults && votingOpen && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Los resultados se actualizan en tiempo real
          </p>
        )}
      </CardContent>
    </Card>
  );
}
