"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Session } from "@supabase/supabase-js"
import { createClientComponentClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Upload } from "lucide-react"

interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  website: string | null
  email: string | null
}

interface ProfileFormProps {
  session: Session
  profile: Profile | null
}

export default function ProfileForm({ session, profile }: ProfileFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [username, setUsername] = useState(profile?.username || "")
  const [website, setWebsite] = useState(profile?.website || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: session.user.id,
        full_name: fullName,
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setMessage("Profile updated successfully")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Error updating profile")
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    const fileExt = file.name.split(".").pop()
    const filePath = `${session.user.id}-${Math.random()}.${fileExt}`

    setUploading(true)
    setError(null)

    try {
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) throw uploadError

      // Get the public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)

      setAvatarUrl(data.publicUrl)
    } catch (error: any) {
      setError(error.message || "Error uploading avatar")
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl || undefined} alt={fullName || "Avatar"} />
          <AvatarFallback>{(fullName || session.user.email || "").charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex items-center space-x-2">
          <Label htmlFor="avatar" className="cursor-pointer">
            <div className="flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-muted">
              <Upload className="h-4 w-4" />
              <span>Change Avatar</span>
            </div>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={uploading}
            />
          </Label>
          {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={session.user.email || ""} disabled />
          <p className="text-xs text-muted-foreground">To change your email, go to account settings</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input id="full-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {message && <p className="text-sm text-green-500">{message}</p>}

      <Button type="submit" disabled={loading || uploading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
