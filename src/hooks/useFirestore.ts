"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getClubBySlug,
  getActivePlayers,
  getMatches,
  getUpcomingMatches,
  getLatestResults,
  getNews,
  getProducts,
  getSponsors,
  getClubHistory,
  getTimelineEvents,
  getAchievements,
  getTeamStats,
  getPlayerStats,
  getPlayer,
  getMatch,
} from "@/lib/firebase/firestore";

function createKey(...args: (string | number | boolean | undefined | null)[]) {
  return args.filter(Boolean).join(":");
}

export function useClub(slug: string) {
  return useQuery({
    queryKey: ["club", slug],
    queryFn: () => getClubBySlug(slug),
    enabled: !!slug,
  });
}

export function usePlayers(clubId: string) {
  return useQuery({
    queryKey: ["players", clubId],
    queryFn: () => getActivePlayers(clubId),
    enabled: !!clubId,
  });
}

export function usePlayer(id: string) {
  return useQuery({
    queryKey: ["player", id],
    queryFn: () => getPlayer(id),
    enabled: !!id,
  });
}

export function usePlayerStats(playerId: string) {
  return useQuery({
    queryKey: ["playerStats", playerId],
    queryFn: () => getPlayerStats(playerId),
    enabled: !!playerId,
  });
}

export function useMatches(clubId: string) {
  return useQuery({
    queryKey: ["matches", clubId],
    queryFn: () => getMatches(clubId),
    enabled: !!clubId,
  });
}

export function useUpcomingMatches(clubId: string) {
  return useQuery({
    queryKey: ["upcomingMatches", clubId],
    queryFn: () => getUpcomingMatches(clubId),
    enabled: !!clubId,
  });
}

export function useLatestResults(clubId: string) {
  return useQuery({
    queryKey: ["latestResults", clubId],
    queryFn: () => getLatestResults(clubId),
    enabled: !!clubId,
  });
}

export function useMatch(id: string) {
  return useQuery({
    queryKey: ["match", id],
    queryFn: () => getMatch(id),
    enabled: !!id,
  });
}

export function useNews(clubId: string) {
  return useQuery({
    queryKey: ["news", clubId],
    queryFn: () => getNews(clubId),
    enabled: !!clubId,
  });
}

export function useProducts(clubId: string) {
  return useQuery({
    queryKey: ["products", clubId],
    queryFn: () => getProducts(clubId),
    enabled: !!clubId,
  });
}

export function useSponsors(clubId: string) {
  return useQuery({
    queryKey: ["sponsors", clubId],
    queryFn: () => getSponsors(clubId),
    enabled: !!clubId,
  });
}

export function useClubHistory(clubId: string) {
  return useQuery({
    queryKey: ["clubHistory", clubId],
    queryFn: () => getClubHistory(clubId),
    enabled: !!clubId,
  });
}

export function useTimelineEvents(clubId: string) {
  return useQuery({
    queryKey: ["timelineEvents", clubId],
    queryFn: () => getTimelineEvents(clubId),
    enabled: !!clubId,
  });
}

export function useAchievements(clubId: string) {
  return useQuery({
    queryKey: ["achievements", clubId],
    queryFn: () => getAchievements(clubId),
    enabled: !!clubId,
  });
}

export function useTeamStats(clubId: string) {
  return useQuery({
    queryKey: ["teamStats", clubId],
    queryFn: () => getTeamStats(clubId),
    enabled: !!clubId,
  });
}
