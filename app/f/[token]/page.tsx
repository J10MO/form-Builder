// // "use client"

// // import type React from "react"

// // import { useEffect, useState } from "react"
// // import { useParams, useRouter } from "next/navigation"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Textarea } from "@/components/ui/textarea"
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { Checkbox } from "@/components/ui/checkbox"
// // import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// // import { AlertCircle } from "lucide-react"
// // import type { FormField } from "@/lib/db"

// // export default function PublicFormPage() {
// //   const params = useParams()
// //   const router = useRouter()
// //   const token = params.token as string

// //   const [form, setForm] = useState<any>(null)
// //   const [formData, setFormData] = useState<Record<string, any>>({})
// //   const [isLoading, setIsLoading] = useState(true)
// //   const [isSubmitting, setIsSubmitting] = useState(false)
// //   const [errors, setErrors] = useState<Record<string, string>>({})

// //   useEffect(() => {
// //     fetchForm()
// //   }, [token])

// //   const fetchForm = async () => {
// //     try {
// //       const response = await fetch(`/api/forms/share/${token}`)
// //       if (!response.ok) throw new Error("Form not found")

// //       const data = await response.json()
// //       setForm(data.form)

// //       // Initialize form data with default values
// //       const initialData: Record<string, any> = {}
// //       const fields = JSON.parse(data.form.fields) as FormField[]
// //       fields.forEach((field) => {
// //         if (field.type === "checkbox") {
// //           initialData[field.id] = false
// //         } else {
// //           initialData[field.id] = ""
// //         }
// //       })
// //       setFormData(initialData)
// //     } catch (error) {
// //       console.error("[v0] Error fetching form:", error)
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   const validateForm = () => {
// //     const newErrors: Record<string, string> = {}
// //     const fields = JSON.parse(form.fields) as FormField[]

// //     fields.forEach((field) => {
// //       if (field.required) {
// //         const value = formData[field.id]
// //         if (!value || (typeof value === "string" && !value.trim())) {
// //           newErrors[field.id] = `${field.label} is required`
// //         }
// //       }

// //       // Validate email format
// //       if (field.type === "email" && formData[field.id]) {
// //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// //         if (!emailRegex.test(formData[field.id])) {
// //           newErrors[field.id] = "Please enter a valid email address"
// //         }
// //       }
// //     })

// //     setErrors(newErrors)
// //     return Object.keys(newErrors).length === 0
// //   }

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()

// //     if (!validateForm()) return

// //     setIsSubmitting(true)

// //     try {
// //       const response = await fetch("/api/responses", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           formId: form.id,
// //           data: formData,
// //         }),
// //       })

// //       if (!response.ok) throw new Error("Failed to submit response")

// //       router.push(`/f/${token}/submitted`)
// //     } catch (error) {
// //       console.error("[v0] Error submitting response:", error)
// //       alert("Failed to submit form. Please try again.")
// //     } finally {
// //       setIsSubmitting(false)
// //     }
// //   }

// //   const renderField = (field: FormField) => {
// //     const hasError = errors[field.id]

// //     switch (field.type) {
// //       case "text":
// //       case "email":
// //       case "number":
// //         return (
// //           <div key={field.id} className="space-y-2">
// //             <Label htmlFor={field.id}>
// //               {field.label}
// //               {field.required && <span className="text-red-500 ml-1">*</span>}
// //             </Label>
// //             <Input
// //               id={field.id}
// //               type={field.type}
// //               value={formData[field.id] || ""}
// //               onChange={(e) => {
// //                 setFormData({ ...formData, [field.id]: e.target.value })
// //                 if (errors[field.id]) {
// //                   setErrors({ ...errors, [field.id]: "" })
// //                 }
// //               }}
// //               className={hasError ? "border-red-500" : ""}
// //             />
// //             {hasError && (
// //               <p className="text-sm text-red-500 flex items-center gap-1">
// //                 <AlertCircle className="h-3 w-3" />
// //                 {errors[field.id]}
// //               </p>
// //             )}
// //           </div>
// //         )

// //       case "textarea":
// //         return (
// //           <div key={field.id} className="space-y-2">
// //             <Label htmlFor={field.id}>
// //               {field.label}
// //               {field.required && <span className="text-red-500 ml-1">*</span>}
// //             </Label>
// //             <Textarea
// //               id={field.id}
// //               value={formData[field.id] || ""}
// //               onChange={(e) => {
// //                 setFormData({ ...formData, [field.id]: e.target.value })
// //                 if (errors[field.id]) {
// //                   setErrors({ ...errors, [field.id]: "" })
// //                 }
// //               }}
// //               rows={4}
// //               className={hasError ? "border-red-500" : ""}
// //             />
// //             {hasError && (
// //               <p className="text-sm text-red-500 flex items-center gap-1">
// //                 <AlertCircle className="h-3 w-3" />
// //                 {errors[field.id]}
// //               </p>
// //             )}
// //           </div>
// //         )

// //       case "select":
// //         return (
// //           <div key={field.id} className="space-y-2">
// //             <Label htmlFor={field.id}>
// //               {field.label}
// //               {field.required && <span className="text-red-500 ml-1">*</span>}
// //             </Label>
// //             <Select
// //               value={formData[field.id] || ""}
// //               onValueChange={(value) => {
// //                 setFormData({ ...formData, [field.id]: value })
// //                 if (errors[field.id]) {
// //                   setErrors({ ...errors, [field.id]: "" })
// //                 }
// //               }}
// //             >
// //               <SelectTrigger className={hasError ? "border-red-500" : ""}>
// //                 <SelectValue placeholder="Select an option..." />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 {field.options?.map((option) => (
// //                   <SelectItem key={option} value={option}>
// //                     {option}
// //                   </SelectItem>
// //                 ))}
// //               </SelectContent>
// //             </Select>
// //             {hasError && (
// //               <p className="text-sm text-red-500 flex items-center gap-1">
// //                 <AlertCircle className="h-3 w-3" />
// //                 {errors[field.id]}
// //               </p>
// //             )}
// //           </div>
// //         )

// //       case "checkbox":
// //         return (
// //           <div key={field.id} className="flex items-center space-x-2">
// //             <Checkbox
// //               id={field.id}
// //               checked={formData[field.id] || false}
// //               onCheckedChange={(checked) => {
// //                 setFormData({ ...formData, [field.id]: checked })
// //                 if (errors[field.id]) {
// //                   setErrors({ ...errors, [field.id]: "" })
// //                 }
// //               }}
// //             />
// //             <Label htmlFor={field.id} className="font-normal">
// //               {field.label}
// //               {field.required && <span className="text-red-500 ml-1">*</span>}
// //             </Label>
// //           </div>
// //         )

// //       case "radio":
// //         return (
// //           <div key={field.id} className="space-y-2">
// //             <Label>
// //               {field.label}
// //               {field.required && <span className="text-red-500 ml-1">*</span>}
// //             </Label>
// //             <RadioGroup
// //               value={formData[field.id] || ""}
// //               onValueChange={(value) => {
// //                 setFormData({ ...formData, [field.id]: value })
// //                 if (errors[field.id]) {
// //                   setErrors({ ...errors, [field.id]: "" })
// //                 }
// //               }}
// //             >
// //               {field.options?.map((option) => (
// //                 <div key={option} className="flex items-center space-x-2">
// //                   <RadioGroupItem value={option} id={`${field.id}-${option}`} />
// //                   <Label htmlFor={`${field.id}-${option}`} className="font-normal">
// //                     {option}
// //                   </Label>
// //                 </div>
// //               ))}
// //             </RadioGroup>
// //             {hasError && (
// //               <p className="text-sm text-red-500 flex items-center gap-1">
// //                 <AlertCircle className="h-3 w-3" />
// //                 {errors[field.id]}
// //               </p>
// //             )}
// //           </div>
// //         )

// //       default:
// //         return null
// //     }
// //   }

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
// //         <p className="text-slate-600">Loading form...</p>
// //       </div>
// //     )
// //   }

// //   if (!form) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
// //         <Card className="max-w-md">
// //           <CardHeader>
// //             <CardTitle>Form Not Found</CardTitle>
// //             <CardDescription>The form you're looking for doesn't exist or has been deleted.</CardDescription>
// //           </CardHeader>
// //         </Card>
// //       </div>
// //     )
// //   }

// //   const fields = JSON.parse(form.fields) as FormField[]

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-12">
// //       <div className="mx-auto max-w-3xl px-4">
// //         <Card className="border-2 border-blue-200 shadow-lg">
// //           <CardHeader>
// //             <CardTitle className="text-3xl font-bold text-slate-900">{form.title}</CardTitle>
// //             {form.description && <CardDescription className="text-base">{form.description}</CardDescription>}
// //           </CardHeader>
// //           <CardContent>
// //             <form onSubmit={handleSubmit} className="space-y-6">
// //               {fields.map(renderField)}

// //               <div className="pt-4">
// //                 <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
// //                   {isSubmitting ? "Submitting..." : "Submit Response"}
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

// import { useEffect, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { AlertCircle } from "lucide-react"
// import type { FormField } from "@/lib/db"

// export default function PublicFormPage() {
//   const params = useParams()
//   const router = useRouter()
//   const token = params.token as string

//   const [form, setForm] = useState<any>(null)
//   const [formData, setFormData] = useState<Record<string, any>>({})
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [errors, setErrors] = useState<Record<string, string>>({})

//   useEffect(() => {
//     fetchForm()
//   }, [token])

//   const fetchForm = async () => {
//     try {
//       const response = await fetch(`/api/forms/share/${token}`)
//       if (!response.ok) throw new Error("Form not found")

//       const data = await response.json()
//       setForm(data.form)

//       // Initialize form data with default values
//       const initialData: Record<string, any> = {}
//       const fields = (
//         typeof data.form.fields === "string" ? JSON.parse(data.form.fields) : data.form.fields
//       ) as FormField[]
//       fields.forEach((field) => {
//         if (field.type === "checkbox") {
//           initialData[field.id] = false
//         } else if (field.type === "phone") {
//           initialData[field.id] = "07"
//         } else {
//           initialData[field.id] = ""
//         }
//       })
//       setFormData(initialData)
//     } catch (error) {
//       console.error("[v0] Error fetching form:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {}
//     const fields = (typeof form.fields === "string" ? JSON.parse(form.fields) : form.fields) as FormField[]

//     fields.forEach((field) => {
//       if (field.required) {
//         const value = formData[field.id]
//         if (!value || (typeof value === "string" && !value.trim())) {
//           newErrors[field.id] = `${field.label} is required`
//         }
//       }

//       // Validate email format
//       if (field.type === "email" && formData[field.id]) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//         if (!emailRegex.test(formData[field.id])) {
//           newErrors[field.id] = "Please enter a valid email address"
//         }
//       }

//       // Validate phone number format (must be exactly 11 digits starting with 07)
//       if (field.type === "phone" && formData[field.id]) {
//         const phoneValue = formData[field.id]
//         const phoneRegex = /^07\d{9}$/
//         if (!phoneRegex.test(phoneValue)) {
//           newErrors[field.id] = "Phone number must be 11 digits starting with 07"
//         }
//       }
//     })

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!validateForm()) return

