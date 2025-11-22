// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { NavBar } from "@/components/nav-bar"
// import { getAuthUser } from "@/lib/auth"
// import { redirect } from "next/navigation"
// import { getSql } from "@/lib/db"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { BarChart3, Download, ExternalLink, FileText, MessageSquare, Share2, TrendingUp, Users } from "lucide-react"

// async function getFormDashboardData(formId: string, userId: number) {
//   const sql = getSql()

//   const formResult = await sql`
//     SELECT * FROM forms WHERE id = ${formId} AND user_id = ${userId}
//   `

//   if (formResult.length === 0) {
//     return null
//   }

//   const form = formResult[0]

//   const responses = await sql`
//     SELECT * FROM responses WHERE form_id = ${formId} ORDER BY submitted_at DESC
//   `

//   const fields = typeof form.fields === "string" ? JSON.parse(form.fields) : form.fields

//   // Calculate field statistics
//   const fieldStats: Record<
//     string,
//     { label: string; type: string; totalResponses: number; values: Record<string, number> }
//   > = {}

//   fields.forEach((field: any) => {
//     fieldStats[field.id] = {
//       label: field.label,
//       type: field.type,
//       totalResponses: 0,
//       values: {},
//     }
//   })

//   responses.forEach((response: any) => {
//     const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data
//     Object.keys(data).forEach((fieldId) => {
//       if (fieldStats[fieldId]) {
//         fieldStats[fieldId].totalResponses++
//         const value = data[fieldId]
//         if (value !== undefined && value !== null && value !== "") {
//           const valueStr = String(value)
//           fieldStats[fieldId].values[valueStr] = (fieldStats[fieldId].values[valueStr] || 0) + 1
//         }
//       }
//     })
//   })

//   return { form, responses, fields, fieldStats }
// }

// export default async function FormDashboardPage({ params }: { params: Promise<{ id: string }> }) {
//   const user = await getAuthUser()
//   if (!user) {
//     redirect("/login")
//   }

//   const { id } = await params
//   const dashboardData = await getFormDashboardData(id, user.id)

//   if (!dashboardData) {
//     redirect("/forms")
//   }

//   const { form, responses, fields, fieldStats } = dashboardData

//   return (
//     <>
//       <NavBar user={user} />
//       <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-accent/20 to-background">
//         <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
//           <div className="mb-6 sm:mb-8 space-y-4">
//             <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
//               <div className="space-y-2">
//                 <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">{form.title}</h1>
//                 {form.description && (
//                   <p className="text-base sm:text-lg text-muted-foreground text-pretty">{form.description}</p>
//                 )}
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 <Link href={`/f/${form.share_token}`} target="_blank">
//                   <Button variant="outline" size="sm" className="gap-2 bg-transparent">
//                     <ExternalLink className="h-4 w-4" />
//                     <span className="hidden sm:inline">View Form</span>
//                   </Button>
//                 </Link>
//                 <Link href={`/api/export/forms/${id}`}>
//                   <Button variant="outline" size="sm" className="gap-2 bg-transparent">
//                     <Download className="h-4 w-4" />
//                     <span className="hidden sm:inline">Export CSV</span>
//                   </Button>
//                 </Link>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               <Badge variant="secondary" className="text-sm py-1 px-3">
//                 <MessageSquare className="mr-1 h-3 w-3 inline" />
//                 {responses.length} Responses
//               </Badge>
//               <Badge variant="secondary" className="text-sm py-1 px-3">
//                 <FileText className="mr-1 h-3 w-3 inline" />
//                 {fields.length} Fields
//               </Badge>
//             </div>
//           </div>

