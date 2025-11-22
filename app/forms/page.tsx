import { NavBar } from "@/components/nav-bar"
import { requireAuth } from "@/lib/auth"
import { FormsListContent } from "@/components/forms-list-content"

export default async function FormsListPage() {
  const user = await requireAuth()

  return (
    <>
      <NavBar user={user} />
      <FormsListContent userId={user.id} />
    </>
  )
}
