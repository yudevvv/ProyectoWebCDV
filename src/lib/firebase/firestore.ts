import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type {
  Club,
  Player,
  Match,
  News,
  Product,
  Sponsor,
  Member,
  TeamStats,
  PlayerStats,
  ClubHistory,
  TimelineEvent,
  Achievement,
  AppUser,
} from "@/types";

function getDb() {
  if (!db) throw new Error("Firestore no inicializado. Configura .env.local");
  return db;
}

function mapDoc<T>(snap: { id: string; data: () => Record<string, unknown> }): T {
  return { id: snap.id, ...snap.data() } as T;
}

async function getDocument<T>(
  collectionName: string,
  id: string
): Promise<T | null> {
  try {
    const docRef = doc(getDb(), collectionName, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return mapDoc<T>({ id: snap.id, data: () => snap.data() as Record<string, unknown> });
  } catch {
    return null;
  }
}

async function getDocuments<T>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  try {
    const q = query(collection(getDb(), collectionName), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => mapDoc<T>({ id: d.id, data: () => d.data() as Record<string, unknown> }));
  } catch {
    return [];
  }
}

export async function getClubBySlug(slug: string): Promise<Club | null> {
  try {
    const clubs = await getDocuments<Club>("clubs", where("slug", "==", slug));
    return clubs[0] || null;
  } catch {
    return null;
  }
}

export async function getClub(id: string): Promise<Club | null> {
  return getDocument<Club>("clubs", id);
}

export async function getClubsByUser(uid: string): Promise<Club[]> {
  try {
    const owned = await getDocuments<Club>(
      "clubs", where("ownerId", "==", uid)
    );
    const userDoc = await getUserDocument(uid);
    if (!userDoc) return owned;
    const clubIds = Object.keys(userDoc.roles.clubs);
    if (clubIds.length === 0) return owned;
    const assigned = await Promise.all(clubIds.map((id) => getClub(id)));
    const merged = [...owned, ...assigned.filter((c): c is Club => c !== null)];
    const seen = new Set<string>();
    return merged.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  } catch {
    return [];
  }
}

export async function getPlayers(clubId: string): Promise<Player[]> {
  return getDocuments<Player>(
    "players", where("clubId", "==", clubId), orderBy("number", "asc")
  );
}

export async function getActivePlayers(clubId: string): Promise<Player[]> {
  return getDocuments<Player>(
    "players", where("clubId", "==", clubId), where("active", "==", true), orderBy("number", "asc")
  );
}

export async function getPlayer(id: string): Promise<Player | null> {
  return getDocument<Player>("players", id);
}

export async function getPlayerStats(playerId: string): Promise<PlayerStats | null> {
  try {
    const stats = await getDocuments<PlayerStats>(
      "player_stats", where("playerId", "==", playerId), orderBy("season", "desc"), limit(1)
    );
    return stats[0] || null;
  } catch {
    return null;
  }
}

export async function getMatches(clubId: string): Promise<Match[]> {
  return getDocuments<Match>(
    "matches", where("clubId", "==", clubId), orderBy("date", "desc")
  );
}

export async function getUpcomingMatches(clubId: string, matchLimit = 5): Promise<Match[]> {
  try {
    return await getDocuments<Match>(
      "matches", where("clubId", "==", clubId), where("status", "in", ["upcoming", "live"]),
      orderBy("date", "asc"), limit(matchLimit)
    );
  } catch {
    return [];
  }
}

export async function getLatestResults(clubId: string, matchLimit = 5): Promise<Match[]> {
  try {
    return await getDocuments<Match>(
      "matches", where("clubId", "==", clubId), where("status", "==", "finished"),
      orderBy("date", "desc"), limit(matchLimit)
    );
  } catch {
    return [];
  }
}

export async function getMatch(id: string): Promise<Match | null> {
  return getDocument<Match>("matches", id);
}

export async function getNews(clubId: string): Promise<News[]> {
  try {
    return await getDocuments<News>(
      "news", where("clubId", "==", clubId), where("published", "==", true),
      orderBy("createdAt", "desc")
    );
  } catch {
    return [];
  }
}

export async function getNewsItem(id: string): Promise<News | null> {
  return getDocument<News>("news", id);
}

export async function getProducts(clubId: string): Promise<Product[]> {
  try {
    return await getDocuments<Product>(
      "products", where("clubId", "==", clubId), where("active", "==", true),
      orderBy("createdAt", "desc")
    );
  } catch {
    return [];
  }
}

export async function getSponsors(clubId: string): Promise<Sponsor[]> {
  try {
    return await getDocuments<Sponsor>(
      "sponsors", where("clubId", "==", clubId), where("active", "==", true), orderBy("tier", "asc")
    );
  } catch {
    return [];
  }
}

export async function getClubHistory(clubId: string): Promise<ClubHistory | null> {
  try {
    const history = await getDocuments<ClubHistory>(
      "club_history", where("clubId", "==", clubId)
    );
    return history[0] || null;
  } catch {
    return null;
  }
}

export async function getTimelineEvents(clubId: string): Promise<TimelineEvent[]> {
  return getDocuments<TimelineEvent>(
    "timeline_events", where("clubId", "==", clubId), orderBy("year", "asc")
  );
}

export async function getAchievements(clubId: string): Promise<Achievement[]> {
  return getDocuments<Achievement>(
    "achievements", where("clubId", "==", clubId), orderBy("year", "desc")
  );
}

export async function getTeamStats(clubId: string): Promise<TeamStats | null> {
  try {
    const stats = await getDocuments<TeamStats>(
      "team_stats", where("clubId", "==", clubId), orderBy("season", "desc"), limit(1)
    );
    return stats[0] || null;
  } catch {
    return null;
  }
}

export async function getMembers(clubId: string): Promise<Member[]> {
  return getDocuments<Member>(
    "members", where("clubId", "==", clubId), orderBy("createdAt", "desc")
  );
}

export async function getUserDocument(uid: string): Promise<AppUser | null> {
  try {
    const docRef = doc(getDb(), "users", uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { uid: snap.id, ...snap.data() } as AppUser;
  } catch {
    return null;
  }
}
