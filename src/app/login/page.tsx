/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/v1/users/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.data.accessToken);
      localStorage.setItem("userName", res.data.data.user.name);
      router.push("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl mb-6 text-center font-bold">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 w-full rounded"
        >
          Login
        </button>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
