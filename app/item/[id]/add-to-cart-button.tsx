"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"

interface Item {
  id: string
  name: string
  price: number
  in_stock: boolean
}

export default function AddToCartButton({
  item,
  disabled,
}: {
  item: Item
  disabled?: boolean
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)

    // Simulate API call to add item to cart
    setTimeout(() => {
      setIsAdding(false)
      setIsAdded(true)

      // Reset "Added" state after 2 seconds
      setTimeout(() => {
        setIsAdded(false)
      }, 2000)
    }, 1000)
  }

  return (
    <Button onClick={handleAddToCart} disabled={disabled || isAdding || isAdded} className="w-full">
      {isAdding ? (
        "Adding to Cart..."
      ) : isAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
