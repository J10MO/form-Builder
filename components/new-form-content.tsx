// // "use client"

// // import type React from "react"
// // import { useState } from "react"
// // import { useRouter } from "next/navigation"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Textarea } from "@/components/ui/textarea"
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { Checkbox } from "@/components/ui/checkbox"
// // import { Plus, Trash2, ArrowLeft } from "lucide-react"
// // import type { FormField } from "@/lib/db"
// // import { nanoid } from "nanoid"
// // import Link from "next/link"

// // const FIELD_TYPES = [
// //   { value: "text", label: "Text Input" },
// //   { value: "email", label: "Email" },
// //   { value: "number", label: "Number" },
// //   { value: "textarea", label: "Text Area" },
// //   { value: "select", label: "Dropdown" },
// //   { value: "checkbox", label: "Checkbox" },
// //   { value: "radio", label: "Radio Buttons" },
// // ]

// // export function NewFormContent({ userId }: { userId: number }) {
// //   const router = useRouter()
// //   const [title, setTitle] = useState("")
// //   const [description, setDescription] = useState("")
// //   const [fields, setFields] = useState<FormField[]>([])
// //   const [isSubmitting, setIsSubmitting] = useState(false)

// //   const addField = () => {
// //     const newField: FormField = {
// //       id: nanoid(),
// //       type: "text",
// //       label: "",
// //       required: false,
// //     }
// //     setFields([...fields, newField])
// //   }

// //   const removeField = (id: string) => {
// //     setFields(fields.filter((field) => field.id !== id))
// //   }

// //   const updateField = (id: string, updates: Partial<FormField>) => {
// //     setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
// //   }

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()

// //     if (!title.trim() || fields.length === 0) {
// //       alert("Please add a title and at least one field")
// //       return
// //     }

// //     setIsSubmitting(true)

// //     try {
// //       const response = await fetch("/api/forms", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           userId,
// //           title,
// //           description,
// //           fields,
// //         }),
// //       })

// //       if (!response.ok) throw new Error("Failed to create form")

// //       const { form } = await response.json()
// //       router.push(`/forms/${form.id}/success`)
// //     } catch (error) {
// //       console.error("Error creating form:", error)
// //       alert("Failed to create form. Please try again.")
// //     } finally {
// //       setIsSubmitting(false)
// //     }
// //   }

// //   return (
// //     <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-slate-50 py-8">
// //       <div className="mx-auto max-w-4xl px-4">
// //         <div className="mb-6">
// //           <Link href="/">
// //             <Button variant="ghost" size="sm">
// //               <ArrowLeft className="mr-2 h-4 w-4" />
// //               Back to Home
// //             </Button>
// //           </Link>
// //         </div>

// //         <Card className="border-2 border-slate-200 shadow-lg">
// //           <CardHeader>
// //             <CardTitle className="text-3xl font-bold text-slate-900">Create New Form</CardTitle>
// //             <CardDescription>Build your custom form by adding fields and configuring their properties</CardDescription>
// //           </CardHeader>
// //           <CardContent>
// //             <form onSubmit={handleSubmit} className="space-y-8">
// //               <div className="space-y-4">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="title">Form Title *</Label>
// //                   <Input
// //                     id="title"
// //                     placeholder="e.g., Customer Feedback Survey"
// //                     value={title}
// //                     onChange={(e) => setTitle(e.target.value)}
// //                     required
// //                   />
// //                 </div>

// //                 <div className="space-y-2">
// //                   <Label htmlFor="description">Description</Label>
// //                   <Textarea
// //                     id="description"
// //                     placeholder="Describe what this form is for..."
// //                     value={description}
// //                     onChange={(e) => setDescription(e.target.value)}
// //                     rows={3}
// //                   />
// //                 </div>
// //               </div>

// //               <div className="space-y-4">
// //                 <div className="flex items-center justify-between">
// //                   <h3 className="text-xl font-semibold text-slate-900">Form Fields</h3>
// //                   <Button type="button" onClick={addField} size="sm">
// //                     <Plus className="mr-2 h-4 w-4" />
// //                     Add Field
// //                   </Button>
// //                 </div>