//           <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             <Card className="border-2 border-primary/20 bg-primary/5">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-sm font-medium flex items-center gap-2">
//                   <MessageSquare className="h-4 w-4 text-primary" />
//                   Total Responses
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-primary">{responses.length}</div>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-chart-2/20 bg-chart-2/5">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-sm font-medium flex items-center gap-2">
//                   <FileText className="h-4 w-4 text-chart-2" />
//                   Form Fields
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-chart-2">{fields.length}</div>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-chart-3/20 bg-chart-3/5">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-sm font-medium flex items-center gap-2">
//                   <TrendingUp className="h-4 w-4 text-chart-3" />
//                   Completion Rate
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-chart-3">{responses.length > 0 ? "100%" : "0%"}</div>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-chart-4/20 bg-chart-4/5">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-sm font-medium flex items-center gap-2">
//                   <Users className="h-4 w-4 text-chart-4" />
//                   Unique Visitors
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-chart-4">{responses.length}</div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="mb-6 sm:mb-8">
//             <Card className="border-2 shadow-lg">
//               <CardHeader>
//                 <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
//                   <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
//                   Field Statistics
//                 </CardTitle>
//                 <CardDescription>Detailed breakdown of responses by field</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//                   {Object.entries(fieldStats).map(([fieldId, stats]) => (
//                     <Card key={fieldId} className="border bg-accent/30">
//                       <CardHeader className="pb-3">
//                         <CardTitle className="text-base sm:text-lg">{stats.label}</CardTitle>
//                         <CardDescription className="text-xs sm:text-sm">
//                           {stats.type} • {stats.totalResponses} responses
//                         </CardDescription>
//                       </CardHeader>
//                       <CardContent>
//                         {Object.keys(stats.values).length > 0 ? (
//                           <div className="space-y-2">
//                             {Object.entries(stats.values)
//                               .sort((a, b) => b[1] - a[1])
//                               .slice(0, 5)
//                               .map(([value, count]) => (
//                                 <div key={value} className="flex items-center justify-between text-sm">
//                                   <span className="truncate max-w-[200px] text-foreground">{value || "(empty)"}</span>
//                                   <div className="flex items-center gap-2">
//                                     <div className="h-2 w-20 sm:w-32 bg-muted rounded-full overflow-hidden">
//                                       <div
//                                         className="h-full bg-primary rounded-full"
//                                         style={{
//                                           width: `${(count / stats.totalResponses) * 100}%`,
//                                         }}
//                                       />
//                                     </div>
//                                     <span className="font-medium text-muted-foreground min-w-[3rem] text-right">
//                                       {count} ({Math.round((count / stats.totalResponses) * 100)}%)
//                                     </span>
//                                   </div>
//                                 </div>
//                               ))}
//                           </div>
//                         ) : (
//                           <p className="text-sm text-muted-foreground">No responses yet</p>
//                         )}
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <Card className="border-2 shadow-lg">
//             <CardHeader>
//               <CardTitle className="text-xl sm:text-2xl">Recent Responses</CardTitle>
//               <CardDescription>Latest submissions to this form</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {responses.length === 0 ? (
//                 <div className="py-12 text-center">
//                   <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
//                   <p className="text-muted-foreground">No responses yet</p>
//                   <Button className="mt-4" asChild>
//                     <Link href={`/f/${form.share_token}`}>
//                       <Share2 className="mr-2 h-4 w-4" />
//                       Share Form
//                     </Link>
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {responses.slice(0, 10).map((response: any) => {
//                     const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data
//                     return (
//                       <Card key={response.id} className="border bg-accent/20">
//                         <CardContent className="pt-4">
//                           <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//                             <Badge variant="outline">Response #{response.id}</Badge>
//                             <span className="text-xs sm:text-sm text-muted-foreground">
//                               {new Date(response.submitted_at).toLocaleString()}
//                             </span>
//                           </div>
//                           <div className="grid gap-3">
//                             {fields.map((field: any) => (
//                               <div key={field.id} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
//                                 <span className="text-sm font-medium text-muted-foreground min-w-[120px]">
//                                   {field.label}:
//                                 </span>
//                                 <span className="text-sm text-foreground break-words">
//                                   {field.type === "checkbox" ? (data[field.id] ? "Yes" : "No") : data[field.id] || "-"}
//                                 </span>
//                               </div>
//                             ))}
//                           </div>
//                         </CardContent>
//                       </Card>
//                     )
//                   })}
//                 </div>
//               )}
//               {responses.length > 10 && (
//                 <div className="mt-6 text-center">
//                   <Link href={`/forms/${id}/responses`}>
//                     <Button variant="outline">View All {responses.length} Responses</Button>
//                   </Link>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </>
//   )
// }



import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getSql } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, Download, ExternalLink, FileText, MessageSquare, Share2, TrendingUp, Users } from "lucide-react"

export const dynamic = "force-dynamic"

async function getFormDashboardData(formId: string, userId: number) {
  const sql = getSql()

  const formResult = await sql`
    SELECT * FROM forms WHERE id = ${formId} AND user_id = ${userId}
  `

  if (formResult.length === 0) {
    return null
  }

  const form = formResult[0]

  const responses = await sql`
    SELECT * FROM responses WHERE form_id = ${formId} ORDER BY submitted_at DESC
  `

  const fields = typeof form.fields === "string" ? JSON.parse(form.fields) : form.fields

  // Calculate field statistics
  const fieldStats: Record<
    string,
    { label: string; type: string; totalResponses: number; values: Record<string, number> }
  > = {}

  fields.forEach((field: any) => {
    fieldStats[field.id] = {
      label: field.label,
      type: field.type,
      totalResponses: 0,
      values: {},
    }
  })

  responses.forEach((response: any) => {
    const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data
    Object.keys(data).forEach((fieldId) => {
      if (fieldStats[fieldId]) {
        fieldStats[fieldId].totalResponses++
        const value = data[fieldId]
        if (value !== undefined && value !== null && value !== "") {
          const valueStr = String(value)
          fieldStats[fieldId].values[valueStr] = (fieldStats[fieldId].values[valueStr] || 0) + 1
        }
      }
    })
  })

  return { form, responses, fields, fieldStats }
}

export default async function FormDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser()
  if (!user) {
    redirect("/login")
  }

  const { id } = await params
  const dashboardData = await getFormDashboardData(id, user.id)

  if (!dashboardData) {
    redirect("/forms")
  }

  const { form, responses, fields, fieldStats } = dashboardData

  return (
    <>
      <NavBar user={user} />
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-accent/20 to-background">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">{form.title}</h1>
                {form.description && (
                  <p className="text-base sm:text-lg text-muted-foreground text-pretty">{form.description}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/f/${form.share_token}`} target="_blank">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <ExternalLink className="h-4 w-4" />
                    <span className="hidden sm:inline">View Form</span>
                  </Button>
                </Link>
                <Link href={`/api/export/forms/${id}`}>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export CSV</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm py-1 px-3">
                <MessageSquare className="mr-1 h-3 w-3 inline" />
                {responses.length} Responses
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                <FileText className="mr-1 h-3 w-3 inline" />
                {fields.length} Fields
              </Badge>
            </div>
          </div>

          <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Total Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{responses.length}</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-chart-2/20 bg-chart-2/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-chart-2" />
                  Form Fields
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-chart-2">{fields.length}</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-chart-3/20 bg-chart-3/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-chart-3" />
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-chart-3">{responses.length > 0 ? "100%" : "0%"}</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-chart-4/20 bg-chart-4/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-chart-4" />
                  Unique Visitors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-chart-4">{responses.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 sm:mb-8">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
                  Field Statistics
                </CardTitle>
                <CardDescription>Detailed breakdown of responses by field</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {Object.entries(fieldStats).map(([fieldId, stats]) => (
                    <Card key={fieldId} className="border bg-accent/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg">{stats.label}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          {stats.type} • {stats.totalResponses} responses
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {Object.keys(stats.values).length > 0 ? (
                          <div className="space-y-2">
                            {Object.entries(stats.values)
                              .sort((a, b) => b[1] - a[1])
                              .slice(0, 5)
                              .map(([value, count]) => (
                                <div key={value} className="flex items-center justify-between text-sm">
                                  <span className="truncate max-w-[200px] text-foreground">{value || "(empty)"}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-20 sm:w-32 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-primary rounded-full"
                                        style={{
                                          width: `${(count / stats.totalResponses) * 100}%`,
                                        }}
                                      />
                                    </div>
                                    <span className="font-medium text-muted-foreground min-w-[3rem] text-right">
                                      {count} ({Math.round((count / stats.totalResponses) * 100)}%)
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No responses yet</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Recent Responses</CardTitle>
              <CardDescription>Latest submissions to this form</CardDescription>
            </CardHeader>
            <CardContent>
              {responses.length === 0 ? (
                <div className="py-12 text-center">
                  <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No responses yet</p>
                  <Button className="mt-4" asChild>
                    <Link href={`/f/${form.share_token}`}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Form
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {responses.slice(0, 10).map((response: any) => {
                    const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data
                    return (
                      <Card key={response.id} className="border bg-accent/20">
                        <CardContent className="pt-4">
                          <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <Badge variant="outline">Response #{response.id}</Badge>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {new Date(response.submitted_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="grid gap-3">
                            {fields.map((field: any) => (
                              <div key={field.id} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                                <span className="text-sm font-medium text-muted-foreground min-w-[120px]">
                                  {field.label}:
                                </span>
                                <span className="text-sm text-foreground break-words">
                                  {field.type === "checkbox" ? (data[field.id] ? "Yes" : "No") : data[field.id] || "-"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
              {responses.length > 10 && (
                <div className="mt-6 text-center">
                  <Link href={`/forms/${id}/responses`}>
                    <Button variant="outline">View All {responses.length} Responses</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

