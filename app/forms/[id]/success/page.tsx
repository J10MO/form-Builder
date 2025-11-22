"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Copy, ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FormSuccessPage() {
  const params = useParams()
  const formId = params.id as string
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${formId}`)
        const data = await response.json()
        setForm(data.form)

        const url = `${window.location.origin}/f/${data.form.share_token}`
        setShareUrl(url)
      } catch (error) {
        console.error("[v0] Error fetching form:", error)
      }
    }

    fetchForm()
  }, [formId])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-100 py-12">
      <div className="mx-auto max-w-2xl px-4">
        <Card className="border-2 border-emerald-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900">Form Created Successfully!</CardTitle>
            <CardDescription className="text-base">
              Your form "{form?.title}" is now live and ready to collect responses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="share-url">Share Link</Label>
              <div className="flex gap-2">
                <Input id="share-url" value={shareUrl} readOnly className="font-mono text-sm" />
                <Button onClick={copyToClipboard} variant="outline" size="icon" className="shrink-0 bg-transparent">
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-slate-500">Share this link with others to collect responses</p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href={`/f/${form?.share_token}`} target="_blank">
                <Button className="w-full bg-transparent" variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview Form
                </Button>
              </Link>

              <Link href={`/forms/${formId}/responses`}>
                <Button className="w-full">View Responses</Button>
              </Link>

              <Link href="/forms">
                <Button className="w-full" variant="ghost">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to My Forms
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
