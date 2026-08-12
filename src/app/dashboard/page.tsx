"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getDashboardData } from "../../lib/services/dashboardService"
import { DashboardData } from "../../lib/types"
import Link from "next/link"
import { FiPlus, FiLogOut, FiBook, FiClock, FiBarChart2 } from "react-icons/fi"
import { getSupabaseClient } from "../../lib/supabaseClient"
import { LoadingSpinner } from "../../components/LoadingSpinner"
import { useToast } from "../../lib/hooks/useToast"

export const dynamic = "force-dynamic"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      setError("Supabase n'est pas configuré.")
      setLoading(false)
      return
    }

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
        } else {
          setError("Non connecté")
        }
      } catch (err) {
        setError("Erreur de session")
      } finally {
        setLoading(false)
      }
    }

    checkSession()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) setUser(session.user)
      else setUser(null)
    })
    return () => subscription?.unsubscribe()
  }, [router])

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user?.id) return
    try {
      setLoadingData(true)
      setError(null)
      const data = await getDashboardData(user.id)
      setDashboardData(data)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Erreur lors du chargement des données")
      toast.error("Erreur lors du chargement des données")
    } finally {
      setLoadingData(false)
    }
  }

  const handleLogout = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) return
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (err) {
      toast.error("Erreur de déconnexion")
    }
  }

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-2xl text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
        <p className="text-gray-700 mb-6">{error}</p>
        <button onClick={() => router.push("/")} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          Retour à l'accueil
        </button>
      </div>
    </div>
  )

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement de la session...</div>
  if (!user) return <div className="min-h-screen flex items-center justify-center">Veuillez vous connecter</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FiBook className="text-2xl text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">TimeToBooks</h1>
          </div>
          <div className="flex items-center gap-4">
            {user?.photoURL && (
              <img src={user.photoURL} alt="Profil" className="w-10 h-10 rounded-full" />
            )}
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <FiLogOut /> Déconnexion
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingData ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner message="Chargement des données..." />
          </div>
        ) : dashboardData ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FiBook className="text-2xl text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Projets</h3>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.projectsCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FiClock className="text-2xl text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Sessions</h3>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.totalSessions}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FiBarChart2 className="text-2xl text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Mots écrits</h3>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.totalWords}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Projects Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Vos projets</h2>
                <Link href="/projets" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <FiPlus /> Nouveau projet
                </Link>
              </div>
              
              {dashboardData.projectsCount > 0 ? (
                <p className="text-center text-gray-600 py-8">
                  Vous avez {dashboardData.projectsCount} projet(s). 
                  <Link href="/projets" className="text-blue-600 hover:underline">Voir tous les projets</Link>
                </p>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Vous n'avez pas encore de projet</p>
                  <Link href="/projets" className="text-blue-600 hover:text-blue-800">
                    Créer votre premier projet
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucune donnée disponible</p>
            <button onClick={fetchDashboardData} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Réessayer
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
