import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

// Get a specific form
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sql = getDb()
    const { id } = await params

    const result = await sql`
      SELECT * FROM forms WHERE id = ${id}
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

// Update a form
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sql = getDb()
    const { id } = await params
    const body = await request.json()
    const { title, description, fields } = body

    const result = await sql`
      UPDATE forms 
      SET 
        title = ${title},
        description = ${description || ""},
        fields = ${JSON.stringify(fields)},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    return NextResponse.json({ form: result[0] })
  } catch (error) {
    console.error("[v0] Error updating form:", error)
    return NextResponse.json({ error: "Failed to update form" }, { status: 500 })
  }
}

// Delete a form
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sql = getDb()
    const { id } = await params

    await sql`DELETE FROM forms WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting form:", error)
    return NextResponse.json({ error: "Failed to delete form" }, { status: 500 })
  }
}
