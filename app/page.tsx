// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Plus, FileText, BarChart3, Database } from "lucide-react"
// import Link from "next/link"
// import { NavBar } from "@/components/nav-bar"
// import { getAuthUser } from "@/lib/auth"

// export default async function HomePage() {
//   const user = await getAuthUser()

//   if (!user) {
//     return (
//       <>
//         <NavBar user={null} />
//         <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 px-4">
//           <div className="w-full max-w-2xl space-y-6">
//             <Card className="border-blue-200 bg-blue-50">
//               <CardHeader className="text-center">
//                 <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
//                   <Database className="h-6 w-6 text-white" />
//                 </div>
//                 <CardTitle className="text-xl font-bold text-blue-900">First Time Here?</CardTitle>
//                 <CardDescription className="text-blue-700">
//                   Initialize your database before creating an account
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Link href="/setup">
//                   <Button variant="outline" className="w-full bg-white hover:bg-blue-50">
//                     Setup Database
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>

//             <Card className="w-full border-slate-200 shadow-xl">
//               <CardHeader className="text-center">
//                 <CardTitle className="text-2xl font-bold text-slate-900">Welcome to FormBuilder</CardTitle>
//                 <CardDescription className="mt-2">Please sign in to access your forms</CardDescription>
//               </CardHeader>
//               <CardContent className="flex gap-3">
//                 <Link href="/login" className="flex-1">
//                   <Button className="w-full">Sign In</Button>
//                 </Link>
//                 <Link href="/register" className="flex-1">
//                   <Button variant="outline" className="w-full bg-transparent">
//                     Sign Up
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </>
//     )
//   }

//   return (
//     <>
//       <NavBar user={user} />
//       <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-slate-50">
//         <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//           <div className="mb-12 text-center">
//             <h1 className="mb-4 text-5xl font-bold tracking-tight text-slate-900">Dynamic Form Builder</h1>
//             <p className="mx-auto max-w-2xl text-balance text-lg text-slate-600">
//               Create custom forms with ease, share them instantly, and collect responses in real-time
//             </p>
//           </div>

//           <div className="grid gap-6 md:grid-cols-3">
//             <Card className="border-2 border-slate-200 transition-all hover:border-blue-500 hover:shadow-lg">
//               <CardHeader>
//                 <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
//                   <Plus className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <CardTitle>Create Form</CardTitle>
//                 <CardDescription>Build dynamic forms with custom fields tailored to your needs</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Link href="/forms/new">
//                   <Button className="w-full">Get Started</Button>
//                 </Link>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-slate-200 transition-all hover:border-emerald-500 hover:shadow-lg">
//               <CardHeader>
//                 <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
//                   <FileText className="h-6 w-6 text-emerald-600" />
//                 </div>
//                 <CardTitle>My Forms</CardTitle>
//                 <CardDescription>View and manage all your created forms in one place</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Link href="/forms">
//                   <Button variant="outline" className="w-full bg-transparent">
//                     View Forms
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-slate-200 transition-all hover:border-purple-500 hover:shadow-lg">
//               <CardHeader>
//                 <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
//                   <BarChart3 className="h-6 w-6 text-purple-600" />
//                 </div>
//                 <CardTitle>Analytics</CardTitle>
//                 <CardDescription>Track responses and analyze form submission data</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Link href="/forms">
//                   <Button variant="outline" className="w-full bg-transparent">
//                     View Analytics
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }



import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, BarChart3, Database } from "lucide-react"
import Link from "next/link"
import { NavBar } from "@/components/nav-bar"
import { getAuthUser } from "@/lib/auth"

export default async function HomePage() {
  const user = await getAuthUser()

  if (!user) {
    return (
      <>
        <NavBar user={null} />
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 px-4">
          <div className="w-full max-w-2xl space-y-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-blue-900">First Time Here?</CardTitle>
                <CardDescription className="text-blue-700">
                  Initialize your database before creating an account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/setup">
                  <Button variant="outline" className="w-full bg-white hover:bg-blue-50">
                    Setup Database
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="w-full border-slate-200 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-slate-900">Welcome to FormBuilder</CardTitle>
                <CardDescription className="mt-2">Please sign in to access your forms</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Link href="/login" className="flex-1">
                  <Button className="w-full">Sign In</Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Sign Up
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <NavBar user={user} />
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-slate-900">Dynamic Form Builder</h1>
            <p className="mx-auto max-w-2xl text-balance text-lg text-slate-600">
              Create custom forms with ease, share them instantly, and collect responses in real-time
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-2 border-slate-200 transition-all hover:border-blue-500 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Create Form</CardTitle>
                <CardDescription>Build dynamic forms with custom fields tailored to your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/forms/new">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 transition-all hover:border-emerald-500 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>My Forms</CardTitle>
                <CardDescription>View and manage all your created forms in one place</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/forms">
                  <Button variant="outline" className="w-full bg-transparent">
                    View Forms
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 transition-all hover:border-purple-500 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Track responses and analyze form submission data</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/analytics">
                  <Button variant="outline" className="w-full bg-transparent">
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