// //                 {fields.length === 0 && (
// //                   <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
// //                     <p className="text-slate-500">No fields yet. Click "Add Field" to get started.</p>
// //                   </div>
// //                 )}

// //                 <div className="space-y-4">
// //                   {fields.map((field) => (
// //                     <Card key={field.id} className="border border-slate-200">
// //                       <CardContent className="pt-6">
// //                         <div className="flex items-start gap-4">
// //                           <div className="flex-1 space-y-4">
// //                             <div className="grid gap-4 md:grid-cols-2">
// //                               <div className="space-y-2">
// //                                 <Label>Field Label *</Label>
// //                                 <Input
// //                                   placeholder="e.g., Full Name"
// //                                   value={field.label}
// //                                   onChange={(e) => updateField(field.id, { label: e.target.value })}
// //                                   required
// //                                 />
// //                               </div>

// //                               <div className="space-y-2">
// //                                 <Label>Field Type</Label>
// //                                 <Select
// //                                   value={field.type}
// //                                   onValueChange={(value) => updateField(field.id, { type: value as FormField["type"] })}
// //                                 >
// //                                   <SelectTrigger>
// //                                     <SelectValue />
// //                                   </SelectTrigger>
// //                                   <SelectContent>
// //                                     {FIELD_TYPES.map((type) => (
// //                                       <SelectItem key={type.value} value={type.value}>
// //                                         {type.label}
// //                                       </SelectItem>
// //                                     ))}
// //                                   </SelectContent>
// //                                 </Select>
// //                               </div>
// //                             </div>

// //                             {(field.type === "select" || field.type === "radio") && (
// //                               <div className="space-y-2">
// //                                 <Label>Options (comma-separated)</Label>
// //                                 <Input
// //                                   placeholder="e.g., Option 1, Option 2, Option 3"
// //                                   value={field.options?.join(", ") || ""}
// //                                   onChange={(e) => {
// //                                     const options = e.target.value
// //                                       .split(",")
// //                                       .map((opt) => opt.trim())
// //                                       .filter((opt) => opt.length > 0)
// //                                     updateField(field.id, { options })
// //                                   }}
// //                                 />
// //                               </div>
// //                             )}

// //                             <div className="flex items-center space-x-2">
// //                               <Checkbox
// //                                 id={`required-${field.id}`}
// //                                 checked={field.required}
// //                                 onCheckedChange={(checked) => updateField(field.id, { required: checked === true })}
// //                               />
// //                               <Label htmlFor={`required-${field.id}`} className="text-sm font-normal">
// //                                 Required field
// //                               </Label>
// //                             </div>
// //                           </div>

// //                           <Button
// //                             type="button"
// //                             variant="ghost"
// //                             size="icon"
// //                             onClick={() => removeField(field.id)}
// //                             className="text-red-500 hover:bg-red-50 hover:text-red-600"
// //                           >
// //                             <Trash2 className="h-4 w-4" />
// //                           </Button>
// //                         </div>
// //                       </CardContent>
// //                     </Card>
// //                   ))}
// //                 </div>
// //               </div>

// //               <div className="flex justify-end gap-3">
// //                 <Link href="/">
// //                   <Button type="button" variant="outline">
// //                     Cancel
// //                   </Button>
// //                 </Link>
// //                 <Button type="submit" disabled={isSubmitting || !title.trim() || fields.length === 0}>
// //                   {isSubmitting ? "Creating..." : "Create Form"}
// //                 </Button>
// //               </div>
// //             </form>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   )
// // }



// "use client"

// import type React from "react"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
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

// export function NewFormContent({ userId }: { userId: number }) {
//   const router = useRouter()
//   const [title, setTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [fields, setFields] = useState<FormField[]>([])
//   const [isSubmitting, setIsSubmitting] = useState(false)

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
//       const response = await fetch("/api/forms", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           title,
//           description,
//           fields,
//         }),
//       })

//       if (!response.ok) throw new Error("Failed to create form")

