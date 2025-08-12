import type { User } from "@/types/auth"

// Mock users for demonstration
const mockUsers: Array<User & { password: string }> = [
  {
    id: "1",
    email: "admin@petrotech.com",
    password: "admin123",
    name: "Sarah Johnson",
    role: "admin",
    company: "PetroTech Industries",
    permissions: ["view_all", "edit_all", "export_data", "manage_users"],
  },
  {
    id: "2",
    email: "operator@lonestar.com",
    password: "operator123",
    name: "Mike Rodriguez",
    role: "operator",
    company: "Lone Star Energy",
    permissions: ["view_facilities", "edit_facilities", "export_data"],
  },
  {
    id: "3",
    email: "viewer@midwest.com",
    password: "viewer123",
    name: "Emily Chen",
    role: "viewer",
    company: "Midwest Storage LLC",
    permissions: ["view_facilities"],
  },
]

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.email === email && u.password === password)
  if (user) {
    const { password: _, ...userWithoutPassword } = user
    return {
      ...userWithoutPassword,
      lastLogin: new Date().toISOString(),
    }
  }
  return null
}

export const getUserFromToken = async (token: string): Promise<User | null> => {
  // In a real app, this would validate the JWT token
  try {
    const userData = JSON.parse(atob(token))
    return userData
  } catch {
    return null
  }
}

export const createToken = (user: User): string => {
  // In a real app, this would create a proper JWT token
  return btoa(JSON.stringify(user))
}
