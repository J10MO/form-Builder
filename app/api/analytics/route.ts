// import { NextResponse } from "next/server"
// import { getAuthUser } from "@/lib/auth"
// import { getSql } from "@/lib/db"

// export async function GET() {
//   try {
//     const user = await getAuthUser()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const sql = getSql()

//     // Get comprehensive analytics
//     const totalForms = await sql`
//       SELECT COUNT(*) as count FROM forms WHERE user_id = ${user.id}
//     `

//     const totalResponses = await sql`
//       SELECT COUNT(*) as count FROM responses r
//       INNER JOIN forms f ON r.form_id = f.id
//       WHERE f.user_id = ${user.id}
//     `

//     const formsWithDetails = await sql`
//       SELECT 
//         f.id,
//         f.title,
//         f.description,
//         f.fields,
//         f.share_token,
//         f.created_at,
//         f.updated_at,
//         COUNT(r.id) as response_count
//       FROM forms f
//       LEFT JOIN responses r ON f.id = r.form_id
//       WHERE f.user_id = ${user.id}
//       GROUP BY f.id, f.title, f.description, f.fields, f.share_token, f.created_at, f.updated_at
//       ORDER BY f.created_at DESC
//     `

//     const recentActivity = await sql`
//       SELECT 
//         r.id,
//         r.form_id,
//         r.data,
//         r.submitted_at,
//         f.title as form_title
//       FROM responses r
//       INNER JOIN forms f ON r.form_id = f.id
//       WHERE f.user_id = ${user.id}
//       ORDER BY r.submitted_at DESC
//       LIMIT 20
//     `

//     return NextResponse.json({
//       success: true,
//       analytics: {
//         totalForms: Number(totalForms[0]?.count || 0),
//         totalResponses: Number(totalResponses[0]?.count || 0),
//         forms: formsWithDetails,
//         recentActivity,
//       },
//     })
//   } catch (error) {
//     console.error("[v0] Analytics error:", error)
//     return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
//   }
// }




import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { getSql } from "@/lib/db"

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sql = getSql()

    // Get comprehensive analytics
    const totalForms = await sql`
      SELECT COUNT(*) as count FROM forms WHERE user_id = ${user.id}
    `

    const totalResponses = await sql`
      SELECT COUNT(*) as count FROM responses r
      INNER JOIN forms f ON r.form_id = f.id
      WHERE f.user_id = ${user.id}
    `

    const formsWithDetails = await sql`
      SELECT 
        f.id,
        f.title,
        f.description,
        f.fields,
        f.share_token,
        f.created_at,
        f.updated_at,
        COUNT(r.id) as response_count
      FROM forms f
      LEFT JOIN responses r ON f.id = r.form_id
      WHERE f.user_id = ${user.id}
      GROUP BY f.id, f.title, f.description, f.fields, f.share_token, f.created_at, f.updated_at
      ORDER BY f.created_at DESC
    `

    const recentActivity = await sql`
      SELECT 
        r.id,
        r.form_id,
        r.data,
        r.submitted_at,
        f.title as form_title
      FROM responses r
      INNER JOIN forms f ON r.form_id = f.id
      WHERE f.user_id = ${user.id}
      ORDER BY r.submitted_at DESC
      LIMIT 20
    `

    const dailyStats = await sql`
      SELECT 
        DATE(r.submitted_at) as date,
        COUNT(*) as count
      FROM responses r
      INNER JOIN forms f ON r.form_id = f.id
      WHERE f.user_id = ${user.id}
      GROUP BY DATE(r.submitted_at)
      ORDER BY date DESC
      LIMIT 30
    `

    const formattedDailyStats = dailyStats
      .map((stat: any) => ({
        date: new Date(stat.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: Number(stat.count),
      }))
      .reverse()

    return NextResponse.json({
      success: true,
      data: {
        totalForms: Number(totalForms[0]?.count || 0),
        totalResponses: Number(totalResponses[0]?.count || 0),
        formsWithResponses: formsWithDetails,
        recentResponses: recentActivity,
        dailyStats: formattedDailyStats,
      },
    })
  } catch (error) {
    console.error("[v0] Analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