//       const { form } = await response.json()
//       router.push(`/forms/${form.id}/success`)
//     } catch (error) {
//       console.error("Error creating form:", error)
//       alert("Failed to create form. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-slate-50 py-8">
//       <div className="mx-auto max-w-4xl px-4">
//         <div className="mb-6">
//           <Link href="/">
//             <Button variant="ghost" size="sm">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to Home
//             </Button>
//           </Link>
//         </div>

//         <Card className="border-2 border-slate-200 shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-3xl font-bold text-slate-900">Create New Form</CardTitle>
//             <CardDescription>Build your custom form by adding fields and configuring their properties</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-8">
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
//                   {fields.map((field) => (
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
//                                   placeholder="Option 1, Option 2, Option 3"
//                                   value={field.options?.join(", ") || ""}
//                                   onChange={(e) => {
//                                     const options = e.target.value
//                                       .split(",")
//                                       .map((opt) => opt.trim())
//                                       .filter((opt) => opt.length > 0)
//                                     updateField(field.id, { options })
//                                   }}
//                                 />
//                                 <p className="text-xs text-slate-500">
//                                   Separate each option with a comma. Example: Red, Blue, Green
//                                 </p>
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

//               <div className="flex justify-end gap-3">
//                 <Link href="/">
//                   <Button type="button" variant="outline">
//                     Cancel
//                   </Button>
//                 </Link>
//                 <Button type="submit" disabled={isSubmitting || !title.trim() || fields.length === 0}>
//                   {isSubmitting ? "Creating..." : "Create Form"}
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
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, ArrowLeft, GripVertical } from "lucide-react"
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

export function NewFormContent({ userId }: { userId: number }) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  // Add a new option to a field
  const addOption = (fieldId: string) => {
    setFields(fields.map(field => {
      if (field.id === fieldId) {
        const currentOptions = field.options || []
        return {
          ...field,
          options: [...currentOptions, `Option ${currentOptions.length + 1}`]
        }
      }
      return field
    }))
  }

  // Update a specific option
  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    setFields(fields.map(field => {
      if (field.id === fieldId) {
        const newOptions = [...(field.options || [])]
        newOptions[optionIndex] = value
        return {
          ...field,
          options: newOptions
        }
      }
      return field
    }))
  }

  // Remove a specific option
  const removeOption = (fieldId: string, optionIndex: number) => {
    setFields(fields.map(field => {
      if (field.id === fieldId) {
        const newOptions = (field.options || []).filter((_, index) => index !== optionIndex)
        return {
          ...field,
          options: newOptions
        }
      }
      return field
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || fields.length === 0) {
      alert("Please add a title and at least one field")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title,
          description,
          fields,
        }),
      })

      if (!response.ok) throw new Error("Failed to create form")

      const { form } = await response.json()
      router.push(`/forms/${form.id}/success`)
    } catch (error) {
      console.error("Error creating form:", error)
      alert("Failed to create form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/5 via-background to-accent/10 dark:from-primary/10 dark:via-background dark:to-accent/5 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="border-2 shadow-xl dark:shadow-2xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Create New Form</CardTitle>
            <CardDescription>Build your custom form by adding fields and configuring their properties</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
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
                  {fields.map((field) => (
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

                            {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
                              <div className="space-y-3">
                                <Label>Options</Label>
                                <div className="space-y-2">
                                  {field.options?.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <GripVertical className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                      <Input
                                        value={option}
                                        onChange={(e) => updateOption(field.id, index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                        className="flex-1"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeOption(field.id, index)}
                                        className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600 flex-shrink-0"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                                
                                {(!field.options || field.options.length === 0) && (
                                  <div className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center">
                                    <p className="text-slate-500 text-sm">No options added yet</p>
                                  </div>
                                )}

                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addOption(field.id)}
                                  className="w-full"
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Option
                                </Button>
                                
                                <p className="text-xs text-slate-500">
                                  Add individual options for {field.type === "checkbox" ? "checkboxes" : field.type === "radio" ? "radio buttons" : "dropdown"}
                                </p>
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

              <div className="flex justify-end gap-3">
                <Link href="/">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting || !title.trim() || fields.length === 0}>
                  {isSubmitting ? "Creating..." : "Create Form"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}