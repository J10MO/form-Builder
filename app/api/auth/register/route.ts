import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { hashPassword, setAuthCookie } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    console.log("[v0] Registration attempt for:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const sql = getDb()

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    console.log("[v0] Existing users check:", existingUsers.length)

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Create new user
    const passwordHash = hashPassword(password)

    console.log("[v0] Creating user with hashed password")

    const users = await sql`
      INSERT INTO users (email, name, password_hash, is_admin)
      VALUES (${email}, ${name || null}, ${passwordHash}, false)
      RETURNING id, email, name, is_admin
    `

    console.log("[v0] User created:", users[0])

    const user = users[0]

    // Set auth cookie
    await setAuthCookie(user.id)

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return NextResponse.json(
      {
        error: "Registration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
