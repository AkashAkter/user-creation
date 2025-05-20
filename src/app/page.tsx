/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";
import axios from "axios";
import toast from "react-hot-toast";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const router = useRouter();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Dummy users data
  const users = [
    {
      id: "1",
      name: "John Doe",
      lastMessage: "Hey, how are you?",
      time: "10:30 AM",
      unread: 2,
    },
    {
      id: "2",
      name: "Jane Smith",
      lastMessage: "Meeting at 3 PM",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: "3",
      name: "Alex Johnson",
      lastMessage: "Please review the docs",
      time: "Monday",
      unread: 5,
    },
    {
      id: "4",
      name: "Sarah Williams",
      lastMessage: "Thanks for your help!",
      time: "Last week",
      unread: 0,
    },
  ];

  // Dummy messages data
  const messages: Record<
    string,
    Array<{ text: string; sender: "me" | "them"; time: string }>
  > = {
    "1": [
      { text: "Hey there!", sender: "them", time: "10:20 AM" },
      { text: "Hi! How are you?", sender: "me", time: "10:22 AM" },
      { text: "Hey, how are you?", sender: "them", time: "10:30 AM" },
    ],
    "2": [
      { text: "About the project", sender: "them", time: "9:00 AM" },
      { text: "Yes, what about it?", sender: "me", time: "9:05 AM" },
      { text: "Meeting at 3 PM", sender: "them", time: "9:10 AM" },
    ],
    "3": [
      { text: "Did you see the new docs?", sender: "them", time: "2:00 PM" },
      { text: "Not yet, where are they?", sender: "me", time: "2:05 PM" },
      { text: "Please review the docs", sender: "them", time: "2:10 PM" },
    ],
    "4": [
      { text: "I had a question", sender: "them", time: "11:00 AM" },
      { text: "Sure, what is it?", sender: "me", time: "11:05 AM" },
      { text: "Thanks for your help!", sender: "them", time: "11:30 AM" },
    ],
  };

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.error || "Logout failed");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && activeChat) {
      // In a real app, you would send this message to your backend
      console.log(`Sending message to ${activeChat}: ${message}`);
      setMessage("");
    }
  };

  return (
    <div className={`flex flex-col h-screen ${poppins.className}`}>
      {/* Header Navbar */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">Chat App</h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 hover:bg-white/10 p-2 rounded-lg transition">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-sm">ME</span>
              </div>
              <span>Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 hover:bg-white/10 p-2 rounded-lg transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Conversations */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full md:w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto"
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Conversations
            </h2>
            <div className="space-y-2">
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveChat(user.id)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    activeChat === user.id
                      ? "bg-indigo-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <p
                        className={`text-sm truncate ${
                          activeChat === user.id
                            ? "text-indigo-800"
                            : "text-gray-500"
                        }`}
                      >
                        {user.lastMessage}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500">{user.time}</span>
                      {user.unread > 0 && (
                        <span className="mt-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {user.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-gray-200 p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  <span className="text-gray-600">
                    {users.find((u) => u.id === activeChat)?.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {users.find((u) => u.id === activeChat)?.name}
                  </h3>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages[activeChat]?.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      msg.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                        msg.sender === "me"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "me"
                            ? "text-indigo-200"
                            : "text-gray-500"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-gray-200 p-4"
              >
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No conversation selected
              </h2>
              <p className="text-gray-500 max-w-md">
                Select a conversation from the sidebar to start chatting or
                create a new conversation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
