import { supabase } from "../supabaseClient"
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

export const createSession = clientOnly(async (session: Omit<WritingSession, "id" | "createdAt">): Promise<WritingSession> => {
  const newSession = {
    ...session,
    project_id: session.projectId,
    user_id: session.userId,
    words_written: session.wordsWritten,
    created_at: new Date().toISOString(),
  }
  
  const { data, error } = await supabase
    .from("writingSessions")
    .insert(newSession)
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
  
  const sessions = data.map(parseSession)
  
  // Cache the result
  setCached(cacheKey, sessions, CACHE_TTL)
  
  return sessions
})

export const getSessionsByUser = clientOnly(async (userId: string): Promise<WritingSession[]> => {
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
  
  const sessions = data.map(parseSession)
  
  // Cache the result
  setCached(cacheKey, sessions, CACHE_TTL)
  
  return sessions
})

export const getSessionById = clientOnly(async (id: string): Promise<WritingSession | null> => {
  const cacheKey = makeCacheKey('session', id)
  
  // Try to get from cache
  const cached = getCached<WritingSession>(cacheKey)
  if (cached) {
    return cached
  }
  
  const { data, error } = await supabase
    .from("writingSessions")
    .select("*")
    .eq("id", id)
    .single()
  
  if (error || !data) {
    return null
  }
  
  const session = parseSession(data)
  
  // Cache the result
  setCached(cacheKey, session, CACHE_TTL)
  
  return session
})

export const updateSession = clientOnly(async (id: string, data: Partial<Omit<WritingSession, "id" | "createdAt" | "userId" | "projectId">>) => {
  const updateData = {
    ...data,
    words_written: data.wordsWritten,
  }
  
  const { error } = await supabase
    .from("writingSessions")
    .update(updateData)
    .eq("id", id)
  
  if (error) {
    throw handleError(error)
  }
  
  // Invalidate cache
  const session = await getSessionById(id)
  if (session) {
    setCached(getUserSessionsCacheKey(session.userId), null, 0)
    setCached(getProjectSessionsCacheKey(session.projectId, session.userId), null, 0)
  }
  
  return getSessionById(id)
})

export const deleteSession = clientOnly(async (id: string) => {
  // Get session first to invalidate cache
  const session = await getSessionById(id)
  
  const { error } = await supabase
    .from("writingSessions")
    .delete()
    .eq("id", id)
  
  if (error) {
    throw handleError(error)
  }
  
  // Invalidate cache
  if (session) {
    setCached(getUserSessionsCacheKey(session.userId), null, 0)
    setCached(getProjectSessionsCacheKey(session.projectId, session.userId), null, 0)
    setCached(makeCacheKey('session', id), null, 0)
  }
})
