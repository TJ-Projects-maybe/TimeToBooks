"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/hooks/useAuth";
import { getProjects, createProject, deleteProject } from "../../lib/services/projectService";
import { Project } from "../../lib/types";
import Link from "next/link";
import { FiPlus, FiTrash2, FiEdit, FiEye, FiArrowLeft } from "react-icons/fi";

export const dynamic = 'force-dynamic';

export default function ProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({ title: "", goal: "" });
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      setLoadingData(true);
      const data = await getProjects(user!.id);
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Erreur lors du chargement des projets");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const project = await createProject({
        ...newProject,
        userId: user!.id,
      });
      setProjects([...projects, project]);
      setNewProject({ title: "", goal: "" });
    } catch (error) {
      console.error("Error creating project:", error);
      setError("Erreur lors de la cration du projet");
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Erreur lors de la suppression du projet");
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Projets</h1>
          <p className="text-gray-600">Chargement...</p>
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
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <FiArrowLeft />
              Retour
            </button>
            <h1 className="text-xl font-bold text-gray-900">Mes Projets</h1>
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

        {/* Create Project Form */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Crer un nouveau projet</h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Titre du projet
                </label>
                <input
                  id="title"
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mon roman"
                />
              </div>
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                  Objectif (en mots)
                </label>
                <input
                  id="goal"
                  type="text"
                  value={newProject.goal}
                  onChange={(e) => setNewProject({ ...newProject, goal: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="crire 50 000 mots"
                />
              </div>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
              <FiPlus />
              Crer le projet
            </button>
          </form>
        </div>

        {/* Projects List */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mes projets ({projects.length})</h2>
          
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{project.goal}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Cr le {project.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/projets/${project.id}`}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FiEye />
                      Voir
                    </Link>
                    <Link
                      href={`/projets/${project.id}/edit`}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FiEdit />
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FiTrash2 />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucun projet cr. Commencez par en crer un !
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
