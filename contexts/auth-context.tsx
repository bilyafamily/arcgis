"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { authenticateUser, getUserFromToken, createToken } from "@/lib/auth"
import type { AuthContextType, User } from "@/types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem("auth_token")
    if (token) {
      getUserFromToken(token).then((userData) => {
        if (userData) {
          setUser(userData)
        } else {
          localStorage.removeItem("auth_token")
        }
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const userData = await authenticateUser(email, password)
      if (userData) {
        setUser(userData)
        const token = createToken(userData)
        localStorage.setItem("auth_token", token)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_token")
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
