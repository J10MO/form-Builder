// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Plus, Trash2, ArrowLeft } from "lucide-react"
// import type { FormField } from "@/lib/db"
// import { nanoid } from "nanoid"
// import Link from "next/link"

// const FIELD_TYPES = [
//   { value: "text", label: "Text Input" },
//   { value: "email", label: "Email" },
//   { value: "number", label: "Number" },
//   { value: "textarea", label: "Text Area" },
//   { value: "select", label: "Dropdown" },
//   { value: "checkbox", label: "Checkbox" },
//   { value: "radio", label: "Radio Buttons" },
// ]

// export default function EditFormPage() {
//   const params = useParams()
//   const router = useRouter()
//   const formId = params.id as string

//   const [title, setTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [fields, setFields] = useState<FormField[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   useEffect(() => {
//     fetchForm()
//   }, [formId])

//   const fetchForm = async () => {
//     try {
//       const response = await fetch(`/api/forms/${formId}`)
//       const data = await response.json()

//       if (data.form) {
//         setTitle(data.form.title)
//         setDescription(data.form.description || "")
//         setFields(JSON.parse(data.form.fields))
//       }
//     } catch (error) {
//       console.error("[v0] Error fetching form:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const addField = () => {
//     const newField: FormField = {
//       id: nanoid(),
//       type: "text",
//       label: "",
//       required: false,
//     }
//     setFields([...fields, newField])
//   }

//   const removeField = (id: string) => {
//     setFields(fields.filter((field) => field.id !== id))
//   }

