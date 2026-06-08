"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitPrediction } from "@/lib/fanzone";
import { toast } from "sonner";

type MatchPredictionProps = {
  matchId: string;
  clubId: string;
  homeTeam: string;
  awayTeam: string;
  userId: string;
  onPredicted?: () => void;
};

export function MatchPrediction({
  matchId,
  clubId,
  homeTeam,
  awayTeam,
  userId,
  onPredicted,
}: MatchPredictionProps) {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitPrediction(clubId, matchId, userId, homeScore, awayScore);
      toast.success("Predicción enviada");
      onPredicted?.();
    } catch {
      toast.error("Error al enviar predicción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predice el Marcador</CardTitle>
        <CardDescription>
          {homeTeam} vs {awayTeam}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4 justify-center">
            <div className="text-center">
              <Label className="text-sm font-medium mb-1 block">{homeTeam}</Label>
              <Input
                type="number"
                min={0}
                max={50}
                className="w-20 text-center text-lg font-bold"
                value={homeScore}
                onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
              />
            </div>
            <span className="text-2xl font-bold text-muted-foreground">vs</span>
            <div className="text-center">
              <Label className="text-sm font-medium mb-1 block">{awayTeam}</Label>
              <Input
                type="number"
                min={0}
                max={50}
                className="w-20 text-center text-lg font-bold"
                value={awayScore}
                onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Predicción"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
