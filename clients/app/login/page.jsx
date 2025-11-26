"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, LogIn, Chrome } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        
        {/* Logo / Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome to <span className="text-green-600">ProductHub</span>
        </h2>
        <p className="text-center text-gray-500 mt-2">Sign in to continue</p>

        {/* Form */}
        <form className="mt-8 space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Email</label>
            <div className="flex items-center border rounded-lg px-3 mt-1">
              <Mail className="text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 outline-none text-gray-700 bg-transparent"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Password</label>
            <div className="flex items-center border rounded-lg px-3 mt-1">
              <Lock className="text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-3 py-2 outline-none text-gray-700 bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            <LogIn size={20} />
            Login
          </button>

          {/* Or line */}
          <div className="flex items-center gap-3">
            <span className="flex-1 h-px bg-gray-200"></span>
            <span className="text-gray-400 text-sm">or</span>
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 py-2.5 rounded-lg transition"
          >
            <Chrome size={20} />
            Continue with Google
          </button>

        </form>

        {/* Bottom Links */}
        <p className="text-center text-gray-500 text-sm mt-5">
          Don’t have an account?
          <Link href="/register" className="text-green-600 font-medium hover:underline ml-1">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}