//   const updateField = (id: string, updates: Partial<FormField>) => {
//     setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!title.trim() || fields.length === 0) {
//       alert("Please add a title and at least one field")
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const response = await fetch(`/api/forms/${formId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title,
//           description,
//           fields,
//         }),
//       })

//       if (!response.ok) throw new Error("Failed to update form")

//       router.push(`/forms/${formId}/responses`)
//     } catch (error) {
//       console.error("[v0] Error updating form:", error)
//       alert("Failed to update form. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
//         <p className="text-slate-600">Loading form...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
//       <div className="mx-auto max-w-4xl px-4">
//         <div className="mb-6">
//           <Link href={`/forms/${formId}/responses`}>
//             <Button variant="ghost" size="sm">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to Responses
//             </Button>
//           </Link>
//         </div>

//         <Card className="border-2 border-slate-200 shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-3xl font-bold text-slate-900">Edit Form</CardTitle>
//             <CardDescription>Update your form details and fields</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-8">
//               {/* Form Details */}
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="title">Form Title *</Label>
//                   <Input
//                     id="title"
//                     placeholder="e.g., Customer Feedback Survey"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     placeholder="Describe what this form is for..."
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     rows={3}
//                   />
//                 </div>
//               </div>

//               {/* Form Fields */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-semibold text-slate-900">Form Fields</h3>
//                   <Button type="button" onClick={addField} size="sm">
//                     <Plus className="mr-2 h-4 w-4" />
//                     Add Field
//                   </Button>
//                 </div>

//                 {fields.length === 0 && (
//                   <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
//                     <p className="text-slate-500">No fields yet. Click "Add Field" to get started.</p>
//                   </div>
//                 )}

//                 <div className="space-y-4">
//                   {fields.map((field, index) => (
//                     <Card key={field.id} className="border border-slate-200">
//                       <CardContent className="pt-6">
//                         <div className="flex items-start gap-4">
//                           <div className="flex-1 space-y-4">
//                             <div className="grid gap-4 md:grid-cols-2">
//                               <div className="space-y-2">
//                                 <Label>Field Label *</Label>
//                                 <Input
//                                   placeholder="e.g., Full Name"
//                                   value={field.label}
//                                   onChange={(e) => updateField(field.id, { label: e.target.value })}
//                                   required
//                                 />
//                               </div>

//                               <div className="space-y-2">
//                                 <Label>Field Type</Label>
//                                 <Select
//                                   value={field.type}
//                                   onValueChange={(value) => updateField(field.id, { type: value as FormField["type"] })}
//                                 >
//                                   <SelectTrigger>
//                                     <SelectValue />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     {FIELD_TYPES.map((type) => (
//                                       <SelectItem key={type.value} value={type.value}>
//                                         {type.label}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectContent>
//                                 </Select>
//                               </div>
//                             </div>

//                             {(field.type === "select" || field.type === "radio") && (
//                               <div className="space-y-2">
//                                 <Label>Options (comma-separated)</Label>
//                                 <Input
//                                   placeholder="e.g., Option 1, Option 2, Option 3"
//                                   value={field.options?.join(", ") || ""}
//                                   onChange={(e) => {
//                                     const options = e.target.value
//                                       .split(",")
//                                       .map((opt) => opt.trim())
//                                       .filter((opt) => opt.length > 0)
//                                     updateField(field.id, { options })
//                                   }}
//                                 />
//                               </div>
//                             )}

//                             <div className="flex items-center space-x-2">
//                               <Checkbox
//                                 id={`required-${field.id}`}
//                                 checked={field.required}
//                                 onCheckedChange={(checked) => updateField(field.id, { required: checked === true })}
//                               />
//                               <Label htmlFor={`required-${field.id}`} className="text-sm font-normal">
//                                 Required field
//                               </Label>
//                             </div>
//                           </div>

//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => removeField(field.id)}
//                             className="text-red-500 hover:bg-red-50 hover:text-red-600"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div className="flex justify-end gap-3">
//                 <Link href={`/forms/${formId}/responses`}>
//                   <Button type="button" variant="outline">
//                     Cancel
//                   </Button>
//                 </Link>
//                 <Button type="submit" disabled={isSubmitting || !title.trim() || fields.length === 0}>
//                   {isSubmitting ? "Saving..." : "Save Changes"}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }




"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import type { FormField } from "@/lib/db"
import { nanoid } from "nanoid"
import Link from "next/link"

const FIELD_TYPES = [
  { value: "text", label: "Text Input" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
  { value: "phone", label: "Phone Number (07)" },
  { value: "textarea", label: "Text Area" },
  { value: "select", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio Buttons" },
]

export default function EditFormPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.id as string

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchForm()
  }, [formId])

  const fetchForm = async () => {
    try {
      const response = await fetch(`/api/forms/${formId}`)
      const data = await response.json()

      if (data.form) {
        setTitle(data.form.title)
        setDescription(data.form.description || "")
        const parsedFields = typeof data.form.fields === "string" ? JSON.parse(data.form.fields) : data.form.fields
        setFields(parsedFields)
      }
    } catch (error) {
      console.error("[v0] Error fetching form:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addField = () => {
    const newField: FormField = {
      id: nanoid(),
      type: "text",
      label: "",
      required: false,
    }
    setFields([...fields, newField])
  }

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || fields.length === 0) {
      alert("Please add a title and at least one field")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          fields,
        }),
      })

      if (!response.ok) throw new Error("Failed to update form")

      router.push(`/forms/${formId}/responses`)
    } catch (error) {
      console.error("[v0] Error updating form:", error)
      alert("Failed to update form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading form...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 dark:from-primary/10 dark:via-background dark:to-accent/5 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6">
          <Link href={`/forms/${formId}/responses`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Responses
            </Button>
          </Link>
        </div>

        <Card className="border-2 shadow-xl dark:shadow-2xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Edit Form</CardTitle>
            <CardDescription>Update your form details and fields</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Form Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Customer Feedback Survey"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this form is for..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">Form Fields</h3>
                  <Button type="button" onClick={addField} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                </div>

                {fields.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
                    <p className="text-slate-500">No fields yet. Click "Add Field" to get started.</p>
                  </div>
                )}

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="border-2 bg-card/50 backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label>Field Label *</Label>
                                <Input
                                  placeholder="e.g., Full Name"
                                  value={field.label}
                                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Field Type</Label>
                                <Select
                                  value={field.type}
                                  onValueChange={(value) => updateField(field.id, { type: value as FormField["type"] })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {FIELD_TYPES.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {(field.type === "select" || field.type === "radio") && (
                              <div className="space-y-2">
                                <Label>Options (comma-separated)</Label>
                                <Input
                                  placeholder="e.g., Option 1, Option 2, Option 3"
                                  value={field.options?.join(", ") || ""}
                                  onChange={(e) => {
                                    const options = e.target.value
                                      .split(",")
                                      .map((opt) => opt.trim())
                                      .filter((opt) => opt.length > 0)
                                    updateField(field.id, { options })
                                  }}
                                />
                              </div>
                            )}

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`required-${field.id}`}
                                checked={field.required}
                                onCheckedChange={(checked) => updateField(field.id, { required: checked === true })}
                              />
                              <Label htmlFor={`required-${field.id}`} className="text-sm font-normal">
                                Required field
                              </Label>
                            </div>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeField(field.id)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3">
                <Link href={`/forms/${formId}/responses`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting || !title.trim() || fields.length === 0}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
