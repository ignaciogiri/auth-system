"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>We've sent a verification link to your email</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 pt-4">
          <div className="rounded-full bg-primary/10 p-6">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center space-y-2">
            <p>
              We've sent a verification link to <span className="font-medium">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Please check your email and click the verification link to complete your registration. If you don't see
              the email, check your spam folder.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/login">Back to login</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
