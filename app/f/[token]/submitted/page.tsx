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
  <div className="min-h-screen bg-[#f1f3f4] flex items-center justify-center py-10 px-4">
    <div className="w-full max-w-lg bg-white rounded-xl shadow-md border-t-[10px] border-[#673ab7] p-8 text-center">

      {/* Success Icon */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-[#ede7f6] flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-[#673ab7]" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-[#202124] mb-2">
        Response Recorded
      </h1>

      {/* Subtitle */}
      <p className="text-[#5f6368] text-base mb-6">
        Thank you for completing <span className="font-medium text-[#202124]">{form?.title || "this form"}</span>.
      </p>

      {/* Button */}
      <Button
        onClick={() => (window.location.href = `${window.location.origin}/f/${token}`)}
        className="bg-[#673ab7] hover:bg-[#5a32a0] text-white rounded-full h-11 px-8 text-base font-medium"
      >
        Submit another response
      </Button>
    </div>
  </div>
)

}
