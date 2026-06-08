import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

type MVPVoteData = {
  matchId: string;
  playerId: string;
  userFingerprint: string;
};

export async function castMVPVote(data: MVPVoteData) {
  if (!db) throw new Error("Firestore not initialized");

  // Check existing vote from this fingerprint
  const existing = query(
    collection(db, "mvp_votes"),
    where("matchId", "==", data.matchId),
    where("userFingerprint", "==", data.userFingerprint)
  );
  const snap = await getDocs(existing);
  if (!snap.empty) {
    throw new Error("Ya votaste en este partido");
  }

  const docRef = await addDoc(collection(db, "mvp_votes"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

type MVPVoteDoc = {
  id: string;
  matchId: string;
  playerId: string;
  userFingerprint: string;
  createdAt: ReturnType<typeof serverTimestamp>;
};

export async function getMVPVotes(matchId: string): Promise<MVPVoteDoc[]> {
  if (!db) return [];
  const q = query(
    collection(db, "mvp_votes"),
    where("matchId", "==", matchId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      matchId: data.matchId as string,
      playerId: data.playerId as string,
      userFingerprint: data.userFingerprint as string,
      createdAt: data.createdAt as ReturnType<typeof serverTimestamp>,
    };
  });
}

export async function getMVPResults(
  matchId: string,
  players: { id: string; firstName: string; lastName: string; number: number }[]
) {
  const votes = await getMVPVotes(matchId);
  const total = votes.length;

  const countMap = new Map<string, number>();
  votes.forEach((v) => {
    countMap.set(v.playerId, (countMap.get(v.playerId) || 0) + 1);
  });

  return players
    .map((p) => ({
      playerId: p.id,
      playerName: `${p.firstName} ${p.lastName}`,
      playerNumber: p.number,
      voteCount: countMap.get(p.id) || 0,
      votePercentage: total > 0 ? ((countMap.get(p.id) || 0) / total) * 100 : 0,
    }))
    .sort((a, b) => b.voteCount - a.voteCount);
}
