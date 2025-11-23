"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, CheckCircle, FileText, Shield, Lock, Upload, X, Sparkles } from "lucide-react"
import type { FormField } from "@/lib/db"

export default function PublicFormPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [form, setForm] = useState<any>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({})
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

      if (data.form.is_private === true) {
        const userRes = await fetch("/api/auth/me", { cache: "no-store" })
        const userData = await userRes.json()
        if (!userData) {
          // 3) Redirect to login WITH RETURN URL
          router.push(`/login?next=/f/${token}`)
          return
        }
      }

      setForm(data.form)

      const initialData: Record<string, any> = {}
      const fields = (
        typeof data.form.fields === "string" ? JSON.parse(data.form.fields) : data.form.fields
      ) as FormField[]

      fields.forEach((field) => {
        initialData[field.id] = field.type === "checkbox" ? false : ""
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
        if (field.type === "file") {
          if (!uploadedFiles[field.id] || uploadedFiles[field.id].length === 0) {
            newErrors[field.id] = `${field.label} is required`
          }
        } else if (!value || (typeof value === "string" && !value.trim())) {
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

  const handleFileChange = (fieldId: string, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      setUploadedFiles({ ...uploadedFiles, [fieldId]: fileArray })
      setFormData({ ...formData, [fieldId]: fileArray.map((f) => f.name).join(", ") })
      if (errors[fieldId]) {
        setErrors({ ...errors, [fieldId]: "" })
      }
    }
  }

  const removeFile = (fieldId: string, fileIndex: number) => {
    const currentFiles = uploadedFiles[fieldId] || []
    const newFiles = currentFiles.filter((_, index) => index !== fileIndex)
    setUploadedFiles({ ...uploadedFiles, [fieldId]: newFiles })
    setFormData({ ...formData, [fieldId]: newFiles.map((f) => f.name).join(", ") })
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
          <div
            key={field.id}
            className="group relative overflow-hidden rounded-xl border-2 border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center ring-2 ring-primary/20">
                {index + 1}
              </div>
              <div className="flex-1 space-y-3">
                <Label htmlFor={field.id} className="text-base font-semibold text-foreground block">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
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
                  className={`h-11 px-4 text-base bg-background transition-all duration-200 ${hasError
                      ? "border-destructive focus:border-destructive ring-2 ring-destructive/20"
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                />
                {hasError && (
                  <p className="text-sm text-destructive flex items-center gap-2 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    {errors[field.id]}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      case "textarea":
        return (
          <div
            key={field.id}
            className="group relative overflow-hidden rounded-xl border-2 border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center ring-2 ring-primary/20">
                {index + 1}
              </div>
              <div className="flex-1 space-y-3">
                <Label htmlFor={field.id} className="text-base font-semibold text-foreground block">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
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
                  className={`px-4 py-3 text-base bg-background resize-vertical transition-all duration-200 ${hasError
                      ? "border-destructive focus:border-destructive ring-2 ring-destructive/20"
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                />
                {hasError && (
                  <p className="text-sm text-destructive flex items-center gap-2 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    {errors[field.id]}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      case "select":
        return (
          <div
            key={field.id}
            className="group relative overflow-hidden rounded-xl border-2 border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center ring-2 ring-primary/20">
                {index + 1}
              </div>
              <div className="flex-1 space-y-3">
                <Label htmlFor={field.id} className="text-base font-semibold text-foreground block">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
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
                    className={`h-11 px-4 text-base bg-background transition-all duration-200 ${hasError
                        ? "border-destructive focus:border-destructive ring-2 ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }`}
                  >
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-border shadow-lg">
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option} className="text-base py-3 hover:bg-muted">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasError && (
                  <p className="text-sm text-destructive flex items-center gap-2 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    {errors[field.id]}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      case "checkbox":
        return (
          <div
            key={field.id}
            className="group relative overflow-hidden rounded-xl border-2 border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center ring-2 ring-primary/20">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/60 transition-colors duration-200">
                  <Checkbox
                    id={field.id}
                    checked={formData[field.id] || false}
                    onCheckedChange={(checked) => {
                      setFormData({ ...formData, [field.id]: checked })
                      if (errors[field.id]) {
                        setErrors({ ...errors, [field.id]: "" })
                      }
                    }}
                    className="mt-0.5 h-5 w-5 border-2 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-colors duration-200"
                  />
                  <Label
                    htmlFor={field.id}
                    className="text-base font-semibold text-foreground leading-tight cursor-pointer flex-1"
                  >
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                </div>
                {hasError && (
                  <p className="text-sm text-destructive flex items-center gap-2 mt-2 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    {errors[field.id]}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      case "radio":
        return (
          <div
            key={field.id}
            className="group relative overflow-hidden rounded-xl border-2 border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center ring-2 ring-primary/20">
                {index + 1}
              </div>
              <div className="flex-1 space-y-3">
                <Label className="text-base font-semibold text-foreground block">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
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
                    <div
                      key={option}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/60 transition-colors duration-200"
                    >
                      <RadioGroupItem
                        value={option}
                        id={`${field.id}-${option}`}
                        className="h-5 w-5 border-2 border-border text-primary transition-colors duration-200"
                      />
                      <Label
                        htmlFor={`${field.id}-${option}`}
                        className="text-base text-foreground cursor-pointer flex-1 py-1 font-medium"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {hasError && (
                  <p className="text-sm text-destructive flex items-center gap-2 mt-2 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    {errors[field.id]}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      case "file":
        return (
          <div
            key={field.id}
            className="group relative overflow-hidden rounded-xl border-2 border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center ring-2 ring-primary/20">
                {index + 1}
              </div>
              <div className="flex-1 space-y-3">
                <Label htmlFor={field.id} className="text-base font-semibold text-foreground block">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center bg-background/50 transition-all duration-200 hover:bg-background hover:border-primary/50 ${hasError ? "border-destructive" : "border-border"
                    }`}
                >
                  <input
                    id={field.id}
                    type="file"
                    multiple
                    onChange={(e) => handleFileChange(field.id, e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground mt-1">Support for multiple files</p>
                    </div>
                  </div>
                </div>
                {uploadedFiles[field.id] && uploadedFiles[field.id].length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles[field.id].map((file, fileIndex) => (
                      <div
                        key={fileIndex}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(field.id, fileIndex)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 transition-all"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {hasError && (
                  <p className="text-sm text-destructive flex items-center gap-2 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    {errors[field.id]}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-foreground font-semibold text-lg">Loading form...</p>
          <p className="text-muted-foreground text-sm mt-2">Please wait while we prepare your form</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <Card className="max-w-md shadow-xl border-2 border-border bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Form Not Found</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              The form you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const fields = (typeof form.fields === "string" ? JSON.parse(form.fields) : form.fields) as FormField[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Professional Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b-2 border-border/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-primary/20">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">{form.title}</h1>
                {form.description && (
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{form.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                <Shield className="h-4 w-4 text-primary" />
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
          <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl p-6 flex items-center gap-4 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div className="relative flex-1">
              <h3 className="font-semibold text-foreground text-sm">Secure Form Submission</h3>
              <p className="text-muted-foreground text-sm mt-0.5">
                Your responses are encrypted and securely stored. We respect your privacy and data security.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          {fields.map((field, index) => renderField(field, index))}

          {/* Submit Section */}
          <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm rounded-2xl border-2 border-border shadow-lg p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">Your response will be recorded securely</span>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></div>
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
      <div className="border-t-2 border-border/50 bg-card/50 backdrop-blur-sm mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm flex-wrap gap-4">
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-foreground" />
                </div>
                <span className="font-medium">Professional Forms</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <span>Enterprise-grade form solution</span>
            </div>
            <div className="text-muted-foreground">© {new Date().getFullYear()} All rights reserved</div>
          </div>
        </div>
      </div>
    </div>
  )
}
