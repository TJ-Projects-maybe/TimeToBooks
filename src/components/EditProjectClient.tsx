"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/hooks/useAuth";
import { getProjectById, updateProject } from "../lib/services/projectService";
import { Project } from "../lib/types";
import Link from "next/link";
import { FiArrowLeft, FiCheck, FiX } from "react-icons/fi";

export default function EditProjectClient({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ title: "", goal: "" });
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchProject();
    }
  }, [user, params.id]);

  const fetchProject = async () => {
    try {
      setLoadingData(true);
      const projectData = await getProjectById(params.id, user?.id || "");
      
      if (!projectData) {
        router.push("/projets");
        return;
      }
      
      setProject(projectData);
      setFormData({
        title: projectData.title,
        goal: projectData.goal,
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      setError("Erreur lors du chargement du projet");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      await updateProject(params.id, formData);
      setSuccess("Projet mis  jour avec succs !");
      
      // Refresh data
      await fetchProject();
    } catch (error) {
      console.error("Error updating project:", error);
      setError("Erreur lors de la mise  jour du projet");
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Modifier le projet</h1>
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
              onClick={() => router.push(`/projets/${params.id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <FiArrowLeft />
              Retour
            </button>
            <h1 className="text-xl font-bold text-gray-900">Modifier le projet</h1>
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
        
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Titre du projet
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mon roman"
              />
            </div>

            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                Objectif (en mots)
              </label>
              <textarea
                id="goal"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="crire 50 000 mots pour mon roman"
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                <FiCheck />
                Enregistrer les modifications
              </button>
              <Link href={`/projets/${params.id}`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                <FiX />
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
