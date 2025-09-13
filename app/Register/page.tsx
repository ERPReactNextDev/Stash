"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";

const Register: React.FC = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Role, setRole] = useState("");
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [ReferenceID, setReferenceID] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (Firstname && Lastname) {
      const refID = `${Firstname.charAt(0).toUpperCase()}${Lastname.charAt(0).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceID(refID);
    }
  }, [Firstname, Lastname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Email || !Password || !Role || !Firstname || !Lastname) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/Register/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email, Password, Role, Firstname, Lastname, ReferenceID }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Registration successful!");
        setTimeout(() => router.push("/Login"), 1000);
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <ToastContainer className="text-xs" />
      <div className="w-full max-w-sm bg-blue-950 text-black rounded-lg shadow-xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-green-500/10 blur-2xl z-0" />
        <div className="relative z-10 flex flex-col items-center text-center mb-6">
          <Image src="/stash-logo.png" alt="Stash" width={200} height={60} className="mb-4" />
          <p className="text-xs font-medium text-white">Fill in the details to create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <input
            type="text"
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-md text-xs border text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-md text-xs border text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={Role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 rounded-md text-xs border text-black focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled hidden>Role</option>
            <option value="Admin">Admin</option>
            <option value="Guest">Guest</option>
          </select>

          <input
            type="text"
            placeholder="Firstname"
            value={Firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="w-full p-2 rounded-md text-xs border text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Lastname"
            value={Lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="w-full p-2 rounded-md text-xs border text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="hidden"
            value={ReferenceID}
            readOnly
            className="w-full p-2 rounded-md text-xs bg-gray-700 text-gray-400 border border-gray-600 cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-sm text-white font-semibold rounded-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          <p className="mt-4 text-xs text-center text-gray-400">
            Already have an account?{" "}
            <Link href="/Login" className="text-cyan-400 hover:underline font-medium">
              Login here
            </Link>
          </p>

        </form>

        <p className="mt-3 text-xs text-center text-cyan-400">Stash | Admin Registration</p>
      </div>
    </div>
  );
};

export default Register;
