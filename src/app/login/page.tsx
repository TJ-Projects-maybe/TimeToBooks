"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "../../lib/supabaseClient"
import { FcGoogle } from "react-icons/fc"
import { LoadingSpinner, FullPageLoadingSpinner } from "../../components/LoadingSpinner"
import { useToast } from "../../lib/hooks/useToast"
import { getIconAriaLabel } from "../../lib/utils/a11y"

export const dynamic = "force-dynamic"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [supabaseAvailable, setSupabaseAvailable] = useState<boolean | null>(null)
  const router = useRouter()
  const toast = useToast()

  // Check if Supabase is available (client-side only)
  useEffect(() => {
    const supabase = getSupabaseClient()
    setSupabaseAvailable(!!supabase)
    
    // If Supabase is not available, check if env vars are missing
    if (!supabase) {
      console.error('Supabase client is null. Check your environment variables:')
      console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    }
  }, [])

  const handleGoogleSignIn = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      setError("Supabase n'est pas configuré correctement. Vérifiez les variables d'environnement.")
      toast.error("Configuration Supabase manquante")
      return
    }
    
    try {
      setLoading(true)
      setError("")
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
      })
      if (authError) {
        throw authError
      }
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || "Erreur de connexion avec Google"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = getSupabaseClient()
    if (!supabase) {
      setError("Supabase n'est pas configuré correctement. Vérifiez les variables d'environnement.")
      toast.error("Configuration Supabase manquante")
      return
    }
    
    try {
      setLoading(true)
      setError("")

      if (isLogin) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (authError) {
          throw authError
        }
        toast.success("Connexion réussie !")
        router.push("/dashboard")
      } else {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
        })
        if (authError) {
          throw authError
        }
        toast.success("Inscription réussie ! Veuillez vérifier votre email.")
        router.push("/dashboard")
      }
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || "Erreur d'authentification"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking Supabase availability
  if (supabaseAvailable === null) {
    return <FullPageLoadingSpinner message="Vérification de la configuration..." />
  }

  // If Supabase is not available, show clear error message
  if (!supabaseAvailable) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Configuration Supabase manquante
          </h1>
          <div className="space-y-4 text-left">
            <p className="text-gray-700">
              Les variables d'environnement nécessaires pour Supabase ne sont pas configurées.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800">
              <p><strong>Variables requises :</strong></p>
              <code className="block my-1">NEXT_PUBLIC_SUPABASE_URL</code>
              <code className="block my-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
            </div>
            <p className="text-gray-700">
              Configurez ces variables dans votre projet Vercel sous <strong>Settings &gt; Environment Variables</strong>.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-blue-600">
          TimeToBooks
        </h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          {isLogin ? "Connexion" : "Inscription"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          {error && (
            <div
              className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              aria-label={getIconAriaLabel("google", "Se connecter avec")}
              aria-busy={loading}
            >
              <FcGoogle className="text-xl" aria-hidden="true" />
              <span>Continuer avec Google</span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  aria-required="true"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  aria-required="true"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" color="white" message="" />
                    Chargement...
                  </>
                ) : isLogin ? (
                  "Se connecter"
                ) : (
                  "S'inscrire"
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
