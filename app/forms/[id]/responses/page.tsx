// "use client"

// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { ArrowLeft, ExternalLink, Copy, Check, FileText } from "lucide-react"
// import Link from "next/link"
// import { formatDistanceToNow } from "date-fns"
// import type { FormField } from "@/lib/db"

// export default function FormResponsesPage() {
//   const params = useParams()
//   const formId = params.id as string

//   const [form, setForm] = useState<any>(null)
//   const [responses, setResponses] = useState<any[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [copied, setCopied] = useState(false)

//   useEffect(() => {
//     fetchData()
//   }, [formId])

//   const fetchData = async () => {
//     try {
//       const [formRes, responsesRes] = await Promise.all([
//         fetch(`/api/forms/${formId}`),
//         fetch(`/api/responses?formId=${formId}`),
//       ])

//       const formData = await formRes.json()
//       const responsesData = await responsesRes.json()

//       setForm(formData.form)
//       setResponses(responsesData.responses)
//     } catch (error) {
//       console.error("[v0] Error fetching data:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const copyShareLink = () => {
//     const shareUrl = `${window.location.origin}/f/${form.share_token}`
//     navigator.clipboard.writeText(shareUrl)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
//         <p className="text-slate-600">Loading responses...</p>
//       </div>
//     )
//   }

//   if (!form) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
//         <Card className="max-w-md">
//           <CardHeader>
//             <CardTitle>Form Not Found</CardTitle>
//             <CardDescription>The form you're looking for doesn't exist.</CardDescription>
//           </CardHeader>
//         </Card>
//       </div>
//     )
//   }

//   const fields = JSON.parse(form.fields) as FormField[]

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
//       <div className="mx-auto max-w-7xl px-4">
//         <div className="mb-6">
//           <Link href="/forms">
//             <Button variant="ghost" size="sm">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to My Forms
//             </Button>
//           </Link>
//         </div>

//         <div className="mb-8 space-y-4">
//           <div>
//             <h1 className="text-4xl font-bold text-slate-900">{form.title}</h1>
//             {form.description && <p className="mt-2 text-slate-600">{form.description}</p>}
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <Badge variant="secondary" className="text-base py-1 px-3">
//               {responses.length} {responses.length === 1 ? "Response" : "Responses"}
//             </Badge>
//             <Badge variant="secondary" className="text-base py-1 px-3">
//               {fields.length} {fields.length === 1 ? "Field" : "Fields"}
//             </Badge>
//           </div>

//           <div className="flex gap-3">
//             <Link href={`/f/${form.share_token}`} target="_blank">
//               <Button variant="outline">
//                 <ExternalLink className="mr-2 h-4 w-4" />
//                 View Form
//               </Button>
//             </Link>
//             <Button variant="outline" onClick={copyShareLink}>
//               {copied ? (
//                 <>
//                   <Check className="mr-2 h-4 w-4 text-emerald-600" />
//                   Copied!
//                 </>
//               ) : (
//                 <>
//                   <Copy className="mr-2 h-4 w-4" />
//                   Copy Share Link
//                 </>
//               )}
//             </Button>
//             <Link href={`/forms/${formId}/edit`}>
//               <Button variant="outline">Edit Form</Button>
//             </Link>
//           </div>
//         </div>

//         {responses.length === 0 ? (
//           <Card className="border-2 border-dashed border-slate-300">
//             <CardContent className="py-12 text-center">
//               <FileText className="mx-auto mb-4 h-12 w-12 text-slate-400" />
//               <h3 className="mb-2 text-xl font-semibold text-slate-900">No responses yet</h3>
//               <p className="mb-6 text-slate-500">Share your form to start collecting responses</p>
//               <Button onClick={copyShareLink}>
//                 <Copy className="mr-2 h-4 w-4" />
//                 Copy Share Link
//               </Button>
//             </CardContent>
//           </Card>
//         ) : (
//           <Card className="border border-slate-200 shadow-lg">
//             <CardHeader>
//               <CardTitle>All Responses</CardTitle>
//               <CardDescription>View and analyze all submitted responses</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="w-24">ID</TableHead>
//                       {fields.map((field) => (
//                         <TableHead key={field.id}>{field.label}</TableHead>
//                       ))}
//                       <TableHead className="w-40">Submitted</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {responses.map((response) => {
//                       const responseData = JSON.parse(response.data)

