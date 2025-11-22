// // // import { neon } from "@neondatabase/serverless"

// // // // Singleton pattern for database client
// // // let sql: ReturnType<typeof neon> | null = null

// // // export function getDb() {
// // //   if (!sql) {
// // //     const databaseUrl = process.env.DATABASE_URL

// // //     if (!databaseUrl) {
// // //       throw new Error("DATABASE_URL environment variable is not set. Please add it to your environment variables.")
// // //     }

// // //     sql = neon(databaseUrl)
// // //   }
// // //   return sql
// // // }

// // // // Types for our database models
// // // export interface User {
// // //   id: number
// // //   email: string
// // //   name?: string
// // //   password_hash?: string
// // //   is_admin?: boolean
// // //   created_at: Date
// // // }

// // // export interface FormField {
// // //   id: string
// // //   type: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio"
// // //   label: string
// // //   required: boolean
// // //   options?: string[] // For select, radio
// // // }

// // // export interface Form {
// // //   id: number
// // //   user_id: number
// // //   title: string
// // //   description?: string
// // //   fields: FormField[]
// // //   share_token: string
// // //   created_at: Date
// // //   updated_at: Date
// // // }

// // // export interface Response {
// // //   id: number
// // //   form_id: number
// // //   data: Record<string, any>
// // //   submitted_at: Date
// // // }



// // import { neon } from "@neondatabase/serverless"

// // // Singleton pattern for database client
// // let sql: ReturnType<typeof neon> | null = null

// // export function getDb() {
// //   if (!sql) {
// //     const databaseUrl = process.env.DATABASE_URL

// //     if (!databaseUrl) {
// //       throw new Error("DATABASE_URL environment variable is not set. Please add it to your environment variables.")
// //     }

// //     sql = neon(databaseUrl)
// //   }
// //   return sql
// // }

// // // Types for our database models
// // export interface User {
// //   id: number
// //   email: string
// //   name?: string
// //   password_hash?: string
// //   is_admin?: boolean
// //   created_at: Date
// // }

// // export interface FormField {
// //   id: string
// //   type: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio"
// //   label: string
// //   required: boolean
// //   options?: string[] // For select, radio
// // }

// // export interface Form {
// //   id: number
// //   user_id: number
// //   title: string
// //   description?: string
// //   fields: FormField[]
// //   share_token: string
// //   created_at: Date
// //   updated_at: Date
// // }

// // export interface Response {
// //   id: number
// //   form_id: number
// //   data: Record<string, any>
// //   submitted_at: Date
// // }


// import { neon } from "@neondatabase/serverless"

// // Singleton pattern for database client
// let sql: ReturnType<typeof neon> | null = null

// export function getDb() {
//   if (!sql) {
//     const databaseUrl = process.env.DATABASE_URL

//     if (!databaseUrl) {
//       throw new Error("DATABASE_URL environment variable is not set. Please add it to your environment variables.")
//     }

//     sql = neon(databaseUrl)
//   }
//   return sql
// }

// export const getSql = getDb

// // Types for our database models
// export interface User {
//   id: number
//   email: string
//   name?: string
//   password_hash?: string
//   is_admin?: boolean
//   created_at: Date
// }

// export interface FormField {
//   id: string
//   type: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio"
//   label: string
//   required: boolean
//   options?: string[] // For select, radio
// }

// export interface Form {
//   id: number
//   user_id: number
//   title: string
//   description?: string
//   fields: FormField[]
//   share_token: string
//   created_at: Date
//   updated_at: Date
// }

// export interface Response {
//   id: number
//   form_id: number
//   data: Record<string, any>
//   submitted_at: Date
// }




import { neon } from "@neondatabase/serverless"

// Singleton pattern for database client
let sql: ReturnType<typeof neon> | null = null
let isInitialized = false

// Database initialization SQL
const initSQL = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  fields JSONB NOT NULL DEFAULT '[]',
  share_token VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create responses table
CREATE TABLE IF NOT EXISTS responses (
  id SERIAL PRIMARY KEY,
  form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id);
CREATE INDEX IF NOT EXISTS idx_forms_share_token ON forms(share_token);
CREATE INDEX IF NOT EXISTS idx_responses_form_id ON responses(form_id);
`

async function initializeDatabase(db: ReturnType<typeof neon>) {
  if (isInitialized) return

  try {
    console.log("[v0] Initializing database tables...")
    await db(initSQL)
    isInitialized = true
    console.log("[v0] Database initialized successfully")
  } catch (error) {
    console.error("[v0] Database initialization error:", error)
    // Don't throw - tables might already exist
  }
}

export function getDb() {
  if (!sql) {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set. Please add it to your environment variables.")
    }

    sql = neon(databaseUrl)

    initializeDatabase(sql).catch(console.error)
  }
  return sql
}

export const getSql = getDb

// Types for our database models
export interface User {
  id: number
  email: string
  name?: string
  password_hash?: string
  is_admin?: boolean
  created_at: Date
}

export interface FormField {
  id: string
  type: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio"
  label: string
  required: boolean
  options?: string[] // For select, radio
}

export interface Form {
  id: number
  user_id: number
  title: string
  description?: string
  fields: FormField[]
  share_token: string
  created_at: Date
  updated_at: Date
}

export interface Response {
  id: number
  form_id: number
  data: Record<string, any>
  submitted_at: Date
}
