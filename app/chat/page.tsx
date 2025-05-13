"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Send } from "lucide-react"

interface Message {
  id: string
  user_id: string
  content: string
  created_at: string
  user: {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
  }
}

export default function ChatPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/auth/login?redirect=/chat")
        return
      }

      setUser(session.user)

      // For demo purposes, we'll simulate chat messages
      // In a real app, you would fetch from your database and set up real-time subscriptions
      setTimeout(() => {
        const demoMessages = [
          {
            id: "1",
            user_id: "system",
            content:
              "Welcome to the community chat! This is where you can discuss products and shopping experiences with other users.",
            created_at: new Date(Date.now() - 3600000).toISOString(),
            user: {
              id: "system",
              email: "system@example.com",
              full_name: "System",
              avatar_url: null,
            },
          },
          {
            id: "2",
            user_id: "user1",
            content: "Has anyone tried the new wireless headphones? Are they worth the price?",
            created_at: new Date(Date.now() - 1800000).toISOString(),
            user: {
              id: "user1",
              email: "user1@example.com",
              full_name: "Jane Smith",
              avatar_url: "/diverse-group-avatars.png",
            },
          },
          {
            id: "3",
            user_id: "user2",
            content: "Yes! I bought them last week and the sound quality is amazing. Battery life is great too.",
            created_at: new Date(Date.now() - 1200000).toISOString(),
            user: {
              id: "user2",
              email: "user2@example.com",
              full_name: "John Doe",
              avatar_url: "/diverse-group-avatars.png",
            },
          },
        ]

        setMessages(demoMessages)
        setLoading(false)
      }, 1000)
    }

    checkSession()

    // In a real app, you would set up a real-time subscription here
    // const channel = supabase
    //   .channel('public:messages')
    //   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
    //     // Handle new message
    //   })
    //   .subscribe()

    // return () => {
    //   supabase.removeChannel(channel)
    // }
  }, [router, supabase])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !user) return

    setSending(true)

    // In a real app, you would insert the message into your database
    // For demo purposes, we'll simulate sending a message
    setTimeout(() => {
      const newMsg: Message = {
        id: Date.now().toString(),
        user_id: user.id,
        content: newMessage,
        created_at: new Date().toISOString(),
        user: {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        },
      }

      setMessages([...messages, newMsg])
      setNewMessage("")
      setSending(false)
    }, 500)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[calc(100vh-200px)] flex flex-col">
        <CardHeader>
          <CardTitle>Community Chat</CardTitle>
          <CardDescription>Discuss products and shopping experiences with other users</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.user_id === user?.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex ${message.user_id === user?.id ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[80%]`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.user.avatar_url || undefined} />
                    <AvatarFallback>
                      {message.user.full_name?.charAt(0) || message.user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.user_id === "system"
                          ? "bg-muted text-muted-foreground"
                          : message.user_id === user?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.user_id !== user?.id && (
                        <span className="font-medium mr-1">
                          {message.user.full_name || message.user.email.split("@")[0]}
                        </span>
                      )}
                      {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
