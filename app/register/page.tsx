"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { UserPlus } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [dbInitialized, setDbInitialized] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  const initializeDatabase = async () => {
    setIsInitializing(true)
    setError("")
    try {
      const response = await fetch("/api/init-db")
      const data = await response.json()

      if (data.success) {
        setDbInitialized(true)
        setError("")
      } else {
        setError(`Database initialization failed: ${data.error}`)
      }
    } catch (err) {
      setError(`Failed to initialize database: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsInitializing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.details ? `${data.error}: ${data.details}` : data.error || "Registration failed"
        setError(errorMessage)
        return
      }

      router.push("/")
      router.refresh()
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : "Please try again."}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 dark:from-primary/10 dark:via-background dark:to-accent/5 px-4">
      <Card className="w-full max-w-md border-2 shadow-xl dark:shadow-2xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
            <UserPlus className="h-7 w-7 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">Create Account</CardTitle>
            <CardDescription className="mt-2">Sign up to start building dynamic forms</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {!dbInitialized && (
            <div className="mb-4 rounded-lg bg-blue-50 p-4 border border-blue-200">
              <p className="text-sm text-blue-800 mb-3">First time here? Initialize the database before registering.</p>
              <Button
                type="button"
                onClick={initializeDatabase}
                disabled={isInitializing}
                variant="outline"
                className="w-full bg-transparent"
              >
                {isInitializing ? "Initializing..." : "Initialize Database"}
              </Button>
            </div>
          )}

          {dbInitialized && (
            <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
              Database is ready! You can now register.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
