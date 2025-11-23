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
import {
  Plus,
  Trash2,
  ArrowLeft,
  Lock,
  Globe,
  Sparkles,
  FileText,
  GripVertical,
  ChevronDown,
  MousePointerClick,
} from "lucide-react"
import type { FormField } from "@/lib/db"
import { nanoid } from "nanoid"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"

const FIELD_TYPES = [
  { value: "text", label: "Text Input" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
  { value: "textarea", label: "Text Area" },
  { value: "select", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio Buttons" },
  { value: "file", label: "File Upload" },
]

export function NewFormContent({ userId }: { userId: number }) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([])
  const [isPrivate, setIsPrivate] = useState(false)
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

  const addOption = (fieldId: string) => {
    setFields(
      fields.map((field) => {
        if (field.id === fieldId) {
          const currentOptions = field.options || []
          return {
            ...field,
            options: [...currentOptions, `Option ${currentOptions.length + 1}`],
          }
        }
        return field
      }),
    )
  }

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    setFields(
      fields.map((field) => {
        if (field.id === fieldId) {
          const newOptions = [...(field.options || [])]
          newOptions[optionIndex] = value
          return {
            ...field,
            options: newOptions,
          }
        }
        return field
      }),
    )
  }

  const removeOption = (fieldId: string, optionIndex: number) => {
    setFields(
      fields.map((field) => {
        if (field.id === fieldId) {
          const newOptions = (field.options || []).filter((_, index) => index !== optionIndex)
          return {
            ...field,
            options: newOptions,
          }
        }
        return field
      }),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || fields.length === 0) {
      alert("Please add a title and at least one field")
      return
    }

    setIsSubmitting(true)

    try {
      console.log("[v0] Submitting form with data:", {
        userId,
        title,
        description,
        fieldsCount: fields.length,
        isPrivate,
      })

      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title,
          description,
          fields,
          isPrivate,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("[v0] Server error:", errorData)
        throw new Error(errorData.details || errorData.error || "Failed to create form")
      }

      const { form } = await response.json()
      console.log("[v0] Form created successfully:", form.id)
      router.push(`/forms/${form.id}/success`)
    } catch (error) {
      console.error("[v0] Error creating form:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create form. Please try again."
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="group hover:bg-muted/60 transition-all">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="border-2 shadow-xl backdrop-blur-sm bg-card/95 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

          <CardHeader className="relative space-y-3 pb-8 border-b bg-muted/10">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold tracking-tight">Create New Form</CardTitle>
                <CardDescription className="text-base mt-1.5">
                  Build your custom form by adding fields and configuring their properties
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative p-0">
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-8 bg-background/50">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-semibold">
                      Form Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Customer Feedback Survey"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="h-11 text-base transition-all focus:ring-2 focus:ring-primary/20 bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this form is for..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="resize-none transition-all focus:ring-2 focus:ring-primary/20 bg-background"
                    />
                  </div>

                  <div className="group relative overflow-hidden rounded-xl border-2 border-border bg-gradient-to-br from-muted/40 to-muted/20 p-5 transition-all hover:border-primary/30 hover:shadow-md">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`rounded-lg p-2.5 ring-1 transition-all ${isPrivate
                              ? "bg-orange-500/10 ring-orange-500/20 text-orange-600 dark:text-orange-400"
                              : "bg-emerald-500/10 ring-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            }`}
                        >
                          {isPrivate ? <Lock className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="privacy-toggle" className="text-base font-semibold cursor-pointer">
                            {isPrivate ? "Private Form" : "Public Form"}
                          </Label>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {isPrivate
                              ? "Only you can access and submit this form"
                              : "Anyone with the link can submit this form"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="privacy-toggle"
                        checked={isPrivate}
                        onCheckedChange={setIsPrivate}
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 border-t-2 border-border/50 bg-muted/5 p-6">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Form Fields</h3>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">Build your form structure</p>
                    </div>
                    <span className="ml-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/20">
                      {fields.length}
                    </span>
                  </div>
                </div>

                <div className="max-h-[600px] overflow-y-auto pr-2 space-y-5 custom-scrollbar -mr-2 pl-1 pb-2">
                  {fields.length === 0 && (
                    <div
                      onClick={addField}
                      className="cursor-pointer group relative overflow-hidden rounded-xl border-2 border-dashed border-border p-12 text-center bg-gradient-to-br from-muted/30 to-muted/10 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.05),transparent)]" />
                      <div className="relative flex flex-col items-center gap-4">
                        <div className="rounded-full bg-muted p-4 ring-8 ring-muted/50 group-hover:ring-primary/10 group-hover:bg-primary/10 transition-all duration-300">
                          <MousePointerClick className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                            Start Building
                          </p>
                          <p className="text-sm text-muted-foreground group-hover:text-primary/70 transition-colors">
                            Click here to add your first field
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {fields.map((field, index) => (
                    <Card
                      key={field.id}
                      className="group relative border shadow-sm hover:shadow-lg transition-all duration-200 bg-card hover:border-primary/30"
                    >
                      <div className="absolute left-3 top-6 opacity-0 group-hover:opacity-40 transition-opacity cursor-move">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <CardContent className="pt-6 pl-10">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm ring-4 ring-primary/5 transition-transform group-hover:scale-110">
                            {index + 1}
                          </div>

                          <div className="flex-1 space-y-5">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label className="text-sm font-semibold">Field Label *</Label>
                                <Input
                                  placeholder="e.g., Full Name"
                                  value={field.label}
                                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                                  required
                                  className="transition-all focus:ring-2 focus:ring-primary/20 bg-background/50"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-semibold">Field Type</Label>
                                <Select
                                  value={field.type}
                                  onValueChange={(value) => updateField(field.id, { type: value as FormField["type"] })}
                                >
                                  <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20 bg-background/50">
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
                              <div className="space-y-3 rounded-lg bg-muted/30 p-4 border border-border/50">
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                  <ChevronDown className="h-4 w-4 text-primary" />
                                  Options
                                </Label>
                                <div className="space-y-2">
                                  {field.options?.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center gap-2">
                                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-background text-xs font-semibold text-muted-foreground border border-border">
                                        {optionIndex + 1}
                                      </div>
                                      <Input
                                        value={option}
                                        onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                                        placeholder={`Option ${optionIndex + 1}`}
                                        className="flex-1 bg-background"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeOption(field.id, optionIndex)}
                                        className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive flex-shrink-0 transition-all hover:scale-110"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>

                                {(!field.options || field.options.length === 0) && (
                                  <div className="rounded-lg border-2 border-dashed border-border p-6 text-center bg-background/50">
                                    <p className="text-muted-foreground text-sm">No options added yet</p>
                                  </div>
                                )}

                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addOption(field.id)}
                                  className="w-full hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Option
                                </Button>

                                <p className="text-xs text-muted-foreground pl-1">
                                  Add individual options for{" "}
                                  {field.type === "checkbox"
                                    ? "checkboxes"
                                    : field.type === "radio"
                                      ? "radio buttons"
                                      : "dropdown"}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center space-x-2 rounded-lg bg-muted/20 px-3 py-2.5 w-fit border border-border/50">
                              <Checkbox
                                id={`required-${field.id}`}
                                checked={field.required}
                                onCheckedChange={(checked) => updateField(field.id, { required: checked === true })}
                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all hover:scale-110 flex-shrink-0"
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

              <div className="flex justify-end gap-3 p-6 border-t bg-muted/5">
                <Link href="/">
                  <Button type="button" variant="outline" className="hover:bg-muted/60 transition-all bg-transparent">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || fields.length === 0}
                  className="shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:hover:scale-100 min-w-[160px] h-11 text-base"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Form
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
