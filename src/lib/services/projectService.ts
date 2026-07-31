import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc, DocumentData } from "firebase/firestore";
import { Project } from "../types";

const projectsCollection = collection(db, "projects");

const parseProject = (doc: DocumentData): Project => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    goal: data.goal,
    userId: data.userId,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
};

export const createProject = async (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
  const newProject = {
    ...project,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const docRef = await addDoc(projectsCollection, newProject);
  return { ...newProject, id: docRef.id } as Project;
};

export const getProjects = async (userId: string): Promise<Project[]> => {
  const q = query(projectsCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(parseProject);
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  const docRef = doc(db, "projects", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return parseProject(snapshot);
};

export const updateProject = async (id: string, data: Partial<Omit<Project, "id" | "createdAt" | "userId">>) => {
  const docRef = doc(db, "projects", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  });
  return getProjectById(id);
};

export const deleteProject = async (id: string) => {
  const docRef = doc(db, "projects", id);
  await deleteDoc(docRef);
};
