/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
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

export default function Register() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    bio: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", {
        username: user.username,
        email: user.email,
        password: user.password,
        fullName: user.fullName,
      });

      if (response.data.success) {
        toast.success("Account created successfully!");
        router.push("/login");
      } else {
        toast.error(response.data.error || "Signup failed");
      }
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Signup failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(
      !user.email ||
        !user.password ||
        !user.username ||
        user.password.length < 6 ||
        user.username.length < 3
    );
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
              {loading ? "Creating Your Space..." : "Join Our Community"}
            </motion.h1>
            <motion.p
              className="text-indigo-200 mt-2 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Begin your creative journey with us
            </motion.p>
          </motion.div>

          {/* Form section */}
          <motion.div
            className="p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <form onSubmit={onSignUp} className="space-y-5">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={user.fullName}
                    onChange={(e) =>
                      setUser({ ...user, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-white placeholder-slate-400 outline-none"
                  />
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username*
                </label>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <input
                    type="text"
                    placeholder="john_doe"
                    value={user.username}
                    onChange={(e) =>
                      setUser({ ...user, username: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-white placeholder-slate-400 outline-none"
                    minLength={3}
                    required
                  />
                </motion.div>
                {user.username.length > 0 && user.username.length < 3 && (
                  <motion.p
                    className="text-xs text-rose-400 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Username must be at least 3 characters
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email*
                </label>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <input
                    type="email"
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
                  Password*
                </label>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-white placeholder-slate-400 outline-none"
                    minLength={6}
                    required
                  />
                </motion.div>
                {user.password.length > 0 && user.password.length < 6 && (
                  <motion.p
                    className="text-xs text-rose-400 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Password must be at least 6 characters
                  </motion.p>
                )}
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
                      Creating your account...
                    </>
                  ) : (
                    "Sign Up Now"
                  )}
                </motion.button>
              </motion.div>
            </form>

            <motion.div className="mt-6 text-center" variants={itemVariants}>
              <p className="text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors hover:underline"
                >
                  Log in here
                </Link>
              </p>
            </motion.div>

            <motion.div className="mt-4 text-center" variants={itemVariants}>
              <p className="text-xs text-slate-500">
                By signing up, you agree to our{" "}
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
