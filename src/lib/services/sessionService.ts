import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc, DocumentData } from "firebase/firestore";
import { WritingSession } from "../types";

const sessionsCollection = collection(db, "writingSessions");

const parseSession = (doc: DocumentData): WritingSession => {
  const data = doc.data();
  return {
    id: doc.id,
    projectId: data.projectId,
    userId: data.userId,
    date: data.date.toDate(),
    wordsWritten: data.wordsWritten,
    notes: data.notes || "",
    createdAt: data.createdAt.toDate(),
  };
};

export const createSession = async (session: Omit<WritingSession, "id" | "createdAt">): Promise<WritingSession> => {
  const newSession = {
    ...session,
    createdAt: new Date(),
  };
  const docRef = await addDoc(sessionsCollection, newSession);
  return { ...newSession, id: docRef.id } as WritingSession;
};

export const getSessionsByProject = async (projectId: string, userId: string): Promise<WritingSession[]> => {
  const q = query(
    sessionsCollection,
    where("projectId", "==", projectId),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(parseSession);
};

export const getSessionsByUser = async (userId: string): Promise<WritingSession[]> => {
  const q = query(sessionsCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(parseSession);
};

export const getSessionById = async (id: string): Promise<WritingSession | null> => {
  const docRef = doc(db, "writingSessions", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return parseSession(snapshot);
};

export const updateSession = async (id: string, data: Partial<Omit<WritingSession, "id" | "createdAt" | "userId" | "projectId">>) => {
  const docRef = doc(db, "writingSessions", id);
  await updateDoc(docRef, data);
  return getSessionById(id);
};

export const deleteSession = async (id: string) => {
  const docRef = doc(db, "writingSessions", id);
  await deleteDoc(docRef);
};
