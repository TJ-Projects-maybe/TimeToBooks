import { getProjects } from "./projectService"
import { getSessionsByUser } from "./sessionService"
import { DashboardData } from "../types"
import { format, subDays } from "date-fns"

export const getDashboardData = async (userId: string): Promise<DashboardData> => {
  try {
    // Fetch projects and sessions in parallel
    const [projects, sessions] = await Promise.all([
      getProjects(userId),
      getSessionsByUser(userId)
    ])

    // Calculate total words
    const totalWords = sessions.reduce((sum, session) => sum + session.wordsWritten, 0)

    // Calculate progress over time (last 30 days)
    const thirtyDaysAgo = subDays(new Date(), 30)
    const recentSessions = sessions.filter(session => new Date(session.date) >= thirtyDaysAgo)
    
    const progressOverTime: { date: string; words: number }[] = []
    const sessionsByDate = new Map<string, number>()
    
    recentSessions.forEach(session => {
      const dateStr = format(new Date(session.date), 'yyyy-MM-dd')
      const currentWords = sessionsByDate.get(dateStr) || 0
      sessionsByDate.set(dateStr, currentWords + session.wordsWritten)
    })
    
    // Convert map to array and sort by date
    Array.from(sessionsByDate.entries()).sort(([dateA], [dateB]) => {
      return new Date(dateA).getTime() - new Date(dateB).getTime()
    }).forEach(([date, words]) => {
      progressOverTime.push({ date, words })
    })

    return {
      totalWords,
      totalSessions: sessions.length,
      projectsCount: projects.length,
      recentSessions: sessions.slice(0, 5),
      progressOverTime
    }
  } catch (error) {
    console.error("Error in getDashboardData:", error)
    // Return empty data on error
    return {
      totalWords: 0,
      totalSessions: 0,
      projectsCount: 0,
      recentSessions: [],
      progressOverTime: []
    }
  }
}
