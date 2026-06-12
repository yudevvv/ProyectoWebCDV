import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Timestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase/client";
import type {
  Club,
  Player,
  Match,
  News,
  Product,
  Sponsor,
  Member,
  ClubHistory,
  TimelineEvent,
  Achievement,
  AppUser,
  UserRole,
} from "@/types";

function getDb() {
  if (!db) throw new Error("Firestore no inicializado. Configura .env.local");
  return db;
}

// ---- Players ----
type CreatePlayerData = Pick<Player, "firstName" | "lastName" | "number" | "position" | "age"> & Partial<Omit<Player, "id" | "createdAt" | "updatedAt">>;

export async function createPlayer(
  clubId: string,
  data: CreatePlayerData
) {
  const dbInstance = await getDb();
  const docRef = await addDoc(collection(dbInstance, "players"), {
    ...data,
    clubId,
    active: true,
    photo: data.photo ?? "",
    bio: data.bio ?? "",
    height: data.height ?? "",
    weight: data.weight ?? "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePlayer(id: string, data: Partial<Player>) {
  const dbInstance = await getDb();
  await updateDoc(doc(dbInstance, "players", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePlayer(id: string) {
  const dbInstance = await getDb();
  await deleteDoc(doc(dbInstance, "players", id));
}

// ---- Matches ----
type CreateMatchData = Pick<Match, "opponent" | "date" | "location" | "status"> & Partial<Omit<Match, "id" | "createdAt" | "updatedAt">>;

export async function createMatch(
  clubId: string,
  data: CreateMatchData
) {
  const dbInstance = await getDb();
  const docRef = await addDoc(collection(dbInstance, "matches"), {
    ...data,
    competition: data.competition ?? "",
    season: data.season ?? new Date().getFullYear().toString(),
    homeScore: data.homeScore ?? 0,
    awayScore: data.awayScore ?? 0,
    clubId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateMatch(id: string, data: Partial<Match>) {
  const dbInstance = await getDb();
  await updateDoc(doc(dbInstance, "matches", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMatch(id: string) {
  const dbInstance = await getDb();
  await deleteDoc(doc(dbInstance, "matches", id));
}

// ---- News ----
type CreateNewsData = Pick<News, "title" | "content"> & Partial<Omit<News, "id" | "createdAt" | "updatedAt">>;

export async function createNews(
  clubId: string,
  data: CreateNewsData
) {
  const dbInstance = await getDb();
  const docRef = await addDoc(collection(dbInstance, "news"), {
    ...data,
    slug: data.slug ?? data.title.toLowerCase().replace(/\s+/g, "-"),
    excerpt: data.excerpt ?? "",
    author: data.author ?? "",
    coverImage: data.coverImage ?? "",
    tags: data.tags ?? [],
    published: data.published ?? false,
    featured: data.featured ?? false,
    clubId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateNews(id: string, data: Partial<News>) {
  const dbInstance = await getDb();
  await updateDoc(doc(dbInstance, "news", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteNews(id: string) {
  const dbInstance = await getDb();
  await deleteDoc(doc(dbInstance, "news", id));
}

// ---- Products ----
type CreateProductData = Pick<Product, "name" | "price"> & Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>;

export async function createProduct(
  clubId: string,
  data: CreateProductData
) {
  const dbInstance = await getDb();
  const docRef = await addDoc(collection(dbInstance, "products"), {
    ...data,
    description: data.description ?? "",
    stock: data.stock ?? 0,
    sku: data.sku ?? "",
    category: data.category ?? "other",
    images: data.images ?? [],
    sizes: data.sizes ?? [],
    colors: data.colors ?? [],
    active: true,
    featured: data.featured ?? false,
    clubId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const dbInstance = await getDb();
  await updateDoc(doc(dbInstance, "products", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string) {
  const dbInstance = await getDb();
  await deleteDoc(doc(dbInstance, "products", id));
}

// ---- Sponsors ----
type CreateSponsorData = Pick<Sponsor, "name" | "tier"> & Partial<Omit<Sponsor, "id" | "createdAt" | "updatedAt">>;

export async function createSponsor(
  clubId: string,
  data: CreateSponsorData
) {
  const dbInstance = await getDb();
  const docRef = await addDoc(collection(dbInstance, "sponsors"), {
    name: data.name,
    tier: data.tier,
    logo: data.logo ?? "",
    website: data.website ?? "",
    description: data.description ?? "",
    contributionType: data.contributionType ?? "monetario",
    contributionAmount: data.contributionAmount ?? 0,
    contributionCurrency: data.contributionCurrency ?? "CLP",
    complianceStatus: data.complianceStatus ?? "pendiente",
    complianceNotes: data.complianceNotes ?? "",
    clubId,
    active: true,
    startDate: data.startDate ?? serverTimestamp(),
    endDate: data.endDate ?? undefined,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateSponsor(id: string, data: Partial<Sponsor>) {
  const dbInstance = await getDb();
  await updateDoc(doc(dbInstance, "sponsors", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteSponsor(id: string) {
  const dbInstance = await getDb();
  await deleteDoc(doc(dbInstance, "sponsors", id));
}

// ---- Members ----
export async function createMember(
  clubId: string,
  data: Pick<Member, "name" | "rut" | "email" | "phone" | "membershipType" | "monthlyAmount"> & { startDate?: Timestamp; endDate?: Timestamp }
) {
  const dbInstance = await getDb();
  const docRef = await addDoc(collection(dbInstance, "members"), {
    ...data,
    address: "",
    status: "approved",
    totalPaid: 0,
    startDate: data.startDate ?? serverTimestamp(),
    endDate: data.endDate ?? undefined,
    clubId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateMember(id: string, data: Partial<Member>) {
  const dbInstance = await getDb();
  await updateDoc(doc(dbInstance, "members", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMember(id: string) {
  const dbInstance = await getDb();
  await deleteDoc(doc(dbInstance, "members", id));
}

// ---- History ----
export async function saveClubHistory(
  clubId: string,
  data: Omit<ClubHistory, "clubId" | "updatedAt"> & { id?: string }
) {
  const dbInstance = await getDb();
  if (data.id) {
    await updateDoc(doc(dbInstance, "club_history", data.id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } else {
    await addDoc(collection(dbInstance, "club_history"), {
      ...data,
      clubId,
      updatedAt: serverTimestamp(),
    });
  }
}

// ---- Timeline Events ----
type CreateTimelineData = Pick<TimelineEvent, "year" | "title"> & Partial<Omit<TimelineEvent, "clubId" | "createdAt">>;

export async function createTimelineEvent(
  clubId: string,
  data: CreateTimelineData
) {
  const dbInstance = await getDb();
  const docRef = await addDoc(collection(dbInstance, "timeline_events"), {
    ...data,
    description: data.description ?? "",
    order: data.order ?? 0,
    clubId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteTimelineEvent(id: string) {
  const dbInstance = await getDb();
  await deleteDoc(doc(dbInstance, "timeline_events", id));
}

// ---- Achievements ----
type CreateAchievementData = Pick<Achievement, "year" | "title"> & Partial<Omit<Achievement, "clubId" | "createdAt">>;

export async function createAchievement(
  clubId: string,
  data: CreateAchievementData
) {
  const dbInstance = await getDb();
  const docRef = await addDoc(collection(dbInstance, "achievements"), {
    ...data,
    description: data.description ?? "",
    position: data.position ?? 0,
    clubId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteAchievement(id: string) {
  const dbInstance = await getDb();
  await deleteDoc(doc(dbInstance, "achievements", id));
}

// ---- Clubs ----
export async function createClub(data: Omit<Club, "id" | "createdAt" | "updatedAt">) {
  const dbInstance = await getDb();
  const clubData = {
    ...data,
    published: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(dbInstance, "clubs"), clubData);
  return docRef.id;
}

export async function publishClub(id: string, publish: boolean) {
  const dbInstance = await getDb();
  await updateDoc(doc(dbInstance, "clubs", id), {
    published: publish,
    ...(publish ? { publishedAt: serverTimestamp() } : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function updateClub(id: string, data: Partial<Club>) {
  const dbInstance = await getDb();
  await updateDoc(doc(dbInstance, "clubs", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ---- Users ----
export async function createUserDocument(uid: string, data: Pick<AppUser, "email" | "displayName">) {
  const dbInstance = await getDb();
  await setDoc(doc(dbInstance, "users", uid), {
    uid,
    email: data.email,
    displayName: data.displayName,
    photoURL: "",
    roles: { superadmin: false, clubs: {} },
    createdAt: serverTimestamp(),
  });
}

export async function updateUserClubs(uid: string, clubs: Record<string, UserRole>) {
  const dbInstance = await getDb();
  await updateDoc(doc(dbInstance, "users", uid), { "roles.clubs": clubs });
}

export async function updateUserRole(uid: string, superadmin: boolean) {
  const dbInstance = await getDb();
  await updateDoc(doc(dbInstance, "users", uid), { "roles.superadmin": superadmin });
}

// ---- Proballers Stats ----
export async function saveProballersStats(
  clubId: string,
  players: Array<{
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
  }>
) {
  const dbInstance = await getDb();
  const batch = writeBatch(dbInstance);
  const existing = await getDocs(query(collection(dbInstance, "proballers_stats"), where("clubId", "==", clubId)));
  existing.forEach((d) => batch.delete(d.ref));
  for (const p of players) {
    batch.set(doc(collection(dbInstance, "proballers_stats")), { ...p, clubId, scrapedAt: serverTimestamp() });
  }
  await batch.commit();
}

// ---- Upload ----
export async function uploadFile(
  path: string,
  file: File
): Promise<string> {
  if (!storage) throw new Error("Storage not initialized");
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
