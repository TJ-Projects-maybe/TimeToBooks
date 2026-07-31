"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/AuthProvider";
import { getProjectById } from "../../../lib/services/projectService";
import { getSessionsByProject, createSession, deleteSession } from "../../../lib/services/sessionService";
import { Project, WritingSession } from "../../../lib/types";
import Link from "next/link";
import { FiPlus, FiTrash2, FiArrowLeft, FiCalendar, FiType } from "react-icons/fi";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [sessions, setSessions] = useState<WritingSession[]>([]);
  const [newSession, setNewSession] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    wordsWritten: 0,
    notes: "",
  });
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, params.id]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [projectData, sessionsData] = await Promise.all([
        getProjectById(params.id),
        getSessionsByProject(params.id, user!.uid),
      ]);
      
      if (!projectData) {
        router.push("/projets");
        return;
      }
      
      setProject(projectData);
      setSessions(sessionsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const session = await createSession({
        ...newSession,
        projectId: params.id,
        userId: user!.uid,
        date: new Date(newSession.date),
      });
      setSessions([...sessions, session]);
      setNewSession({
        date: format(new Date(), "yyyy-MM-dd"),
        wordsWritten: 0,
        notes: "",
      });
    } catch (error) {
      console.error("Error creating session:", error);
      setError("Erreur lors de l'ajout de la session");
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await deleteSession(id);
      setSessions(sessions.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting session:", error);
      setError("Erreur lors de la suppression de la session");
    }
  };

  const totalWords = sessions.reduce((sum, session) => sum + session.wordsWritten, 0);

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Projet</h1>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Projet introuvable</h1>
          <Link href="/projets" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
            Retour aux projets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/projets")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <FiArrowLeft />
              Retour
            </button>
            <h1 className="text-xl font-bold text-gray-900">{project.title}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Project Info */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Objectif</h2>
              <p className="text-gray-700">{project.goal}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Progression</h2>
              <p className="text-3xl font-bold text-blue-600">{totalWords} mots</p>
              <p className="text-sm text-gray-500">
                {sessions.length} session{sessions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Add Session Form */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une session d'écriture</h2>
          <form onSubmit={handleCreateSession} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="words" className="block text-sm font-medium text-gray-700 mb-1">
                  Mots écrits
                </label>
                <input
                  id="words"
                  type="number"
                  value={newSession.wordsWritten}
                  onChange={(e) => setNewSession({ ...newSession, wordsWritten: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <input
                  id="notes"
                  type="text"
                  value={newSession.notes}
                  onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Chapitre 1"
                />
              </div>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
              <FiPlus />
              Ajouter la session
            </button>
          </form>
        </div>

        {/* Sessions List */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Sessions d'écriture ({sessions.length})
          </h2>
          
          {sessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FiCalendar className="inline mr-1" />
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FiType className="inline mr-1" />
                      Mots
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.date.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.wordsWritten}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {session.notes || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <FiTrash2 />
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucune session enregistrée. Ajoutez-en une pour commencer !
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
