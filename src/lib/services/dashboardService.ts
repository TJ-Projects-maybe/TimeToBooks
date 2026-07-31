import { getProjects } from "./projectService";
import { getSessionsByUser } from "./sessionService";
import { DashboardData } from "../types";
import { format, subDays } from "date-fns";

export const getDashboardData = async (userId: string): Promise<DashboardData> => {
  const [projects, sessions] = await Promise.all([
    getProjects(userId),
    getSessionsByUser(userId),
  ]);

  // Calculate total words and sessions
  const totalWords = sessions.reduce((sum, session) => sum + session.wordsWritten, 0);
  const totalSessions = sessions.length;
  const projectsCount = projects.length;

  // Get recent sessions (last 5)
  const recentSessions = [...sessions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  // Calculate progress over time (last 30 days)
  const thirtyDaysAgo = subDays(new Date(), 30);
  const filteredSessions = sessions.filter(
    (session) => session.date >= thirtyDaysAgo
  );

  const progressMap = new Map<string, number>();
  filteredSessions.forEach((session) => {
    const dateStr = format(session.date, "yyyy-MM-dd");
    progressMap.set(
      dateStr,
      (progressMap.get(dateStr) || 0) + session.wordsWritten
    );
  });

  const progressOverTime = Array.from(progressMap.entries()).map(([date, words]) => ({
    date,
    words,
  }));

  return {
    totalWords,
    totalSessions,
    projectsCount,
    recentSessions,
    progressOverTime,
  };
};