//     setIsSubmitting(true)

//     try {
//       const response = await fetch("/api/responses", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           formId: form.id,
//           data: formData,
//         }),
//       })

//       if (!response.ok) throw new Error("Failed to submit response")

//       router.push(`/f/${token}/submitted`)
//     } catch (error) {
//       console.error("[v0] Error submitting response:", error)
//       alert("Failed to submit form. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const renderField = (field: FormField) => {
//     const hasError = errors[field.id]

//     switch (field.type) {
//       case "text":
//       case "email":
//       case "number":
//         return (
//           <div key={field.id} className="space-y-2">
//             <Label htmlFor={field.id}>
//               {field.label}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Input
//               id={field.id}
//               type={field.type}
//               value={formData[field.id] || ""}
//               onChange={(e) => {
//                 setFormData({ ...formData, [field.id]: e.target.value })
//                 if (errors[field.id]) {
//                   setErrors({ ...errors, [field.id]: "" })
//                 }
//               }}
//               className={hasError ? "border-red-500" : ""}
//             />
//             {hasError && (
//               <p className="text-sm text-red-500 flex items-center gap-1">
//                 <AlertCircle className="h-3 w-3" />
//                 {errors[field.id]}
//               </p>
//             )}
//           </div>
//         )

//       case "phone":
//         const phoneValue = formData[field.id] || "07"
//         const displayValue = phoneValue.startsWith("07") ? phoneValue.slice(2) : phoneValue.replace(/^07/, "")
//         return (
//           <div key={field.id} className="space-y-2">
//             <Label htmlFor={field.id}>
//               {field.label}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <div className="flex items-center">
//               <span className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-gray-700 font-medium select-none">
//                 07
//               </span>
//               <Input
//                 id={field.id}
//                 type="tel"
//                 maxLength={9}
//                 value={displayValue}
//                 onChange={(e) => {
//                   // Only allow digits
//                   const value = e.target.value.replace(/\D/g, "")
//                   // Limit to 9 digits (after 07)
//                   const limitedValue = value.slice(0, 9)
//                   // Store the full phone number with 07 prefix
//                   const fullPhone = "07" + limitedValue
//                   setFormData({ ...formData, [field.id]: fullPhone })
//                   if (errors[field.id]) {
//                     setErrors({ ...errors, [field.id]: "" })
//                   }
//                 }}
//                 onKeyDown={(e) => {
//                   // Prevent backspace/delete when cursor is at the start
//                   if ((e.key === "Backspace" || e.key === "Delete") && e.currentTarget.selectionStart === 0) {
//                     e.preventDefault()
//                   }
//                 }}
//                 onFocus={(e) => {
//                   // Prevent selecting the "07" prefix by focusing at the end
//                   e.target.setSelectionRange(e.target.value.length, e.target.value.length)
//                 }}
//                 placeholder="123456789"
//                 className={`flex-1 rounded-l-none ${hasError ? "border-red-500" : ""}`}
//               />
//             </div>
//             <p className="text-xs text-gray-500">Enter 9 digits (total: 11 digits including 07)</p>
//             {hasError && (
//               <p className="text-sm text-red-500 flex items-center gap-1">
//                 <AlertCircle className="h-3 w-3" />
//                 {errors[field.id]}
//               </p>
//             )}
//           </div>
//         )

