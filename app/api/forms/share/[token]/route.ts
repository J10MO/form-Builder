import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

// Get form by share token (public access)
export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const sql = getDb()
    const { token } = await params

    const result = await sql`
      SELECT * FROM forms WHERE share_token = ${token}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    return NextResponse.json({ form: result[0] })
  } catch (error) {
    console.error("[v0] Error fetching form:", error)
    return NextResponse.json({ error: "Failed to fetch form" }, { status: 500 })
  }
}