//                       return (
//                         <TableRow key={response.id}>
//                           <TableCell className="font-medium">#{response.id}</TableCell>
//                           {fields.map((field) => (
//                             <TableCell key={field.id}>
//                               {field.type === "checkbox"
//                                 ? responseData[field.id]
//                                   ? "Yes"
//                                   : "No"
//                                 : responseData[field.id] || "-"}
//                             </TableCell>
//                           ))}
//                           <TableCell className="text-sm text-slate-500">
//                             {formatDistanceToNow(new Date(response.submitted_at), { addSuffix: true })}
//                           </TableCell>
//                         </TableRow>
//                       )
//                     })}
//                   </TableBody>
//                 </Table>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }



"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, Copy, Check, FileText } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import type { FormField } from "@/lib/db"

export default function FormResponsesPage() {
  const params = useParams()
  const formId = params.id as string

  const [form, setForm] = useState<any>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchData()
  }, [formId])

  const fetchData = async () => {
    try {
      const [formRes, responsesRes] = await Promise.all([
        fetch(`/api/forms/${formId}`),
        fetch(`/api/responses?formId=${formId}`),
      ])

      const formData = await formRes.json()
      const responsesData = await responsesRes.json()

      setForm(formData.form)
      setResponses(responsesData.responses)
    } catch (error) {
      console.error("[v0] Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/f/${form.share_token}`
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading responses...</p>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Form Not Found</CardTitle>
            <CardDescription>The form you're looking for doesn't exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const fields = (typeof form.fields === "string" ? JSON.parse(form.fields) : form.fields) as FormField[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6">
          <Link href="/forms">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Forms
            </Button>
          </Link>
        </div>

        <div className="mb-8 space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">{form.title}</h1>
            {form.description && <p className="mt-2 text-slate-600">{form.description}</p>}
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="text-base py-1 px-3">
              {responses.length} {responses.length === 1 ? "Response" : "Responses"}
            </Badge>
            <Badge variant="secondary" className="text-base py-1 px-3">
              {fields.length} {fields.length === 1 ? "Field" : "Fields"}
            </Badge>
          </div>

          <div className="flex gap-3">
            <Link href={`/f/${form.share_token}`} target="_blank">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Form
              </Button>
            </Link>
            <Button variant="outline" onClick={copyShareLink}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-emerald-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Share Link
                </>
              )}
            </Button>
            <Link href={`/forms/${formId}/edit`}>
              <Button variant="outline">Edit Form</Button>
            </Link>
          </div>
        </div>

        {responses.length === 0 ? (
          <Card className="border-2 border-dashed border-slate-300">
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <h3 className="mb-2 text-xl font-semibold text-slate-900">No responses yet</h3>
              <p className="mb-6 text-slate-500">Share your form to start collecting responses</p>
              <Button onClick={copyShareLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Share Link
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle>All Responses</CardTitle>
              <CardDescription>View and analyze all submitted responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">ID</TableHead>
                      {fields.map((field) => (
                        <TableHead key={field.id}>{field.label}</TableHead>
                      ))}
                      <TableHead className="w-40">Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response) => {
                      const responseData = typeof response.data === "string" ? JSON.parse(response.data) : response.data

                      return (
                        <TableRow key={response.id}>
                          <TableCell className="font-medium">#{response.id}</TableCell>
                          {fields.map((field) => (
                            <TableCell key={field.id}>
                              {field.type === "checkbox"
                                ? responseData[field.id]
                                  ? "Yes"
                                  : "No"
                                : responseData[field.id] || "-"}
                            </TableCell>
                          ))}
                          <TableCell className="text-sm text-slate-500">
                            {formatDistanceToNow(new Date(response.submitted_at), { addSuffix: true })}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
