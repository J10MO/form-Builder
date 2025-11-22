// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { NavBar } from "@/components/nav-bar"
// import { getAuthUser } from "@/lib/auth"
// import { redirect } from "next/navigation"
// import { BarChart3, FileText, MessageSquare, TrendingUp } from "lucide-react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { getSql } from "@/lib/db"

// async function getAnalyticsData(userId: number) {
//   const sql = getSql()

//   // Get total forms count
//   const formsResult = await sql`
//     SELECT COUNT(*) as count FROM forms WHERE user_id = ${userId}
//   `
//   const totalForms = Number(formsResult[0]?.count || 0)

//   // Get total responses count
//   const responsesResult = await sql`
//     SELECT COUNT(*) as count FROM responses r
//     INNER JOIN forms f ON r.form_id = f.id
//     WHERE f.user_id = ${userId}
//   `
//   const totalResponses = Number(responsesResult[0]?.count || 0)

//   // Get forms with response counts
//   const formsWithResponses = await sql`
//     SELECT 
//       f.id,
//       f.title,
//       f.description,
//       f.created_at,
//       COUNT(r.id) as response_count
//     FROM forms f
//     LEFT JOIN responses r ON f.id = r.form_id
//     WHERE f.user_id = ${userId}
//     GROUP BY f.id, f.title, f.description, f.created_at
//     ORDER BY f.created_at DESC
//   `

//   // Get recent responses
//   const recentResponses = await sql`
//     SELECT 
//       r.id,
//       r.form_id,
//       r.submitted_at,
//       f.title as form_title
//     FROM responses r
//     INNER JOIN forms f ON r.form_id = f.id
//     WHERE f.user_id = ${userId}
//     ORDER BY r.submitted_at DESC
//     LIMIT 10
//   `

//   return {
//     totalForms,
//     totalResponses,
//     formsWithResponses,
//     recentResponses,
//   }
// }

// export default async function AnalyticsPage() {
//   const user = await getAuthUser()

//   if (!user) {
//     redirect("/login")
//   }

//   const analytics = await getAnalyticsData(user.id)

//   return (
//     <>
//       <NavBar user={user} />
//       <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-slate-50">
//         <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//           <div className="mb-8">
//             <h1 className="mb-2 text-4xl font-bold text-slate-900">Analytics Dashboard</h1>
//             <p className="text-lg text-slate-600">Track your forms and response data</p>
//           </div>

//           {/* Summary Cards */}
//           <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//             <Card className="border-2 border-blue-200 bg-blue-50">
//               <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="text-sm font-medium text-blue-900">Total Forms</CardTitle>
//                   <FileText className="h-4 w-4 text-blue-600" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-blue-900">{analytics.totalForms}</div>
//                 <p className="mt-1 text-xs text-blue-700">Forms created</p>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-emerald-200 bg-emerald-50">
//               <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="text-sm font-medium text-emerald-900">Total Responses</CardTitle>
//                   <MessageSquare className="h-4 w-4 text-emerald-600" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-emerald-900">{analytics.totalResponses}</div>
//                 <p className="mt-1 text-xs text-emerald-700">Submissions received</p>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-purple-200 bg-purple-50">
//               <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="text-sm font-medium text-purple-900">Avg Response Rate</CardTitle>
//                   <TrendingUp className="h-4 w-4 text-purple-600" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-purple-900">
//                   {analytics.totalForms > 0 ? Math.round(analytics.totalResponses / analytics.totalForms) : 0}
//                 </div>
//                 <p className="mt-1 text-xs text-purple-700">Per form</p>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-orange-200 bg-orange-50">
//               <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="text-sm font-medium text-orange-900">Active Forms</CardTitle>
//                   <BarChart3 className="h-4 w-4 text-orange-600" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-orange-900">{analytics.totalForms}</div>
//                 <p className="mt-1 text-xs text-orange-700">Currently active</p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Forms Performance Table */}
//           <div className="mb-8">
//             <Card className="border-2 border-slate-200 shadow-lg">
//               <CardHeader>
//                 <CardTitle className="text-2xl">Forms Performance</CardTitle>
//                 <CardDescription>See how each form is performing</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {analytics.formsWithResponses.length === 0 ? (
//                   <div className="py-12 text-center">
//                     <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
//                     <p className="text-lg text-slate-500">No forms created yet</p>
//                     <Link href="/forms/new">
//                       <Button className="mt-4">Create Your First Form</Button>
//                     </Link>
//                   </div>
//                 ) : (
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead>
//                         <tr className="border-b border-slate-200">
//                           <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Form Title</th>
//                           <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Description</th>
//                           <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">Responses</th>
//                           <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Created</th>
//                           <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-100">
//                         {analytics.formsWithResponses.map((form: any) => (
//                           <tr key={form.id} className="hover:bg-slate-50">
//                             <td className="px-4 py-4 text-sm font-medium text-slate-900">{form.title}</td>
//                             <td className="px-4 py-4 text-sm text-slate-600">{form.description || "No description"}</td>
//                             <td className="px-4 py-4 text-center">
//                               <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
//                                 {form.response_count}
//                               </span>
//                             </td>
//                             <td className="px-4 py-4 text-sm text-slate-600">
//                               {new Date(form.created_at).toLocaleDateString()}
//                             </td>
//                             <td className="px-4 py-4 text-right">
//                               <Link href={`/forms/${form.id}/responses`}>
//                                 <Button size="sm" variant="outline">
//                                   View Details
//                                 </Button>
//                               </Link>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Recent Activity */}
//           <Card className="border-2 border-slate-200 shadow-lg">
//             <CardHeader>
//               <CardTitle className="text-2xl">Recent Activity</CardTitle>
//               <CardDescription>Latest form submissions</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {analytics.recentResponses.length === 0 ? (
//                 <div className="py-8 text-center">
//                   <MessageSquare className="mx-auto mb-3 h-10 w-10 text-slate-300" />
//                   <p className="text-slate-500">No responses yet</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {analytics.recentResponses.map((response: any) => (
//                     <div
//                       key={response.id}
//                       className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
//                           <MessageSquare className="h-5 w-5 text-blue-600" />
//                         </div>
//                         <div>
//                           <p className="font-medium text-slate-900">{response.form_title}</p>
//                           <p className="text-sm text-slate-600">{new Date(response.submitted_at).toLocaleString()}</p>
//                         </div>
//                       </div>
//                       <Link href={`/forms/${response.form_id}/responses`}>
//                         <Button size="sm" variant="ghost">
//                           View
//                         </Button>
//                       </Link>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </>
//   )
// }



