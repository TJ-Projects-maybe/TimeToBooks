import { supabase } from "../supabaseClient"
import { Project } from "../types"
import { clientOnly } from "../utils/clientOnly"
import { handleError, notFoundError, AppError } from "../utils/errors"
import { getCached, setCached, makeCacheKey } from "../utils/cache"

const CACHE_TTL = 60000 // 1 minute

const parseProject = (row: any): Project => {
  return {
    id: row.id,
    title: row.title,
    goal: row.goal,
    userId: row.user_id || row.userId,
    createdAt: new Date(row.created_at || row.createdAt),
    updatedAt: new Date(row.updated_at || row.updatedAt),
  }
}

const getCacheKey = (userId: string) => makeCacheKey('projects', userId)

export const createProject = clientOnly(async (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
  const newProject = {
    ...project,
    user_id: project.userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  
  const { data, error } = await supabase
    .from("projects")
    .insert(newProject)
    .select()
    .single()
  
  if (error) {
    throw handleError(error)
  }
  
  // Invalidate cache
  const cacheKey = getCacheKey(project.userId)
  setCached(cacheKey, null, 0)
  
  return parseProject(data)
})

export const getProjects = clientOnly(async (userId: string): Promise<Project[]> => {
  const cacheKey = getCacheKey(userId)
  
  // Try to get from cache
  const cached = getCached<Project[]>(cacheKey)
  if (cached) {
    return cached
  }
  
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  
  if (error) {
    throw handleError(error)
  }
  
  const projects = data.map(parseProject)
  
  // Cache the result
  setCached(cacheKey, projects, CACHE_TTL)
  
  return projects
})

export const getProjectById = clientOnly(async (id: string): Promise<Project | null> => {
  const cacheKey = makeCacheKey('project', id)
  
  // Try to get from cache
  const cached = getCached<Project>(cacheKey)
  if (cached) {
    return cached
  }
  
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single()
  
  if (error) {
    if (error.message?.includes('not found') || error.message?.includes('No rows')) {
      return null
    }
    throw handleError(error)
  }
  
  if (!data) {
    return null
  }
  
  const project = parseProject(data)
  
  // Cache the result
  setCached(cacheKey, project, CACHE_TTL)
  
  return project
})

export const updateProject = clientOnly(async (id: string, data: Partial<Omit<Project, "id" | "createdAt" | "userId">>) => {
  const updateData = {
    ...data,
    updated_at: new Date().toISOString(),
  }
  
  const { error } = await supabase
    .from("projects")
    .update(updateData)
    .eq("id", id)
  
  if (error) {
    throw handleError(error)
  }
  
  // Invalidate cache for this project and user's projects
  const project = await getProjectById(id)
  if (project) {
    const userCacheKey = getCacheKey(project.userId)
    setCached(userCacheKey, null, 0)
  }
  
  return getProjectById(id)
})

export const deleteProject = clientOnly(async (id: string) => {
  // Get project first to invalidate user cache
  const project = await getProjectById(id)
  
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
  
  if (error) {
    throw handleError(error)
  }
  
  // Invalidate cache
  if (project) {
    const userCacheKey = getCacheKey(project.userId)
    setCached(userCacheKey, null, 0)
    setCached(makeCacheKey('project', id), null, 0)
  }
})
