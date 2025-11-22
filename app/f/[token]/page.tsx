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
//       const fields = JSON.parse(data.form.fields) as FormField[]
//       fields.forEach((field) => {
//         if (field.type === "checkbox") {
//           initialData[field.id] = false
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
//     const fields = JSON.parse(form.fields) as FormField[]

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

//   const fields = JSON.parse(form.fields) as FormField[]

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-12">
//       <div className="mx-auto max-w-3xl px-4">
//         <Card className="border-2 border-blue-200 shadow-lg">
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
import { AlertCircle } from "lucide-react"
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

      // Initialize form data with default values
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
      console.error("[v0] Error fetching form:", error)
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

      // Validate email format
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
      console.error("[v0] Error submitting response:", error)
      alert("Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const hasError = errors[field.id]

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
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
              className={hasError ? "border-red-500" : ""}
            />
            {hasError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors[field.id]}
              </p>
            )}
          </div>
        )

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
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
              className={hasError ? "border-red-500" : ""}
            />
            {hasError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors[field.id]}
              </p>
            )}
          </div>
        )

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
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
              <SelectTrigger className={hasError ? "border-red-500" : ""}>
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors[field.id]}
              </p>
            )}
          </div>
        )

      case "checkbox":
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={formData[field.id] || false}
              onCheckedChange={(checked) => {
                setFormData({ ...formData, [field.id]: checked })
                if (errors[field.id]) {
                  setErrors({ ...errors, [field.id]: "" })
                }
              }}
            />
            <Label htmlFor={field.id} className="font-normal">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        )

      case "radio":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
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
            >
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                  <Label htmlFor={`${field.id}-${option}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {hasError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading form...</p>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Form Not Found</CardTitle>
            <CardDescription>The form you're looking for doesn't exist or has been deleted.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const fields = (typeof form.fields === "string" ? JSON.parse(form.fields) : form.fields) as FormField[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-12">
      <div className="mx-auto max-w-3xl px-4">
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-slate-900">{form.title}</CardTitle>
            {form.description && <CardDescription className="text-base">{form.description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {fields.map(renderField)}

              <div className="pt-4">
                <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                  {isSubmitting ? "Submitting..." : "Submit Response"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