//       case "textarea":
//         return (
//           <div key={field.id} className="space-y-2">
//             <Label htmlFor={field.id}>
//               {field.label}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Textarea
//               id={field.id}
//               value={formData[field.id] || ""}
//               onChange={(e) => {
//                 setFormData({ ...formData, [field.id]: e.target.value })
//                 if (errors[field.id]) {
//                   setErrors({ ...errors, [field.id]: "" })
//                 }
//               }}
//               rows={4}
//               className={hasError ? "border-red-500" : ""}
//             />
//             {hasError && (
//               <p className="text-sm text-red-500 flex items-center gap-1">
//                 <AlertCircle className="h-3 w-3" />
//                 {errors[field.id]}
//               </p>
//             )}
//           </div>
//         )

//       case "select":
//         return (
//           <div key={field.id} className="space-y-2">
//             <Label htmlFor={field.id}>
//               {field.label}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Select
//               value={formData[field.id] || ""}
//               onValueChange={(value) => {
//                 setFormData({ ...formData, [field.id]: value })
//                 if (errors[field.id]) {
//                   setErrors({ ...errors, [field.id]: "" })
//                 }
//               }}
//             >
//               <SelectTrigger className={hasError ? "border-red-500" : ""}>
//                 <SelectValue placeholder="Select an option..." />
//               </SelectTrigger>
//               <SelectContent>
//                 {field.options?.map((option) => (
//                   <SelectItem key={option} value={option}>
//                     {option}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {hasError && (
//               <p className="text-sm text-red-500 flex items-center gap-1">
//                 <AlertCircle className="h-3 w-3" />
//                 {errors[field.id]}
//               </p>
//             )}
//           </div>
//         )