"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { BarChart3, FileText, MessageSquare, TrendingUp, Calendar, Activity } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface AnalyticsData {
  totalForms: number
  totalResponses: number
  formsWithResponses: any[]
  recentResponses: any[]
  dailyStats: any[]
  formTypeDistribution: any[]
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const responsesByForm = analytics.formsWithResponses.map((form) => ({
    name: form.title.length > 20 ? form.title.substring(0, 20) + "..." : form.title,
    responses: Number(form.response_count),
  }))

  const dailyResponseData = analytics.dailyStats || []

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background">
      <NavBar></NavBar>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-2 text-3xl sm:text-4xl font-bold text-foreground text-balance">Analytics Dashboard</h1>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">Track your forms and response data</p>
        </div>

        <div className="mb-6 sm:mb-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-primary">Total Forms</CardTitle>
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-primary">{analytics.totalForms}</div>
              <p className="mt-1 text-xs text-primary/70">Forms created</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-chart-2/20 bg-chart-2/5">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-chart-2">Total Responses</CardTitle>
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-chart-2" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-chart-2">{analytics.totalResponses}</div>
              <p className="mt-1 text-xs text-chart-2/70">Submissions received</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-chart-3/20 bg-chart-3/5">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-chart-3">Avg Response Rate</CardTitle>
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-chart-3" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-chart-3">
                {analytics.totalForms > 0 ? Math.round(analytics.totalResponses / analytics.totalForms) : 0}
              </div>
              <p className="mt-1 text-xs text-chart-3/70">Per form</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-chart-4/20 bg-chart-4/5">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-chart-4">Active Forms</CardTitle>
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-chart-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-chart-4">{analytics.totalForms}</div>
              <p className="mt-1 text-xs text-chart-4/70">Currently active</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 sm:mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Response Distribution Bar Chart */}
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                Responses by Form
              </CardTitle>
              <CardDescription>Distribution of responses across forms</CardDescription>
            </CardHeader>
            <CardContent>
              {responsesByForm.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={responsesByForm}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="responses" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Response Trend Line Chart */}
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                Response Trend
              </CardTitle>
              <CardDescription>Daily response activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyResponseData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyResponseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Not enough data yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 sm:mb-8">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-2xl">Forms Performance</CardTitle>
              <CardDescription>See how each form is performing</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.formsWithResponses.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-lg text-muted-foreground">No forms created yet</p>
                  <Link href="/forms/new">
                    <Button className="mt-4">Create Your First Form</Button>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Form Title</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Responses</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Created</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {analytics.formsWithResponses.map((form: any) => (
                          <tr key={form.id} className="hover:bg-accent/50">
                            <td className="px-4 py-4 text-sm font-medium text-foreground">{form.title}</td>
                            <td className="px-4 py-4 text-sm text-muted-foreground">
                              {form.description || "No description"}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <Badge variant="secondary">{form.response_count}</Badge>
                            </td>
                            <td className="px-4 py-4 text-sm text-muted-foreground">
                              {new Date(form.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <Link href={`/dashboard/${form.id}`}>
                                <Button size="sm" variant="outline">
                                  View Dashboard
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {analytics.formsWithResponses.map((form: any) => (
                      <Card key={form.id} className="border bg-accent/30">
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-foreground">{form.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {form.description || "No description"}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{form.response_count} responses</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(form.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Link href={`/dashboard/${form.id}`} className="block">
                              <Button size="sm" className="w-full">
                                View Dashboard
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-2xl flex items-center gap-2">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest form submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.recentResponses.length === 0 ? (
              <div className="py-8 text-center">
                <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-muted-foreground">No responses yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.recentResponses.map((response: any) => (
                  <div
                    key={response.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-border bg-accent/30 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{response.form_title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(response.submitted_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Link href={`/forms/${response.form_id}/responses`}>
                      <Button size="sm" variant="ghost" className="w-full sm:w-auto">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
   
    </div>
  )
}
