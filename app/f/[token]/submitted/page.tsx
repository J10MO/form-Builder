"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function SubmittedPage() {
  const params = useParams()
  const token = params.token as string
  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/share/${token}`)
        const data = await response.json()
        setForm(data.form)
      } catch (error) {
        console.error("[v0] Error fetching form:", error)
      }
    }

    fetchForm()
  }, [token])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-100 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md border-2 border-emerald-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <CardTitle className="text-3xl font-bold ">Response Submitted!</CardTitle>
          <CardDescription className="text-base">Thank you for completing {form?.title || "this form"}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-slate-600">Your response has been recorded successfully.</p>
          <Button
            onClick={() => (window.location.href = `${window.location.origin}/f/${token}`)}
            variant="outline"
            className="w-full"
          >
            Submit Another Response
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