//       case "checkbox":
//         return (
//           <div key={field.id} className="flex items-center space-x-2">
//             <Checkbox
//               id={field.id}
//               checked={formData[field.id] || false}
//               onCheckedChange={(checked) => {
//                 setFormData({ ...formData, [field.id]: checked })
//                 if (errors[field.id]) {
//                   setErrors({ ...errors, [field.id]: "" })
//                 }
//               }}
//             />
//             <Label htmlFor={field.id} className="font-normal">
//               {field.label}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//           </div>
//         )

//       case "radio":
//         return (
//           <div key={field.id} className="space-y-2">
//             <Label>
//               {field.label}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <RadioGroup
//               value={formData[field.id] || ""}
//               onValueChange={(value) => {
//                 setFormData({ ...formData, [field.id]: value })
//                 if (errors[field.id]) {
//                   setErrors({ ...errors, [field.id]: "" })
//                 }
//               }}
//             >
//               {field.options?.map((option) => (
//                 <div key={option} className="flex items-center space-x-2">
//                   <RadioGroupItem value={option} id={`${field.id}-${option}`} />
//                   <Label htmlFor={`${field.id}-${option}`} className="font-normal">
//                     {option}
//                   </Label>
//                 </div>
//               ))}
//             </RadioGroup>
//             {hasError && (
//               <p className="text-sm text-red-500 flex items-center gap-1">
//                 <AlertCircle className="h-3 w-3" />
//                 {errors[field.id]}
//               </p>
//             )}
//           </div>
//         )

