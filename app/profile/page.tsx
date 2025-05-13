import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProfileForm from "./profile-form"

export default async function ProfilePage() {
  const supabase = createServerComponentClient()

  // Get user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login?redirect=/profile")
  }

  // Fetch profile data
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>View and update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm session={session} profile={profile} />
        </CardContent>
      </Card>
    </div>
  )
}
