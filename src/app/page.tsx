"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      const name = localStorage.getItem("userName");
      setUserName(name);
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Welcome, {userName}</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