//       default:
//         return null
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
//         <p className="text-slate-600">Loading form...</p>
//       </div>
//     )
//   }

//   if (!form) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
//         <Card className="max-w-md">
//           <CardHeader>
//             <CardTitle>Form Not Found</CardTitle>
//             <CardDescription>The form you're looking for doesn't exist or has been deleted.</CardDescription>
//           </CardHeader>
//         </Card>
//       </div>
//     )
//   }

//   const fields = (typeof form.fields === "string" ? JSON.parse(form.fields) : form.fields) as FormField[]

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 dark:from-primary/10 dark:via-background dark:to-accent/5 py-12">
//       <div className="mx-auto max-w-3xl px-4">
//         <Card className="border-2 shadow-xl dark:shadow-2xl bg-card/50 backdrop-blur-sm">
//           <CardHeader>
//             <CardTitle className="text-3xl font-bold text-slate-900">{form.title}</CardTitle>
//             {form.description && <CardDescription className="text-base">{form.description}</CardDescription>}
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {fields.map(renderField)}

//               <div className="pt-4">
//                 <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
//                   {isSubmitting ? "Submitting..." : "Submit Response"}
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, CheckCircle, FileText, Star, Shield, Lock, Users } from "lucide-react"
import type { FormField } from "@/lib/db"

