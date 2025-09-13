"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login: React.FC = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!Email || !Password) {
        toast.error("Email and Password are required!");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/Login/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Email, Password }),
        });

        const result = await response.json();
        console.log("Login API response:", result);

        if (response.ok) {
          if (!result.userId) {
            toast.error("No user ID received from server");
            setLoading(false);
            return;
          }

          toast.success("Login successful!");
          setTimeout(() => {
            router.push(`/Backend/Stash/Dashboard?id=${encodeURIComponent(result.userId)}`);
          }, 1000);
        } else {
          toast.error(result.message || "Login failed!");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An error occurred while logging in!");
      } finally {
        setLoading(false);
      }
    },
    [Email, Password, router]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <ToastContainer className="text-xs" />

      <div className="w-full max-w-sm bg-blue-950 text-black rounded-lg shadow-xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 blur-2xl z-0" />
        <div className="relative z-10 flex flex-col items-center text-center mb-6">
          <Image src="/stash-logo.png" alt="Stash" width={200} height={60} className="mb-4" />
          <p className="text-xs font-medium text-white">
            Authorized access only. Use the credentials provided.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <input
            type="email"
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-md text-xs border text-blacl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-md text-xs border text-blacl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-sm text-white font-semibold rounded-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <div className="relative z-10 mt-4 text-center">
          <p className="text-xs text-gray-400">
            Don't have an account?{" "}
            <Link href="/Register" className="text-cyan-400 hover:underline">
              Register here
            </Link>
          </p>
        </div>

        <p className="mt-3 text-xs text-center text-cyan-400">Stash Login</p>
      </div>
    </div>
  );
};

export default Login;
