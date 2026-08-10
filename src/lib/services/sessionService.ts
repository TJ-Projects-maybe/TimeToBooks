import { getSupabaseClient } from "../supabaseClient"
import { WritingSession } from "../types"
import { clientOnly } from "../utils/clientOnly"
import { handleError } from "../utils/errors"
import { getCached, setCached, makeCacheKey } from "../utils/cache"

const CACHE_TTL = 60000 // 1 minute

const parseSession = (row: any): WritingSession => {
  return {
    id: row.id,
    projectId: row.project_id || row.projectId,
    userId: row.user_id || row.userId,
    date: new Date(row.date),
    wordsWritten: row.words_written || row.wordsWritten,
    notes: row.notes || "",
    createdAt: new Date(row.created_at || row.createdAt),
  }
}

const getUserSessionsCacheKey = (userId: string) => makeCacheKey('sessions', 'user', userId)
const getProjectSessionsCacheKey = (projectId: string, userId: string) => 
  makeCacheKey('sessions', 'project', projectId, 'user', userId)

// Type for session database row
interface SessionRow {
  id?: string
  project_id: string
  user_id: string
  date: string
  words_written: number
  notes?: string
  created_at: string
}

export const createSession = clientOnly(async (session: Omit<WritingSession, "id" | "createdAt">): Promise<WritingSession> => {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not available')
  }
  
  const newSession: SessionRow = {
    project_id: session.projectId,
    user_id: session.userId,
    date: session.date.toISOString(),
    words_written: session.wordsWritten,
    notes: session.notes,
    created_at: new Date().toISOString(),
  }
  
  const { data, error } = await supabase
    .from("writingSessions")
    .insert(newSession as never)
    .select()
    .single()
  
  if (error) {
    throw handleError(error)
  }
  
  // Invalidate cache
  setCached(getUserSessionsCacheKey(session.userId), null, 0)
  setCached(getProjectSessionsCacheKey(session.projectId, session.userId), null, 0)
  
  return parseSession(data)
})

export const getSessionsByProject = clientOnly(async (projectId: string, userId: string): Promise<WritingSession[]> => {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not available')
  }
  
  const cacheKey = getProjectSessionsCacheKey(projectId, userId)
  
  // Try to get from cache
  const cached = getCached<WritingSession[]>(cacheKey)
  if (cached) {
    return cached
  }
  
  const { data, error } = await supabase
    .from("writingSessions")
    .select("*")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .order("date", { ascending: false })
  
  if (error) {
    throw handleError(error)
  }
  
  const sessions = (data || []).map(parseSession)
  
  // Cache the result
  setCached(cacheKey, sessions, CACHE_TTL)
  
  return sessions
})

export const getSessionsByUser = clientOnly(async (userId: string): Promise<WritingSession[]> => {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not available')
  }
  
  const cacheKey = getUserSessionsCacheKey(userId)
  
  // Try to get from cache
  const cached = getCached<WritingSession[]>(cacheKey)
  if (cached) {
    return cached
  }
  
  const { data, error } = await supabase
    .from("writingSessions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
  
  if (error) {
    throw handleError(error)
  }
  
  const sessions = (data || []).map(parseSession)
  
  // Cache the result
  setCached(cacheKey, sessions, CACHE_TTL)
  
  return sessions
})

export const updateSession = clientOnly(async (id: string, session: Partial<Omit<WritingSession, "id" | "userId" | "createdAt">>, userId: string): Promise<WritingSession> => {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not available')
  }
  
  const updates: Record<string, any> = {
    project_id: session.projectId,
    words_written: session.wordsWritten,
    date: session.date?.toISOString(),
    notes: session.notes,
  }
  
  const { data, error } = await supabase
    .from("writingSessions")
    .update(updates as never)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()
  
  if (error) {
    throw handleError(error)
  }
  
  // Invalidate cache
  setCached(getUserSessionsCacheKey(userId), null, 0)
  setCached(getProjectSessionsCacheKey(session.projectId || "", userId), null, 0)
  
  return parseSession(data)
})

export const deleteSession = clientOnly(async (id: string, userId: string): Promise<void> => {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not available')
  }
  
  const { error } = await supabase
    .from("writingSessions")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
  
  if (error) {
    throw handleError(error)
  }
  
  // Invalidate cache
  setCached(getUserSessionsCacheKey(userId), null, 0)
})