export default function PublicFormPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [form, setForm] = useState<any>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchForm()
  }, [token])

  const fetchForm = async () => {
    try {
      const response = await fetch(`/api/forms/share/${token}`)
      if (!response.ok) throw new Error("Form not found")

      const data = await response.json()
      setForm(data.form)

      const initialData: Record<string, any> = {}
      const fields = (
        typeof data.form.fields === "string" ? JSON.parse(data.form.fields) : data.form.fields
      ) as FormField[]
      fields.forEach((field) => {
        if (field.type === "checkbox") {
          initialData[field.id] = false
        } else {
          initialData[field.id] = ""
        }
      })
      setFormData(initialData)
    } catch (error) {
      console.error("Error fetching form:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const fields = (typeof form.fields === "string" ? JSON.parse(form.fields) : form.fields) as FormField[]

    fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.id]
        if (!value || (typeof value === "string" && !value.trim())) {
          newErrors[field.id] = `${field.label} is required`
        }
      }

      if (field.type === "email" && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = "Please enter a valid email address"
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: form.id,
          data: formData,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit response")

      router.push(`/f/${token}/submitted`)
    } catch (error) {
      console.error("Error submitting response:", error)
      alert("Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField, index: number) => {
    const hasError = errors[field.id]

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <div key={field.id} className="space-y-4 bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Label htmlFor={field.id} className="text-sm font-semibold text-gray-900 block mb-3 tracking-tight">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                  id={field.id}
                  type={field.type}
                  value={formData[field.id] || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, [field.id]: e.target.value })
                    if (errors[field.id]) {
                      setErrors({ ...errors, [field.id]: "" })
                    }
                  }}
                  className={`h-12 px-4 text-base border-2 bg-white transition-all duration-200 ${
                    hasError 
                      ? "border-red-500 focus:border-red-500 ring-1 ring-red-500" 
                      : "border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 hover:border-gray-300"
                  }`}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                />
              </div>
            </div>
            {hasError && (
              <p className="text-sm text-red-600 flex items-center gap-2 mt-2 font-medium">
                <AlertCircle className="h-4 w-4" />
                {errors[field.id]}
              </p>
            )}
          </div>
        )

      case "textarea":
        return (
          <div key={field.id} className="space-y-4 bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Label htmlFor={field.id} className="text-sm font-semibold text-gray-900 block mb-3 tracking-tight">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Textarea
                  id={field.id}
                  value={formData[field.id] || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, [field.id]: e.target.value })
                    if (errors[field.id]) {
                      setErrors({ ...errors, [field.id]: "" })
                    }
                  }}
                  rows={4}
                  className={`px-4 py-3 text-base border-2 bg-white resize-vertical transition-all duration-200 ${
                    hasError 
                      ? "border-red-500 focus:border-red-500 ring-1 ring-red-500" 
                      : "border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 hover:border-gray-300"
                  }`}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                />
              </div>
            </div>
            {hasError && (
              <p className="text-sm text-red-600 flex items-center gap-2 mt-2 font-medium">
                <AlertCircle className="h-4 w-4" />
                {errors[field.id]}
              </p>
            )}
          </div>
        )

      case "select":
        return (
          <div key={field.id} className="space-y-4 bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Label htmlFor={field.id} className="text-sm font-semibold text-gray-900 block mb-3 tracking-tight">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Select
                  value={formData[field.id] || ""}
                  onValueChange={(value) => {
                    setFormData({ ...formData, [field.id]: value })
                    if (errors[field.id]) {
                      setErrors({ ...errors, [field.id]: "" })
                    }
                  }}
                >
                  <SelectTrigger
                    className={`h-12 px-4 text-base border-2 bg-white transition-all duration-200 ${
                      hasError 
                        ? "border-red-500 focus:border-red-500 ring-1 ring-red-500" 
                        : "border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 hover:border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-gray-100 shadow-lg">
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option} className="text-base py-3 hover:bg-gray-50">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {hasError && (
              <p className="text-sm text-red-600 flex items-center gap-2 mt-2 font-medium">
                <AlertCircle className="h-4 w-4" />
                {errors[field.id]}
              </p>
            )}
          </div>
        )

      case "checkbox":
        return (
          <div key={field.id} className="space-y-4 bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Checkbox
                    id={field.id}
                    checked={formData[field.id] || false}
                    onCheckedChange={(checked) => {
                      setFormData({ ...formData, [field.id]: checked })
                      if (errors[field.id]) {
                        setErrors({ ...errors, [field.id]: "" })
                      }
                    }}
                    className="mt-0.5 h-5 w-5 border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-colors duration-200"
                  />
                  <Label htmlFor={field.id} className="text-sm font-semibold text-gray-900 leading-tight cursor-pointer flex-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                </div>
              </div>
            </div>
            {hasError && (
              <p className="text-sm text-red-600 flex items-center gap-2 mt-2 font-medium">
                <AlertCircle className="h-4 w-4" />
                {errors[field.id]}
              </p>
            )}
          </div>
        )

      case "radio":
        return (
          <div key={field.id} className="space-y-4 bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Label className="text-sm font-semibold text-gray-900 block mb-4 tracking-tight">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <RadioGroup
                  value={formData[field.id] || ""}
                  onValueChange={(value) => {
                    setFormData({ ...formData, [field.id]: value })
                    if (errors[field.id]) {
                      setErrors({ ...errors, [field.id]: "" })
                    }
                  }}
                  className="space-y-3"
                >
                  {field.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <RadioGroupItem 
                        value={option} 
                        id={`${field.id}-${option}`} 
                        className="h-5 w-5 border-2 border-gray-300 text-blue-600 transition-colors duration-200"
                      />
                      <Label htmlFor={`${field.id}-${option}`} className="text-sm text-gray-700 cursor-pointer flex-1 py-1 font-medium">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            {hasError && (
              <p className="text-sm text-red-600 flex items-center gap-2 mt-2 font-medium">
                <AlertCircle className="h-4 w-4" />
                {errors[field.id]}
              </p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading form...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we prepare your form</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Form Not Found</CardTitle>
            <CardDescription className="text-base text-gray-600">
              The form you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const fields = (typeof form.fields === "string" ? JSON.parse(form.fields) : form.fields) as FormField[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
      {/* Professional Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{form.title}</h1>
                {form.description && (
                  <p className="text-gray-600 mt-1.5 text-sm leading-relaxed">{form.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="font-medium">Secure Form</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Security Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm">Secure Form Submission</h3>
              <p className="text-gray-600 text-sm mt-0.5">
                Your responses are encrypted and securely stored. We respect your privacy and data security.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          {fields.map((field, index) => renderField(field, index))}

          {/* Submit Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>Your response will be recorded securely</span>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Submit Response
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Footer */}
      <div className="border-t border-gray-200/60 bg-white/50 backdrop-blur-sm mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-gray-600" />
                </div>
                <span className="font-medium">Professional Forms</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <span>Enterprise-grade form solution</span>
            </div>
            <div className="text-gray-400">
              © {new Date().getFullYear()} All rights reserved
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}