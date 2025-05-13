import Link from "next/link"
import { createServerComponentClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const supabase = createServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div className="space-y-16">
      <section className="py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Discover, Connect, Shop
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Join our social commerce platform where you can discover unique products, connect with like-minded
                  shoppers, and shop with confidence.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/category/all">Start Shopping</Link>
                </Button>
                {!session && (
                  <Button asChild variant="outline" size="lg">
                    <Link href="/auth/signup">Create Account</Link>
                  </Button>
                )}
              </div>
            </div>
            <img
              src="/placeholder.svg?key=q2dit"
              alt="Social Commerce Platform"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform combines social networking with e-commerce for a unique shopping experience
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary/10 p-4">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Social Shopping</h3>
              <p className="text-center text-muted-foreground">
                Connect with friends and discover products through your social network
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary/10 p-4">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2H2v10h10V2Z" />
                  <path d="M12 12H2v10h10V12Z" />
                  <path d="M22 2h-10v20h10V2Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Curated Collections</h3>
              <p className="text-center text-muted-foreground">Discover products organized into themed collections</p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary/10 p-4">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 12h.01" />
                  <path d="M12 12h.01" />
                  <path d="M16 12h.01" />
                  <path d="M21 12a9 9 0 0 1-9 9" />
                  <path d="M12 3a9 9 0 0 1 9 9" />
                  <path d="M3 12a9 9 0 0 0 9 9" />
                  <path d="M12 3a9 9 0 0 0-9 9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Real-time Chat</h3>
              <p className="text-center text-muted-foreground">
                Discuss products and shopping experiences with other users
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
