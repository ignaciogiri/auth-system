import { createServerComponentClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

// This is a mock function to simulate fetching category data
// In a real app, you would fetch from your database
async function getCategoryItems(slug: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  const allItems = [
    {
      id: "101",
      name: "Wireless Headphones",
      price: 99.99,
      image_url: "/diverse-people-listening-headphones.png",
      category: "electronics",
    },
    {
      id: "102",
      name: "Smart Watch",
      price: 199.99,
      image_url: "/modern-smartwatch.png",
      category: "electronics",
    },
    {
      id: "103",
      name: "Bluetooth Speaker",
      price: 79.99,
      image_url: "/audio-speaker.png",
      category: "electronics",
    },
    {
      id: "201",
      name: "Cotton T-Shirt",
      price: 24.99,
      image_url: "/plain-white-tshirt.png",
      category: "clothing",
    },
    {
      id: "202",
      name: "Denim Jeans",
      price: 49.99,
      image_url: "/folded-denim-stack.png",
      category: "clothing",
    },
    {
      id: "301",
      name: "Coffee Maker",
      price: 129.99,
      image_url: "/classic-coffeemaker.png",
      category: "home",
    },
  ]

  if (slug === "all") {
    return allItems
  }

  return allItems.filter((item) => item.category === slug)
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const items = await getCategoryItems(params.slug)

  const categories = [
    { slug: "all", name: "All Products" },
    { slug: "electronics", name: "Electronics" },
    { slug: "clothing", name: "Clothing" },
    { slug: "home", name: "Home & Kitchen" },
  ]

  const currentCategory = categories.find((cat) => cat.slug === params.slug) || categories[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{currentCategory.name}</h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? "product" : "products"} available
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.slug}
              variant={category.slug === params.slug ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`/category/${category.slug}`}>{category.name}</Link>
            </Button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">No products found</h2>
          <p className="text-muted-foreground mt-2">Try selecting a different category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-48 bg-muted">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
                  disabled={!session}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                <div className="mt-3 flex space-x-2">
                  <Button asChild variant="default" size="sm" className="flex-1">
                    <Link href={`/item/${item.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
