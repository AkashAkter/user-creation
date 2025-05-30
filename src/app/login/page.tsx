/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Pacifico, Poppins } from "next/font/google";

// Define custom fonts
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login successful!");
      router.push("/profile");
    } catch (error: any) {
      console.error("Login failed", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!user.email || !user.password);
  }, [user]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0px 5px 15px rgba(139, 92, 246, 0.4)",
      transition: {
        duration: 0.3,
        yoyo: Infinity,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center p-4 ${poppins.className}`}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-700/20"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="w-full max-w-md z-10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        <div className="bg-slate-800/70 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
          {/* Header with gradient */}
          <motion.div
            className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 mix-blend-overlay" />
            <motion.h1
              className={`text-3xl font-bold text-white ${pacifico.className}`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              {loading ? "Welcome Back!" : "Welcome Back"}
            </motion.h1>
            <motion.p
              className="text-indigo-200 mt-2 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Sign in to continue your journey
            </motion.p>
          </motion.div>

          {/* Form section */}
          <motion.div
            className="p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <form onSubmit={signIn} className="space-y-5">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <input
                    type="email"
                    id="email"
                    placeholder="john@example.com"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-white placeholder-slate-400 outline-none"
                    required
                  />
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-white placeholder-slate-400 outline-none pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-violet-300 transition-colors"
                  >
                    {showPassword ? (
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
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-violet-400 hover:text-violet-300 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <motion.button
                  type="submit"
                  disabled={buttonDisabled || loading}
                  variants={buttonVariants}
                  whileHover={buttonDisabled || loading ? {} : "hover"}
                  whileTap={buttonDisabled || loading ? {} : "tap"}
                  className={`w-full ${
                    buttonDisabled || loading
                      ? "bg-slate-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
                  } text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </motion.div>
            </form>

            <motion.div className="mt-6 text-center" variants={itemVariants}>
              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </motion.div>

            <motion.div
              className="mt-6 pt-6 border-t border-slate-700/50 text-center"
              variants={itemVariants}
            >
              <p className="text-xs text-slate-500">
                By continuing, you agree to our{" "}
                <a href="#" className="text-violet-400 hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-violet-400 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
