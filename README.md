# Dynamic Form Builder

A professional form builder application with authentication, built with Next.js and Neon PostgreSQL.

## Features

- User authentication (login/register)
- Create dynamic forms with multiple field types
- Share forms via unique links
- Collect and view responses
- Edit forms after creation
- Admin dashboard

## Setup Instructions

### 1. Database Setup

First, make sure you have run the database initialization script. You can do this by:

1. Go to the Scripts section in your v0 project
2. Run the `000_init_database.sql` script to create all tables

Or manually connect to your Neon database and run the SQL.

### 2. Environment Variables

Add these environment variables in the **Vars** section of v0 (or in `.env.local` for local development):

\`\`\`
DATABASE_URL=postgresql://neondb_owner:your-password@your-host.neon.tech/neondb?sslmode=require
SESSION_SECRET=your-secret-key-change-this-in-production
\`\`\`

### 3. Test Database Connection

Visit `/api/test-db` to verify your database connection is working and tables are created.

### 4. Default Admin Account

After running the initialization script, you can login with:
- Email: `admin@example.com`
- Password: `admin123`

**Important:** Change this password immediately in production!

## Project Structure

- `/app` - Next.js pages and routes
- `/components` - Reusable React components
- `/lib` - Utility functions (database, auth)
- `/scripts` - Database migration scripts

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Database:** Neon PostgreSQL
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Authentication:** JWT with cookies
