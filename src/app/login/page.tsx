/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:3000/api/v1/users/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.data.accessToken);
      localStorage.setItem("userName", res.data.data.user.name);
      router.push("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-rose-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-rose-100">
          <div className="text-center mb-8">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 4,
              }}
              className="flex justify-center mb-4"
            >
              <Sparkles className="text-amber-400" size={40} />
            </motion.div>
            <h1 className="text-3xl font-bold text-rose-500">Welcome back!</h1>
            <p className="text-amber-600 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-3 bg-rose-100 text-rose-600 rounded-lg text-sm border border-rose-200"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div whileHover={{ scale: 1.01 }}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-amber-800 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-amber-900 placeholder-amber-400"
                required
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-amber-800 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-amber-900 placeholder-amber-400 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-amber-500 hover:text-amber-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-500 hover:to-rose-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-amber-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <motion.span
                      initial={{ x: -20, opacity: 0 }}
                      animate={{
                        x: isHovered ? 5 : -20,
                        opacity: isHovered ? 1 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="ml-1"
                    >
                      →
                    </motion.span>
                  </>
                )}
                <motion.div
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{
                    x: isHovered ? "0%" : "-100%",
                    opacity: isHovered ? 0.2 : 0,
                  }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-white/20"
                />
              </button>
            </motion.div>
          </form>

          <div className="mt-8 pt-6 border-t border-amber-100">
            <p className="text-center text-sm text-amber-700">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-rose-500 font-medium hover:text-rose-600 underline underline-offset-4"
              >
                Sign up now
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
