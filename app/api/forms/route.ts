// import { type NextRequest, NextResponse } from "next/server"
// import { getDb } from "@/lib/db"
// import { nanoid } from "nanoid"

// // Create a new form
// export async function POST(request: NextRequest) {
//   try {
//     const sql = getDb()
//     const body = await request.json()
//     const { userId, title, description, fields } = body

//     if (!userId || !title || !fields) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//     }

//     const shareToken = nanoid(10)

//     const result = await sql`
//       INSERT INTO forms (user_id, title, description, fields, share_token)
//       VALUES (${userId}, ${title}, ${description || ""}, ${JSON.stringify(fields)}, ${shareToken})
//       RETURNING *
//     `

//     return NextResponse.json({ form: result[0] })
//   } catch (error) {
//     console.error("[v0] Error creating form:", error)
//     return NextResponse.json({ error: "Failed to create form" }, { status: 500 })
//   }
// }

// // Get all forms for a user
// export async function GET(request: NextRequest) {
//   try {
//     const sql = getDb()
//     const { searchParams } = new URL(request.url)
//     const userId = searchParams.get("userId")

//     if (!userId) {
//       return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
//     }

//     const forms = await sql`
//       SELECT * FROM forms 
//       WHERE user_id = ${userId}
//       ORDER BY created_at DESC
//     `

//     return NextResponse.json({ forms })
//   } catch (error) {
//     console.error("[v0] Error fetching forms:", error)
//     return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 })
//   }
// }




import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { nanoid } from "nanoid"

// Create a new form
export async function POST(request: NextRequest) {
  try {
    const sql = getDb()
    const body = await request.json()
    const { userId, title, description, fields, isPrivate = false } = body

    console.log("[v0] Creating form with data:", { userId, title, fieldsCount: fields?.length, isPrivate })

    if (!userId || !title || !fields) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const shareToken = nanoid(10)

    const fieldsJson = JSON.stringify(fields)

    console.log("[v0] Inserting form into database...")
    const result = await sql`
      INSERT INTO forms (user_id, title, description, fields, share_token, is_private)
      VALUES (${userId}, ${title}, ${description || ""}, ${fieldsJson}::jsonb, ${shareToken}, ${isPrivate})
      RETURNING *
    `

    console.log("[v0] Form created successfully:", result[0]?.id)
    return NextResponse.json({ form: result[0] })
  } catch (error) {
    console.error("[v0] Error creating form:", error)
    return NextResponse.json(
      {
        error: "Failed to create form",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// Get all forms for a user
export async function GET(request: NextRequest) {
  try {
    const sql = getDb()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    const forms = await sql`
      SELECT * FROM forms 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    return NextResponse.json({ forms })
  } catch (error) {
    console.error("[v0] Error fetching forms:", error)
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 })
  }
}
