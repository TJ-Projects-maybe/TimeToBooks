import { supabase } from "../supabaseClient";
import { Project } from "../types";

// Ensure Supabase is only used client-side
const ensureClientSide = () => {
  if (typeof window === "undefined") {
    throw new Error("Supabase cannot be used on the server. Use client-side only.");
  }
};

const parseProject = (row: any): Project => {
  return {
    id: row.id,
    title: row.title,
    goal: row.goal,
    userId: row.userId,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
};

export const createProject = async (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
  ensureClientSide();
  
  const newProject = {
    ...project,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const { data, error } = await supabase
    .from("projects")
    .insert(newProject)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return parseProject(data);
};

export const getProjects = async (userId: string): Promise<Project[]> => {
  ensureClientSide();
  
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data.map(parseProject);
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  ensureClientSide();
  
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return parseProject(data);
};

export const updateProject = async (id: string, data: Partial<Omit<Project, "id" | "createdAt" | "userId">>) => {
  ensureClientSide();
  
  const updateData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  const { error } = await supabase
    .from("projects")
    .update(updateData)
    .eq("id", id);
  
  if (error) {
    throw error;
  }
  
  return getProjectById(id);
};

export const deleteProject = async (id: string) => {
  ensureClientSide();
  
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);
  
  if (error) {
    throw error;
  }
};
