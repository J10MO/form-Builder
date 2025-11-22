import { getDb } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { FormSubmitContent } from "@/components/form-submit-content"

export default async function FormSubmitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sql = getDb()
  const user = await getAuthUser()

  // Fetch the form
  const forms = await sql`
    SELECT * FROM forms WHERE id = ${id}
  `

  if (forms.length === 0) {
    redirect("/")
  }

  const form = forms[0]

  // If form is private, require authentication
  if (form.is_private && !user) {
    redirect(`/login?redirect=/forms/${id}/submit`)
  }

  // If form is private and user is not the owner, show unauthorized
  if (form.is_private && user && form.user_id !== user.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-600 mb-6">This form is private and can only be accessed by the owner.</p>
        </div>
      </div>
    )
  }

  return <FormSubmitContent form={form} user={user} />
}
