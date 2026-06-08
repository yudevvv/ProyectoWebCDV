import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

// ---- Predictions ----
export async function submitPrediction(
  clubId: string,
  matchId: string,
  userId: string,
  predictedHomeScore: number,
  predictedAwayScore: number
) {
  if (!db) throw new Error("Firestore not initialized");

  const docRef = await addDoc(collection(db, "predictions"), {
    clubId,
    matchId,
    userId,
    predictedHomeScore,
    predictedAwayScore,
    points: 0,
    exactScore: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getPredictions(matchId: string) {
  if (!db) return [];
  const q = query(
    collection(db, "predictions"),
    where("matchId", "==", matchId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getUserPredictions(clubId: string, userId: string) {
  if (!db) return [];
  const q = query(
    collection(db, "predictions"),
    where("clubId", "==", clubId),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ---- Polls ----
export async function getActivePolls(clubId: string) {
  if (!db) return [];
  const q = query(
    collection(db, "polls"),
    where("clubId", "==", clubId),
    where("active", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function castPollVote(pollId: string, optionId: string) {
  if (!db) throw new Error("Firestore not initialized");
  const pollRef = doc(db, "polls", pollId);
  // Increment vote count for option (using array approach for simplicity)
  const snap = await getDocs(query(collection(db, "polls"), where("__name__", "==", pollId)));
  // Since we can't do array increment easily, we store votes in a subcollection
  await addDoc(collection(db, "polls", pollId, "votes"), {
    optionId,
    createdAt: serverTimestamp(),
  });
}
