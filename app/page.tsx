import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, BarChart3, ArrowRight } from "lucide-react"
import Link from "next/link"
import { NavBar } from "@/components/nav-bar"
import { getAuthUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const user = await getAuthUser()

  if (!user) {
    return (
      <>
        <NavBar user={null} />
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 dark:from-primary/10 dark:via-background dark:to-accent/5 px-4 py-8">
          <div className="w-full max-w-2xl space-y-6">
            <Card className="w-full border-2 shadow-xl dark:shadow-2xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                  <span className="text-2xl font-bold text-primary-foreground">F</span>
                </div>
                <CardTitle className="text-3xl sm:text-4xl font-bold text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Welcome to FormBuilder
                </CardTitle>
                <CardDescription className="mt-2 text-base sm:text-lg text-pretty text-muted-foreground">
                  Create dynamic forms, share them instantly, and collect responses in real-time
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-3 pt-6">
                <Link href="/login" className="flex-1">
                  <Button className="w-full h-11 text-base">Sign In</Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button variant="outline" className="w-full h-11 text-base">
                    Sign Up
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <NavBar user={user} />
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/5 via-background to-accent/10 dark:from-primary/10 dark:via-background dark:to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:py-16 sm:px-6 lg:px-8">
          <div className="mb-12 sm:mb-16 text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Dynamic Form Builder
            </h1>
            <p className="mx-auto max-w-2xl text-balance text-lg sm:text-xl text-muted-foreground px-4">
              Create custom forms with ease, share them instantly, and collect responses in real-time
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-xl dark:hover:shadow-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                  <Plus className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Create Form</CardTitle>
                <CardDescription className="text-base">
                  Build dynamic forms with custom fields tailored to your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/forms/new">
                  <Button className="w-full h-11 text-base group/btn">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group border-2 transition-all duration-300 hover:border-chart-2/50 hover:shadow-xl dark:hover:shadow-chart-2/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-2/20 to-chart-2/10 group-hover:from-chart-2/30 group-hover:to-chart-2/20 transition-all duration-300">
                  <FileText className="h-7 w-7 text-chart-2" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">My Forms</CardTitle>
                <CardDescription className="text-base">
                  View and manage all your created forms in one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/forms">
                  <Button variant="outline" className="w-full h-11 text-base group/btn">
                    View Forms
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group border-2 transition-all duration-300 hover:border-chart-3/50 hover:shadow-xl dark:hover:shadow-chart-3/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-3/20 to-chart-3/10 group-hover:from-chart-3/30 group-hover:to-chart-3/20 transition-all duration-300">
                  <BarChart3 className="h-7 w-7 text-chart-3" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Analytics</CardTitle>
                <CardDescription className="text-base">
                  Track responses and analyze form submission data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/analytics">
                  <Button variant="outline" className="w-full h-11 text-base group/btn">
                    View Analytics
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
