"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Phone, Mail, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! 👋 How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Bot responses based on keywords
  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase()
    
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      return "Hello! Welcome to CityGuardian. How can I assist you today?"
    }
    if (msg.includes("environmental") || msg.includes("sensor") || msg.includes("air quality")) {
      return "You can check real-time environmental data on our /environmental page. Would you like me to help you with anything specific?"
    }
    if (msg.includes("report") || msg.includes("issue") || msg.includes("problem")) {
      return "To report an issue, please visit our citizen dashboard or contact us via WhatsApp for urgent matters."
    }
    if (msg.includes("contact") || msg.includes("support") || msg.includes("help")) {
      return "You can reach us via:\n📱 WhatsApp: Click the button below\n📧 Email: support@cityguardian.com\n📞 Phone: Contact via Twilio"
    }
    if (msg.includes("whatsapp")) {
      return "Click the 'Contact on WhatsApp' button below to chat with us directly!"
    }
    if (msg.includes("thank")) {
      return "You're welcome! Feel free to reach out anytime. 😊"
    }
    
    return "I'm here to help! You can ask me about environmental monitoring, reporting issues, or contact our support team via WhatsApp or phone."
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // WhatsApp integration - Replace with your WhatsApp business number
  const openWhatsApp = () => {
    const phoneNumber = "1234567890" // Replace with your WhatsApp business number (with country code, no + or spaces)
    const message = encodeURIComponent("Hi! I need help with CityGuardian.")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  // Twilio call integration - This will need backend API endpoint
  const initiateTwilioCall = async () => {
    try {
      // TODO: You need to implement this backend endpoint
      const response = await fetch("/api/twilio/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: "+1234567890" // User's phone number (you'd collect this)
        })
      })
      
      if (response.ok) {
        alert("We'll call you shortly!")
      } else {
        alert("Unable to initiate call. Please try WhatsApp instead.")
      }
    } catch (error) {
      console.error("Twilio call error:", error)
      alert("Error initiating call. Please use WhatsApp or email.")
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse"
          aria-label="Open chat"
        >
          <MessageCircle className="w-8 h-8 text-white" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            !
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">CityGuardian Support</h3>
                <p className="text-xs text-green-100">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-green-700 rounded-full p-1 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <span className={`text-xs ${message.sender === "user" ? "text-green-100" : "text-gray-400"} mt-1 block`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 bg-white p-3">
            <p className="text-xs text-gray-600 mb-2 font-medium">Quick Contact:</p>
            <div className="flex gap-2">
              <button
                onClick={openWhatsApp}
                className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                onClick={initiateTwilioCall}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Me
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-green-500 hover:bg-green-600 text-white px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
