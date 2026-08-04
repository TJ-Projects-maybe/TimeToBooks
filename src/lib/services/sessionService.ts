import { supabase } from "../supabaseClient";
import { WritingSession } from "../types";

// Ensure Supabase is only used client-side
const ensureClientSide = () => {
  if (typeof window === "undefined") {
    throw new Error("Supabase cannot be used on the server. Use client-side only.");
  }
};

const parseSession = (row: any): WritingSession => {
  return {
    id: row.id,
    projectId: row.projectId,
    userId: row.userId,
    date: new Date(row.date),
    wordsWritten: row.wordsWritten,
    notes: row.notes || "",
    createdAt: new Date(row.createdAt),
  };
};

export const createSession = async (session: Omit<WritingSession, "id" | "createdAt">): Promise<WritingSession> => {
  ensureClientSide();
  
  const newSession = {
    ...session,
    createdAt: new Date().toISOString(),
  };
  
  const { data, error } = await supabase
    .from("writingSessions")
    .insert(newSession)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return parseSession(data);
};

export const getSessionsByProject = async (projectId: string, userId: string): Promise<WritingSession[]> => {
  ensureClientSide();
  
  const { data, error } = await supabase
    .from("writingSessions")
    .select("*")
    .eq("projectId", projectId)
    .eq("userId", userId)
    .order("date", { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data.map(parseSession);
};

export const getSessionsByUser = async (userId: string): Promise<WritingSession[]> => {
  ensureClientSide();
  
  const { data, error } = await supabase
    .from("writingSessions")
    .select("*")
    .eq("userId", userId)
    .order("date", { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data.map(parseSession);
};

export const getSessionById = async (id: string): Promise<WritingSession | null> => {
  ensureClientSide();
  
  const { data, error } = await supabase
    .from("writingSessions")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return parseSession(data);
};

export const updateSession = async (id: string, data: Partial<Omit<WritingSession, "id" | "createdAt" | "userId" | "projectId">>) => {
  ensureClientSide();
  
  const { error } = await supabase
    .from("writingSessions")
    .update(data)
    .eq("id", id);
  
  if (error) {
    throw error;
  }
  
  return getSessionById(id);
};

export const deleteSession = async (id: string) => {
  ensureClientSide();
  
  const { error } = await supabase
    .from("writingSessions")
    .delete()
    .eq("id", id);
  
  if (error) {
    throw error;
  }
};
