"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Heart } from "lucide-react"
import Link from "next/link"

interface FavoriteItem {
  id: string
  item_id: string
  user_id: string
  created_at: string
  item: {
    id: string
    name: string
    price: number
    image_url: string
  }
}

export default function FavoritesPage() {
  const supabase = createClientComponentClient()

  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      try {
        // Get current user
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          window.location.href = "/auth/login?redirect=/favorites"
          return
        }

        setUser(session.user)

        // For demo purposes, we'll simulate favorites data
        // In a real app, you would fetch from your database
        setTimeout(() => {
          const demoFavorites = [
            {
              id: "1",
              item_id: "101",
              user_id: session.user.id,
              created_at: new Date().toISOString(),
              item: {
                id: "101",
                name: "Wireless Headphones",
                price: 99.99,
                image_url: "/diverse-people-listening-headphones.png",
              },
            },
            {
              id: "2",
              item_id: "102",
              user_id: session.user.id,
              created_at: new Date().toISOString(),
              item: {
                id: "102",
                name: "Smart Watch",
                price: 199.99,
                image_url: "/modern-smartwatch.png",
              },
            },
            {
              id: "3",
              item_id: "103",
              user_id: session.user.id,
              created_at: new Date().toISOString(),
              item: {
                id: "103",
                name: "Bluetooth Speaker",
                price: 79.99,
                image_url: "/audio-speaker.png",
              },
            },
          ]

          setFavorites(demoFavorites)
          setLoading(false)
        }, 1000)
      } catch (error: any) {
        setError(error.message || "Error loading favorites")
        setLoading(false)
      }
    }

    fetchUserAndFavorites()
  }, [supabase])

  const handleRemoveFavorite = (id: string) => {
    // In a real app, you would call your API to remove the favorite
    setFavorites(favorites.filter((fav) => fav.id !== id))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Favorites</CardTitle>
            <CardDescription>Your saved items</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Favorites</CardTitle>
          <CardDescription>Your saved items</CardDescription>
        </CardHeader>
        <CardContent>
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No favorites yet</h3>
              <p className="mt-2 text-muted-foreground">Items you save will appear here</p>
              <Button asChild className="mt-4">
                <Link href="/category/all">Browse Items</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="border rounded-lg overflow-hidden">
                  <div className="relative h-48 bg-muted">
                    <img
                      src={favorite.item.image_url || "/placeholder.svg"}
                      alt={favorite.item.name}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
                      onClick={() => handleRemoveFavorite(favorite.id)}
                    >
                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{favorite.item.name}</h3>
                    <p className="text-primary font-bold mt-1">${favorite.item.price.toFixed(2)}</p>
                    <div className="mt-3 flex space-x-2">
                      <Button asChild variant="default" size="sm" className="flex-1">
                        <Link href={`/item/${favorite.item.id}`}>View Details</Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
