import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] Testing database connection...")
    const sql = getDb()

    // Test basic query
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`

    console.log("[v0] Database connection successful!")
    console.log("[v0] PostgreSQL version:", result[0].pg_version)

    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    console.log(
      "[v0] Existing tables:",
      tables.map((t) => t.table_name),
    )

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      timestamp: result[0].current_time,
      version: result[0].pg_version,
      tables: tables.map((t) => t.table_name),
    })
  } catch (error) {
    console.error("[v0] Database connection failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : null,
      },
      { status: 500 },
    )
  }
}
