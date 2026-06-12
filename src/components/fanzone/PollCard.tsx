"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getActivePolls, castPollVote } from "@/lib/fanzone";
import { toast } from "sonner";

type PollCardProps = {
  clubId: string;
};

type PollOption = {
  id: string;
  label: string;
  votes: number;
};

type Poll = {
  id: string;
  title: string;
  options: PollOption[];
  type: string;
};

export function PollCard({ clubId }: PollCardProps) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getActivePolls(clubId).then((data) => {
      setPolls(data as Poll[]);
    });
  }, [clubId]);

  const handleVote = async (pollId: string, optionId: string) => {
    setLoading(true);
    try {
      await castPollVote(pollId, optionId);
      setVotedPolls((prev) => new Set(prev).add(pollId));
      toast.success("Voto registrado");
    } catch {
      toast.error("Error al votar");
    } finally {
      setLoading(false);
    }
  };

  if (polls.length === 0) return null;

  return (
    <div className="space-y-4">
      {polls.map((poll) => {
        const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
        const hasVoted = votedPolls.has(poll.id);

        return (
          <Card key={poll.id}>
            <CardHeader>
              <CardTitle className="text-lg">{poll.title}</CardTitle>
              <CardDescription>
                {totalVotes} votos totales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {poll.options.map((option) => {
                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                return (
                  <div key={option.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.votes} votos ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={percentage} className="flex-1 h-2" />
                      {!hasVoted && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVote(poll.id, option.id)}
                          disabled={loading}
                        >
                          Votar
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              {hasVoted && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Has votado en esta encuesta
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
