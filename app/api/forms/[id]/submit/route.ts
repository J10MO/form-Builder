// import { type NextRequest, NextResponse } from "next/server"
// import { getDb } from "@/lib/db"

// export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//   try {
//     const sql = getDb()
//     const { id } = await params
//     const body = await request.json()
//     const { data, userId } = body

//     if (!data) {
//       return NextResponse.json({ error: "Missing form data" }, { status: 400 })
//     }

//     const form = await sql`
//       SELECT * FROM forms WHERE id = ${id}
//     `

//     if (form.length === 0) {
//       return NextResponse.json({ error: "Form not found" }, { status: 404 })
//     }

//     // If form is private, only the owner can submit
//     if (form[0].is_private && form[0].user_id !== userId) {
//       return NextResponse.json(
//         {
//           error: "This form is private and only accessible by the owner",
//         },
//         { status: 403 },
//       )
//     }

//     // Insert the response
//     const result = await sql`
//       INSERT INTO responses (form_id, data)
//       VALUES (${id}, ${JSON.stringify(data)})
//       RETURNING *
//     `

//     return NextResponse.json({ response: result[0] })
//   } catch (error) {
//     console.error("[v0] Error submitting form:", error)
//     return NextResponse.json({ error: "Failed to submit form" }, { status: 500 })
//   }
// }



import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sql = getDb()
    const { id } = await params
    const body = await request.json()
    const { data } = body

    if (!data) {
      return NextResponse.json({ error: "Missing form data" }, { status: 400 })
    }

    // Get the current user
    const user = await getAuthUser()

    // Fetch the form to check privacy settings
    const forms = await sql`
      SELECT * FROM forms WHERE id = ${id}
    `

    if (forms.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    const form = forms[0]

    if (form.is_private) {
      if (!user) {
        return NextResponse.json(
          {
            error: "This form is private. Please log in to submit.",
          },
          { status: 401 },
        )
      }

      if (form.user_id !== user.id) {
        return NextResponse.json(
          {
            error: "This form is private and only accessible by the owner",
          },
          { status: 403 },
        )
      }
    }

    // Insert the response
    const result = await sql`
      INSERT INTO responses (form_id, data)
      VALUES (${id}, ${JSON.stringify(data)})
      RETURNING *
    `

    return NextResponse.json({ response: result[0] })
  } catch (error) {
    console.error("[v0] Error submitting form:", error)
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 })
  }
}
