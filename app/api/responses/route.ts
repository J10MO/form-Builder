import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

// Submit a response to a form
export async function POST(request: NextRequest) {
  try {
    const sql = getDb()
    const body = await request.json()
    const { formId, data } = body

    if (!formId || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO responses (form_id, data)
      VALUES (${formId}, ${JSON.stringify(data)})
      RETURNING *
    `

    return NextResponse.json({ response: result[0] })
  } catch (error) {
    console.error("[v0] Error submitting response:", error)
    return NextResponse.json({ error: "Failed to submit response" }, { status: 500 })
  }
}

// Get all responses for a form
export async function GET(request: NextRequest) {
  try {
    const sql = getDb()
    const { searchParams } = new URL(request.url)
    const formId = searchParams.get("formId")

    if (!formId) {
      return NextResponse.json({ error: "Missing formId parameter" }, { status: 400 })
    }

    const responses = await sql`
      SELECT * FROM responses 
      WHERE form_id = ${formId}
      ORDER BY submitted_at DESC
    `

    return NextResponse.json({ responses })
  } catch (error) {
    console.error("[v0] Error fetching responses:", error)
    return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 })
  }
}
