// import { getDb } from "@/lib/db"
// import { NextResponse } from "next/server"

// export async function GET() {
//   try {
//     const sql = getDb()

//     // Test connection
//     const timeResult = await sql`SELECT NOW() as current_time`
//     console.log("[v0] Database connection test successful:", timeResult[0].current_time)

//     // Create users table
//     await sql`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         email VARCHAR(255) UNIQUE NOT NULL,
//         name VARCHAR(255),
//         password_hash TEXT NOT NULL,
//         is_admin BOOLEAN DEFAULT false,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `

//     // Create forms table
//     await sql`
//       CREATE TABLE IF NOT EXISTS forms (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         title VARCHAR(500) NOT NULL,
//         description TEXT,
//         fields JSONB NOT NULL,
//         share_token VARCHAR(100) UNIQUE NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `

//     // Create responses table
//     await sql`
//       CREATE TABLE IF NOT EXISTS responses (
//         id SERIAL PRIMARY KEY,
//         form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
//         data JSONB NOT NULL,
//         submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `

//     // Create indexes
//     await sql`CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id)`
//     await sql`CREATE INDEX IF NOT EXISTS idx_forms_share_token ON forms(share_token)`
//     await sql`CREATE INDEX IF NOT EXISTS idx_responses_form_id ON responses(form_id)`

//     // Check existing tables
//     const tables = await sql`
//       SELECT table_name 
//       FROM information_schema.tables 
//       WHERE table_schema = 'public'
//       ORDER BY table_name
//     `

//     // Check user count
//     const userCount = await sql`SELECT COUNT(*) as count FROM users`

//     return NextResponse.json({
//       success: true,
//       message: "Database initialized successfully",
//       timestamp: timeResult[0].current_time,
//       tables: tables.map((t) => t.table_name),
//       userCount: Number.parseInt(userCount[0].count),
//     })
//   } catch (error: any) {
//     console.error("[v0] Database initialization error:", error)
//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message,
//         details: error.toString(),
//       },
//       { status: 500 },
//     )
//   }
// }


import { getDb } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sql = getDb()

    // Test connection
    const timeResult = await sql`SELECT NOW() as current_time`
    console.log("[v0] Database connection test successful:", timeResult[0].current_time)

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        password_hash TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create forms table
    await sql`
      CREATE TABLE IF NOT EXISTS forms (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        fields JSONB NOT NULL,
        share_token VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create responses table
    await sql`
      CREATE TABLE IF NOT EXISTS responses (
        id SERIAL PRIMARY KEY,
        form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
        data JSONB NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_forms_share_token ON forms(share_token)`
    await sql`CREATE INDEX IF NOT EXISTS idx_responses_form_id ON responses(form_id)`

    // Check existing tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    // Check user count
    const userCount = await sql`SELECT COUNT(*) as count FROM users`

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      timestamp: timeResult[0].current_time,
      tables: tables.map((t) => t.table_name),
      userCount: Number.parseInt(userCount[0].count),
    })
  } catch (error: any) {
    console.error("[v0] Database initialization error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
