// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Plus, FileText, ExternalLink, Trash2, Edit, ArrowLeft } from "lucide-react"
// import Link from "next/link"
// import { formatDistanceToNow } from "date-fns"

// export function FormsListContent({ userId }: { userId: number }) {
//   const [forms, setForms] = useState<any[]>([])
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     fetchForms()
//   }, [])

//   const fetchForms = async () => {
//     try {
//       const response = await fetch(`/api/forms?userId=${userId}`)
//       const data = await response.json()
//       setForms(data.forms)
//     } catch (error) {
//       console.error("Error fetching forms:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const deleteForm = async (formId: number) => {
//     if (!confirm("Are you sure you want to delete this form?")) return

//     try {
//       await fetch(`/api/forms/${formId}`, { method: "DELETE" })
//       setForms(forms.filter((form) => form.id !== formId))
//     } catch (error) {
//       console.error("Error deleting form:", error)
//       alert("Failed to delete form")
//     }
//   }

//   return (
//     <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-slate-50 py-8">
//       <div className="mx-auto max-w-6xl px-4">
//         <div className="mb-6">
//           <Link href="/">
//             <Button variant="ghost" size="sm">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to Home
//             </Button>
//           </Link>
//         </div>

//         <div className="mb-8 flex items-center justify-between">
//           <div>
//             <h1 className="text-4xl font-bold text-slate-900">My Forms</h1>
//             <p className="mt-2 text-slate-600">Manage and view all your created forms</p>
//           </div>
//           <Link href="/forms/new">
//             <Button>
//               <Plus className="mr-2 h-4 w-4" />
//               Create Form
//             </Button>
//           </Link>
//         </div>

//         {isLoading ? (
//           <div className="py-12 text-center">
//             <p className="text-slate-500">Loading forms...</p>
//           </div>
//         ) : forms.length === 0 ? (
//           <Card className="border-2 border-dashed border-slate-300">
//             <CardContent className="py-12 text-center">
//               <FileText className="mx-auto mb-4 h-12 w-12 text-slate-400" />
//               <h3 className="mb-2 text-xl font-semibold text-slate-900">No forms yet</h3>
//               <p className="mb-6 text-slate-500">Get started by creating your first form</p>
//               <Link href="/forms/new">
//                 <Button>
//                   <Plus className="mr-2 h-4 w-4" />
//                   Create Your First Form
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {forms.map((form) => (
//               <Card key={form.id} className="border border-slate-200 transition-shadow hover:shadow-lg">
//                 <CardHeader>
//                   <CardTitle className="text-lg">{form.title}</CardTitle>
//                   <CardDescription className="line-clamp-2">{form.description || "No description"}</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex items-center justify-between text-sm text-slate-500">
//                     <span>{JSON.parse(form.fields).length} fields</span>
//                     <span>Created {formatDistanceToNow(new Date(form.created_at), { addSuffix: true })}</span>
//                   </div>

//                   <div className="flex gap-2">
//                     <Link href={`/forms/${form.id}/responses`} className="flex-1">
//                       <Button variant="outline" size="sm" className="w-full bg-transparent">
//                         Responses
//                       </Button>
//                     </Link>
//                     <Link href={`/f/${form.share_token}`} target="_blank">
//                       <Button variant="outline" size="sm">
//                         <ExternalLink className="h-4 w-4" />
//                       </Button>
//                     </Link>
//                     <Link href={`/forms/${form.id}/edit`}>
//                       <Button variant="outline" size="sm">
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                     </Link>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => deleteForm(form.id)}
//                       className="text-red-500 hover:bg-red-50 hover:text-red-600"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }



"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, ExternalLink, Trash2, Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export function FormsListContent({ userId }: { userId: number }) {
  const [forms, setForms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const response = await fetch(`/api/forms?userId=${userId}`)
      const data = await response.json()
      setForms(data.forms)
    } catch (error) {
      console.error("Error fetching forms:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteForm = async (formId: number) => {
    if (!confirm("Are you sure you want to delete this form?")) return

    try {
      await fetch(`/api/forms/${formId}`, { method: "DELETE" })
      setForms(forms.filter((form) => form.id !== formId))
    } catch (error) {
      console.error("Error deleting form:", error)
      alert("Failed to delete form")
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/5 via-background to-accent/10 dark:from-primary/10 dark:via-background dark:to-accent/5 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">My Forms</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600">Manage and view all your created forms</p>
          </div>
          <Link href="/forms/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create Form
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <p className="text-slate-500">Loading forms...</p>
          </div>
        ) : forms.length === 0 ? (
          <Card className="border-2 border-dashed border-slate-300">
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <h3 className="mb-2 text-xl font-semibold text-slate-900">No forms yet</h3>
              <p className="mb-6 text-slate-500">Get started by creating your first form</p>
              <Link href="/forms/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Form
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => {
              const fields = typeof form.fields === "string" ? JSON.parse(form.fields) : form.fields

              return (
                <Card key={form.id} className="group border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-xl dark:hover:shadow-primary/10 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-semibold">{form.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">{form.description || "No description"}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{fields.length} fields</span>
                      <span>Created {formatDistanceToNow(new Date(form.created_at), { addSuffix: true })}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link href={`/forms/${form.id}/responses`} className="flex-1 min-w-[100px]">
                        <Button variant="outline" size="sm" className="w-full bg-transparent text-xs sm:text-sm">
                          <span className="hidden sm:inline">Responses</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                      </Link>
                      <Link href={`/f/${form.share_token}`} target="_blank">
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm" title="Open form">
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </Link>
                      <Link href={`/forms/${form.id}/edit`}>
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm" title="Edit form">
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteForm(form.id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 text-xs sm:text-sm"
                        title="Delete form"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
