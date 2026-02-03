import { useEffect, useState, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { AuthContext, Profile } from "./AuthContext"
import type { User, Session } from "@supabase/supabase-js"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize Supabase session and user
  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    initSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (!session?.user) {
        setProfile(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // Sign-up using Supabase
  const signUp = async (
    email: string,
    password: string,
    username?: string,
    firstName?: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, first_name: firstName },
      },
    })

    // Set user in state
    if (data.user) {
      setUser(data.user)
      setProfile({
        id: data.user.id,
        email,
        username,
        first_name: firstName,
      })
    }

    return { error }
  }

  // Sign-in using Supabase
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (data.user) {
      setUser(data.user)
      // Profile info from Supabase user metadata
      setProfile({
        id: data.user.id,
        email: data.user.email ?? "",
        username: data.user.user_metadata.username,
        first_name: data.user.user_metadata.first_name,
      })

      // Migrate local favorites to database
      await migrateFavorites(data.user.id)
    }

    return { error }
  }

  // Sign-out
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  // Migrate local favorites to Supabase-backed favorites
  const migrateFavorites = async (userId: string) => {
    const localFavorites = JSON.parse(localStorage.getItem("favorites") || "[]") as number[]
    if (localFavorites.length === 0) return

    for (const recipeId of localFavorites) {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/users/${userId}/favorites/${recipeId}`, {
        method: "POST",
      })
    }

    localStorage.removeItem("favorites")
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, session, loading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}
