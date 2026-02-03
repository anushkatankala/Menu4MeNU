import { useEffect, useState, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { AuthContext, Profile } from "./AuthContext"
import type { User, Session, AuthError } from "@supabase/supabase-js"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      if (data.session?.user) {
        fetchProfile(data.session.user.id)
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    const res = await fetch(`${API_BASE_URL}/api/users/${userId}`)
    if (res.ok) {
      setProfile(await res.json())
    }
  }

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

    if (data.user) {
      await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.user.id,
          email,
          username,
          first_name: firstName,
        }),
      })
      await fetchProfile(data.user.id)
    }

    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (data.user) {
      await fetchProfile(data.user.id)
      await migrateFavorites(data.user.id)
    }

    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  const migrateFavorites = async (userId: string) => {
    const local = JSON.parse(localStorage.getItem("favorites") || "[]") as number[]
    if (local.length === 0) return

    for (const recipeId of local) {
      await fetch(`${API_BASE_URL}/api/users/${userId}/favorites/${recipeId}`, {
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
