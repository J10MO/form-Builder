// import { neon } from "@neondatabase/serverless"

// async function initDatabase() {
//   const databaseUrl = process.env.DATABASE_URL

//   if (!databaseUrl) {
//     console.error("❌ DATABASE_URL is not set!")
//     process.exit(1)
//   }

//   console.log("🔄 Connecting to Neon database...")
//   const sql = neon(databaseUrl)

//   try {
//     // Test connection
//     console.log("🔄 Testing database connection...")
//     await sql`SELECT NOW() as current_time`
//     console.log("✅ Database connection successful!")

//     // Create users table
//     console.log("🔄 Creating users table...")
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
//     console.log("✅ Users table created")

//     // Create forms table
//     console.log("🔄 Creating forms table...")
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
//     console.log("✅ Forms table created")

//     // Create responses table
//     console.log("🔄 Creating responses table...")
//     await sql`
//       CREATE TABLE IF NOT EXISTS responses (
//         id SERIAL PRIMARY KEY,
//         form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
//         data JSONB NOT NULL,
//         submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `
//     console.log("✅ Responses table created")

//     // Create indexes for better performance
//     console.log("🔄 Creating indexes...")
//     await sql`CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id)`
//     await sql`CREATE INDEX IF NOT EXISTS idx_forms_share_token ON forms(share_token)`
//     await sql`CREATE INDEX IF NOT EXISTS idx_responses_form_id ON responses(form_id)`
//     console.log("✅ Indexes created")

//     // Check existing tables
//     console.log("\n📊 Checking database tables...")
//     const tables = await sql`
//       SELECT table_name 
//       FROM information_schema.tables 
//       WHERE table_schema = 'public'
//       ORDER BY table_name
//     `
//     console.log("Tables in database:", tables.map((t) => t.table_name).join(", "))

//     console.log("\n✅ Database initialization complete!")
//   } catch (error) {
//     console.error("❌ Database initialization failed:", error)
//     throw error
//   }
// }

// initDatabase()



import { neon } from "@neondatabase/serverless"

async function initDatabase() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not set!")
    process.exit(1)
  }

  console.log("🔄 Connecting to Neon database...")
  const sql = neon(databaseUrl)

  try {
    // Test connection
    console.log("🔄 Testing database connection...")
    await sql`SELECT NOW() as current_time`
    console.log("✅ Database connection successful!")

    // Create users table
    console.log("🔄 Creating users table...")
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
    console.log("✅ Users table created")

    // Create forms table
    console.log("🔄 Creating forms table...")
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
    console.log("✅ Forms table created")

    // Create responses table
    console.log("🔄 Creating responses table...")
    await sql`
      CREATE TABLE IF NOT EXISTS responses (
        id SERIAL PRIMARY KEY,
        form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
        data JSONB NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Responses table created")

    // Create indexes for better performance
    console.log("🔄 Creating indexes...")
    await sql`CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_forms_share_token ON forms(share_token)`
    await sql`CREATE INDEX IF NOT EXISTS idx_responses_form_id ON responses(form_id)`
    console.log("✅ Indexes created")

    // Check existing tables
    console.log("\n📊 Checking database tables...")
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    console.log("Tables in database:", tables.map((t) => t.table_name).join(", "))

    console.log("\n✅ Database initialization complete!")
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    throw error
  }
}

initDatabase()
