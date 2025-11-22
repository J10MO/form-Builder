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

export function getDb() {
  if (!sql) {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set. Please add it to your environment variables.")
    }

    sql = neon(databaseUrl)
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
