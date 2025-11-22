import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sql = getDb()
    const { id } = await params
    const body = await request.json()
    const { userId, isPrivate } = body

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    // Verify the user owns this form
    const form = await sql`
      SELECT * FROM forms WHERE id = ${id} AND user_id = ${userId}
    `

    if (form.length === 0) {
      return NextResponse.json({ error: "Form not found or access denied" }, { status: 404 })
    }

    // Update privacy setting
    const updated = await sql`
      UPDATE forms 
      SET is_private = ${isPrivate}
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `

    return NextResponse.json({ form: updated[0] })
  } catch (error) {
    console.error("[v0] Error toggling form privacy:", error)
    return NextResponse.json({ error: "Failed to update form privacy" }, { status: 500 })
  }
}
