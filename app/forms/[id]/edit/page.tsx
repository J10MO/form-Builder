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
import { Plus, Trash2, ArrowLeft, Edit3, FileText, AlertCircle } from "lucide-react"
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
  { value: "file", label: "File Upload" },
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
  const [fieldStats, setFieldStats] = useState<Record<string, { hasResponses: boolean; count: number }>>({})

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
        // fetch field-level response stats
        try {
          const statsRes = await fetch(`/api/forms/${formId}/field-stats`)
          if (statsRes.ok) {
            const statsJson = await statsRes.json()
            setFieldStats(statsJson.fields || {})
          }
        } catch (err) {
          console.error("[v0] Error fetching field stats:", err)
        }
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

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Failed to update form" }))
        const message = err.error || "Failed to update form"
        // Show precise server message when type-change is blocked
        alert(message)
        setIsSubmitting(false)
        return
      }

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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground font-medium">Loading form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6">
          <Link href={`/forms/${formId}/responses`}>
            <Button variant="ghost" size="sm" className="group hover:bg-muted/60 transition-all">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Responses
            </Button>
          </Link>
        </div>

        <Card className="border-2 shadow-xl backdrop-blur-sm bg-card/95 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

          <CardHeader className="relative space-y-3 pb-8 border-b bg-muted/10">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20">
                <Edit3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold tracking-tight">Edit Form</CardTitle>
                <CardDescription className="text-base mt-1.5">Update your form details and fields</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative pt-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6 border-b-2 border-border/50 pb-8">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-semibold">
                    Form Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Customer Feedback Survey"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="h-11 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-semibold">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this form is for..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="text-base resize-none"
                  />
                </div>
              </div>

              <div className="space-y-6 border-t-2 border-border/50 bg-muted/5 -mx-6 px-6 py-6">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Form Fields</h3>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">Update your form structure</p>
                    </div>
                    <span className="ml-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/20">
                      {fields.length}
                    </span>
                  </div>
                </div>

                <div className="max-h-[600px] overflow-y-auto pr-2 space-y-5 -mr-2 pl-1 pb-2">
                  {fields.length === 0 && (
                    <div className="rounded-xl border-2 border-dashed border-border p-12 text-center bg-gradient-to-br from-muted/30 to-muted/10">
                      <div className="flex flex-col items-center gap-3">
                        <div className="rounded-full bg-muted p-4 ring-8 ring-muted/50">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">No fields yet</p>
                          <p className="text-sm text-muted-foreground">Click "Add New Field" below to get started</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {fields.map((field, index) => (
                    <Card
                      key={field.id}
                      className="border-2 bg-card shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      <CardContent className="pt-6 relative">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-bold text-primary ring-1 ring-primary/20">
                            {index + 1}
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label className="text-sm font-semibold">Field Label *</Label>
                                <Input
                                  placeholder="e.g., Full Name"
                                  value={field.label}
                                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                                  required
                                  className="h-10"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-semibold">Field Type</Label>
                                <Select
                                  value={field.type}
                                  onValueChange={(value) => updateField(field.id, { type: value as FormField["type"] })}
                                >
                                  <SelectTrigger disabled={!!fieldStats[field.id]?.hasResponses} className="h-10">
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
                                {fieldStats[field.id]?.hasResponses && (
                                  <div className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2.5 py-1.5 rounded-md border border-orange-500/20">
                                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                    <span>Cannot change type — {fieldStats[field.id].count} response(s) exist</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {(field.type === "select" || field.type === "radio") && (
                              <div className="space-y-2">
                                <Label className="text-sm font-semibold">Options (comma-separated)</Label>
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
                                  className="h-10"
                                />
                              </div>
                            )}

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`required-${field.id}`}
                                checked={field.required}
                                onCheckedChange={(checked) => updateField(field.id, { required: checked === true })}
                              />
                              <Label htmlFor={`required-${field.id}`} className="text-sm font-medium cursor-pointer">
                                Required field
                              </Label>
                            </div>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeField(field.id)}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-all flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button
                  type="button"
                  onClick={addField}
                  className="w-full h-14 border-2 border-dashed border-border bg-background/50 hover:bg-primary/5 hover:border-primary/30 hover:text-primary text-muted-foreground font-semibold text-base transition-all duration-300 rounded-xl flex items-center justify-center gap-2 group shadow-sm hover:shadow-md"
                >
                  <div className="bg-primary/10 p-1.5 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Plus className="h-5 w-5" />
                  </div>
                  Add New Field
                </Button>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t-2 border-border/50">
                <Link href={`/forms/${formId}/responses`}>
                  <Button type="button" variant="outline" className="h-11 px-6 bg-transparent">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || fields.length === 0}
                  className="h-11 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
                >
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
