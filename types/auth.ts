export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "operator" | "viewer"
  company: string
  lastLogin?: string
  permissions: string[]
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}
