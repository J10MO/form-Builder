import { cookies } from "next/headers"
import { getDb } from "./db"

export interface AuthUser {
  id: number
  email: string
  name?: string
  is_admin: boolean
}

// Simple session management using cookies
export async function setAuthCookie(userId: number) {
  const cookieStore = await cookies()
  cookieStore.set("auth_user_id", userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth_user_id")
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("auth_user_id")?.value

    if (!userId) return null

    const sql = getDb()
    const users = await sql`
      SELECT id, email, name, is_admin 
      FROM users 
      WHERE id = ${Number.parseInt(userId)}
    `

    if (users.length === 0) return null

    return users[0] as AuthUser
  } catch (error) {
    console.error("[v0] Error getting auth user:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getAuthUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

// Simple password hashing (in production, use bcrypt)
export function hashPassword(password: string): string {
  // Note: This is a simplified hash for demo purposes
  // In production, use bcrypt or another secure hashing library
  return Buffer.from(password).toString("base64")
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}
