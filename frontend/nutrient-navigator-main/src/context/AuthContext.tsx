import { createContext } from "react"
import type { User, Session, AuthError } from "@supabase/supabase-js"

export interface Profile {
  id: string
  email: string
  username: string | null
  first_name: string | null
  household_id?: number | null
}

export interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (
    email: string,
    password: string,
    username?: string,
    firstName?: string
  ) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
