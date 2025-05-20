/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
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

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users/me");
      setUserData(response.data.data);
    } catch (error: any) {
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.error || "Logout failed");
    }
  };

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

  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900 ${poppins.className}`}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="w-full max-w-sm bg-slate-800/70 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-slate-700/50"
        >
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"
            ></motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-4 text-slate-300"
          >
            Loading your profile...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8 ${poppins.className}`}
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
        className="max-w-4xl mx-auto z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-slate-800/70 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Header */}
          <motion.div
            className="bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-10 text-white relative overflow-hidden"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 mix-blend-overlay" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative z-10">
              <div>
                <motion.h1
                  className={`text-3xl font-bold ${pacifico.className}`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  {userData?.username}'s Profile
                </motion.h1>
                <motion.p
                  className="text-violet-200 mt-2 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {userData?.isAdmin ? "Administrator" : "Member"} Account
                </motion.p>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <motion.button
                  onClick={fetchUserData}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="px-4 py-2  bg-blue-600 bg-opacity-20 rounded-xl hover:bg-opacity-30 transition flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </motion.button>
                <motion.button
                  onClick={logout}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="px-4 py-2 bg-blue-600 bg-opacity-20 rounded-xl hover:bg-opacity-30 transition flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
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
                  Logout
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Profile Content */}
          <motion.div className="px-8 py-10" variants={containerVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <motion.div className="space-y-6" variants={itemVariants}>
                <h2 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-3">
                  Basic Information
                </h2>
                <div>
                  <p className="text-sm text-slate-400">Username</p>
                  <p className="text-slate-100 font-medium text-lg">
                    {userData?.username}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-slate-100 font-medium text-lg">
                    {userData?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Full Name</p>
                  <p className="text-slate-100 font-medium text-lg">
                    {userData?.fullName || (
                      <span className="text-slate-500 italic">
                        Not provided
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Account Status</p>
                  <div className="flex items-center mt-1">
                    <motion.span
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className={`inline-block w-3 h-3 rounded-full mr-3 ${
                        userData?.isVerified ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    ></motion.span>
                    <p className="text-slate-100 font-medium text-lg">
                      {userData?.isVerified ? "Verified" : "Not Verified"}
                      {!userData?.isVerified && (
                        <Link
                          href="/verify-email"
                          className="text-violet-400 hover:underline text-sm ml-2"
                        >
                          (Verify Now)
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Account Details */}
              <motion.div className="space-y-6" variants={itemVariants}>
                <h2 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-3">
                  Account Details
                </h2>
                <div>
                  <p className="text-sm text-slate-400">User ID</p>
                  <p className="text-slate-100 font-medium text-lg break-all">
                    <Link
                      href={`/profile/${userData?._id}`}
                      className="text-violet-400 hover:underline"
                    >
                      {userData?._id}
                    </Link>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Member Since</p>
                  <p className="text-slate-100 font-medium text-lg">
                    {new Date(userData?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Last Updated</p>
                  <p className="text-slate-100 font-medium text-lg">
                    {new Date(userData?.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Status</p>
                  <div className="flex items-center mt-1">
                    <motion.span
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 1, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className={`inline-block w-3 h-3 rounded-full mr-3 ${
                        userData?.status === "online"
                          ? "bg-emerald-500"
                          : "bg-slate-500"
                      }`}
                    ></motion.span>
                    <p className="text-slate-100 font-medium text-lg capitalize">
                      {userData?.status || "offline"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bio Section */}
            {(userData?.bio || userData?.isAdmin) && (
              <motion.div className="mt-10" variants={itemVariants}>
                <h2 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-3">
                  {userData?.isAdmin ? "Admin Notes" : "About Me"}
                </h2>
                {userData?.bio ? (
                  <p className="text-slate-300 mt-4 leading-relaxed">
                    {userData.bio}
                  </p>
                ) : (
                  <div className="mt-4 text-slate-500 italic">
                    {userData?.isAdmin
                      ? "No admin notes yet"
                      : "No bio provided"}
                    <Link
                      href="/profile/edit"
                      className="text-violet-400 hover:underline ml-2"
                    >
                      Add one now
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Link
                  href="/profile/edit"
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-500 hover:to-indigo-500 transition flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Profile
                </Link>
              </motion.div>

              {userData?.isAdmin && (
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  <Link
                    href="/admin/dashboard"
                    className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-500 hover:to-orange-500 transition flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Admin Dashboard
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
