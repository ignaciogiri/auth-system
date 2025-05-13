import { notFound } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import AddToCartButton from "./add-to-cart-button"

// This is a mock function to simulate fetching item data
// In a real app, you would fetch from your database
async function getItemData(id: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  const items = {
    "101": {
      id: "101",
      name: "Wireless Headphones",
      description: "Premium wireless headphones with noise cancellation and long battery life.",
      price: 99.99,
      image_url: "/diverse-people-listening-headphones.png",
      category: "electronics",
      in_stock: true,
    },
    "102": {
      id: "102",
      name: "Smart Watch",
      description: "Track your fitness, receive notifications, and more with this stylish smart watch.",
      price: 199.99,
      image_url: "/modern-smartwatch.png",
      category: "electronics",
      in_stock: true,
    },
    "103": {
      id: "103",
      name: "Bluetooth Speaker",
      description: "Portable Bluetooth speaker with amazing sound quality and water resistance.",
      price: 79.99,
      image_url: "/audio-speaker.png",
      category: "electronics",
      in_stock: false,
    },
  }

  return items[id as keyof typeof items] || null
}

export default async function ItemPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const item = await getItemData(params.id)

  if (!item) {
    notFound()
  }

  // In a real app, you would check if the item is in the user's favorites
  const isInFavorites = false

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-muted rounded-lg overflow-hidden">
          <img src={item.image_url || "/placeholder.svg"} alt={item.name} className="w-full h-full object-contain" />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{item.name}</h1>
            <p className="text-2xl font-bold text-primary mt-2">${item.price.toFixed(2)}</p>
          </div>

          <div className="prose max-w-none">
            <p>{item.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.in_stock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {item.in_stock ? "In Stock" : "Out of Stock"}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {item.category}
            </span>
          </div>

          <div className="flex flex-col space-y-3">
            <AddToCartButton item={item} disabled={!item.in_stock} />

            {session ? (
              <Button variant="outline">{isInFavorites ? "Remove from Favorites" : "Add to Favorites"}</Button>
            ) : (
              <Button variant="outline" asChild>
                <a href={`/auth/login?redirect=/item/${item.id}`}>Sign in to save to Favorites</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
