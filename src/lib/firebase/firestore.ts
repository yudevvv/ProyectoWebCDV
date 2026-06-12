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
  } catch (e) {
    console.error(`getDocuments(${collectionName}) error:`, e);
    return [];
  }
}

export async function getClubBySlug(slug: string): Promise<Club | null> {
  try {
    const clubs = await getDocuments<Club>("clubs", where("slug", "==", slug));
    return clubs[0] || null;
  } catch (e) {
    console.error("getClubBySlug error:", e);
    return null;
  }
}

export async function getClub(id: string): Promise<Club | null> {
  return getDocument<Club>("clubs", id);
}

export async function getClubsByUser(uid: string): Promise<Club[]> {
  try {
    const userDoc = await getUserDocument(uid);
    if (userDoc?.roles.superadmin) {
      return getAllClubs();
    }
    const owned = await getDocuments<Club>(
      "clubs", where("ownerId", "==", uid)
    );
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
  const data = await getDocuments<Player>(
    "players", where("clubId", "==", clubId)
  );
  return data.sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
}

export async function getActivePlayers(clubId: string): Promise<Player[]> {
  const data = await getDocuments<Player>(
    "players", where("clubId", "==", clubId), where("active", "==", true)
  );
  return data.sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
}

export async function getPlayer(id: string): Promise<Player | null> {
  return getDocument<Player>("players", id);
}

export async function getPlayerStats(playerId: string): Promise<PlayerStats | null> {
  try {
    const stats = await getDocuments<PlayerStats>(
      "player_stats", where("playerId", "==", playerId)
    );
    return stats.sort((a, b) => (b.season ?? "").localeCompare(a.season ?? ""))[0] || null;
  } catch {
    return null;
  }
}

export async function getMatches(clubId: string): Promise<Match[]> {
  const data = await getDocuments<Match>(
    "matches", where("clubId", "==", clubId)
  );
  return data.sort((a, b) => {
    const da = a.date?.toMillis?.() ?? 0;
    const db = b.date?.toMillis?.() ?? 0;
    return db - da;
  });
}

export async function getUpcomingMatches(clubId: string, matchLimit = 5): Promise<Match[]> {
  const data = await getDocuments<Match>(
    "matches", where("clubId", "==", clubId), where("status", "in", ["upcoming", "live"])
  );
  return data
    .sort((a, b) => {
      const da = a.date?.toMillis?.() ?? 0;
      const db = b.date?.toMillis?.() ?? 0;
      return da - db;
    })
    .slice(0, matchLimit);
}

export async function getLatestResults(clubId: string, matchLimit = 5): Promise<Match[]> {
  const data = await getDocuments<Match>(
    "matches", where("clubId", "==", clubId), where("status", "==", "finished")
  );
  return data
    .sort((a, b) => {
      const da = a.date?.toMillis?.() ?? 0;
      const db = b.date?.toMillis?.() ?? 0;
      return db - da;
    })
    .slice(0, matchLimit);
}

export async function getMatch(id: string): Promise<Match | null> {
  return getDocument<Match>("matches", id);
}

export async function getNews(clubId: string): Promise<News[]> {
  const data = await getDocuments<News>(
    "news", where("clubId", "==", clubId), where("published", "==", true)
  );
  return data.sort((a, b) => {
    const da = a.createdAt?.toMillis?.() ?? 0;
    const db = b.createdAt?.toMillis?.() ?? 0;
    return db - da;
  });
}

export async function getAdminNews(clubId: string): Promise<News[]> {
  const data = await getDocuments<News>(
    "news", where("clubId", "==", clubId)
  );
  return data.sort((a, b) => {
    const da = a.createdAt?.toMillis?.() ?? 0;
    const db = b.createdAt?.toMillis?.() ?? 0;
    return db - da;
  });
}

export async function getNewsItem(id: string): Promise<News | null> {
  return getDocument<News>("news", id);
}

export async function getProducts(clubId: string): Promise<Product[]> {
  const data = await getDocuments<Product>(
    "products", where("clubId", "==", clubId), where("active", "==", true)
  );
  return data.sort((a, b) => {
    const da = a.createdAt?.toMillis?.() ?? 0;
    const db = b.createdAt?.toMillis?.() ?? 0;
    return db - da;
  });
}

export async function getSponsors(clubId: string): Promise<Sponsor[]> {
  const data = await getDocuments<Sponsor>(
    "sponsors", where("clubId", "==", clubId), where("active", "==", true)
  );
  const tierOrder: Record<string, number> = { gold: 0, silver: 1, bronze: 2 };
  return data.sort((a, b) => (tierOrder[a.tier] ?? 99) - (tierOrder[b.tier] ?? 99));
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
  const data = await getDocuments<TimelineEvent>(
    "timeline_events", where("clubId", "==", clubId)
  );
  return data.sort((a, b) => a.year - b.year);
}

export async function getAchievements(clubId: string): Promise<Achievement[]> {
  const data = await getDocuments<Achievement>(
    "achievements", where("clubId", "==", clubId)
  );
  return data.sort((a, b) => b.year - a.year);
}

export async function getTeamStats(clubId: string): Promise<TeamStats | null> {
  try {
    const stats = await getDocuments<TeamStats>(
      "team_stats", where("clubId", "==", clubId)
    );
    return stats.sort((a, b) => (b.season ?? "").localeCompare(a.season ?? ""))[0] || null;
  } catch {
    return null;
  }
}

export async function getMembers(clubId: string): Promise<Member[]> {
  const data = await getDocuments<Member>(
    "members", where("clubId", "==", clubId)
  );
  return data.sort((a, b) => {
    const da = a.createdAt?.toMillis?.() ?? 0;
    const db = b.createdAt?.toMillis?.() ?? 0;
    return db - da;
  });
}

export async function getAllClubs(): Promise<Club[]> {
  try {
    return await getDocuments<Club>("clubs", orderBy("createdAt", "desc"));
  } catch {
    return [];
  }
}

export async function getAllUsers(): Promise<AppUser[]> {
  try {
    const snapshot = await getDocs(collection(getDb(), "users"));
    return snapshot.docs.map((d) => ({ uid: d.id, ...d.data() } as AppUser));
  } catch {
    return [];
  }
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

export type ProballersPlayerStat = {
  playerName: string;
  height: string;
  age: number;
  pointsPerGame: number;
  reboundsPerGame: number;
  assistsPerGame: number;
  gamesPlayed: number;
  minutesPerGame: number;
  threePointPct: number;
  fieldGoalPct: number;
  freeThrowPct: number;
  stealsPerGame: number;
  blocksPerGame: number;
  turnovers: number;
  fouls: number;
  efficiency: number;
  clubId: string;
};

export async function getProballersStats(clubId: string): Promise<ProballersPlayerStat[]> {
  try {
    const docs = await getDocuments<ProballersPlayerStat>(
      "proballers_stats", where("clubId", "==", clubId)
    );
    return docs.sort((a, b) => b.pointsPerGame - a.pointsPerGame);
  } catch {
    return [];
  }
}
