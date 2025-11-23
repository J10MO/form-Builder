import { NavBar } from "@/components/nav-bar"
import { requireAuth } from "@/lib/auth"
import { FormsListContent } from "@/components/forms-list-content"

export const dynamic = "force-dynamic"

export default async function FormsListPage() {
  const user = await requireAuth()

  return (
    <>
      <NavBar user={user} />
      <FormsListContent userId={user.id} />
    </>
  )
}
