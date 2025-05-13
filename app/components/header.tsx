"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@/lib/supabase/client"
import type { Session } from "@supabase/supabase-js"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShoppingCart, User, Heart, LogOut, Package } from "lucide-react"

export default function Header({ session }: { session: Session | null }) {
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Social Commerce
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/category/all"
            className={`hover:text-primary ${pathname.startsWith("/category") ? "text-primary font-medium" : ""}`}
          >
            Shop
          </Link>
          <Link
            href="/chat"
            className={`hover:text-primary ${pathname.startsWith("/chat") ? "text-primary font-medium" : ""}`}
          >
            Community
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Link href="/favorites" className="hover:text-primary">
                <Heart className="h-5 w-5" />
              </Link>
              <Link href="/checkout" className="hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.user_metadata?.avatar_url || "/placeholder.svg"}
                        alt={session.user?.email || ""}
                      />
                      <AvatarFallback>{session.user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="default">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
