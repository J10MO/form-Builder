"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const initializeDatabase = async () => {
    setStatus("loading")
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/init-db")
      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setResult(data)
      } else {
        setStatus("error")
        setError(data.error || "Failed to initialize database")
      }
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 dark:from-primary/10 dark:via-background dark:to-accent/5">
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 sm:mb-3">Database Setup</h1>
            <p className="text-base sm:text-lg text-slate-600 px-4">Initialize your Neon database to start using the application</p>
          </div>

          <Card className="border-2 shadow-xl dark:shadow-2xl bg-card/50 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Initialization
              </CardTitle>
              <CardDescription>
                This will create all necessary tables (users, forms, responses) and indexes in your Neon database.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={initializeDatabase}
                disabled={status === "loading"}
                className="w-full h-12 text-base"
                size="lg"
              >
                {status === "loading" && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {status === "loading" ? "Initializing Database..." : "Initialize Database"}
              </Button>

              {status === "success" && result && (
                <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-2">Database Initialized Successfully!</h3>
                      <div className="space-y-1 text-sm text-green-800">
                        <p>
                          <strong>Tables created:</strong> {result.tables.join(", ")}
                        </p>
                        <p>
                          <strong>User count:</strong> {result.userCount}
                        </p>
                        <p>
                          <strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900 mb-2">Initialization Failed</h3>
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {status === "success" && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-blue-900 mb-3">Next Steps</h3>
                <div className="space-y-2">
                  <Link href="/register">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Create an account
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Sign in to existing account
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Go to homepage
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mt-6 border-slate-200">
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Make sure these are configured in your .env.local file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-slate-900 p-4 text-sm text-slate-100 font-mono overflow-x-auto">
                <div className="space-y-1">
                  <div>DATABASE_URL=postgresql://...</div>
                  <div>SESSION_SECRET=your-secret-key</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
