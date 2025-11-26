"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, LogIn, } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

// Save user to MongoDB if new
const saveUserToDB = async (user) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: "customer",
      createdAt: new Date(),
    }),
  });
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ==============================
  // GOOGLE LOGIN
  // ==============================
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);

      // If new user → save to MongoDB
      await saveUserToDB(result.user);

      toast.success(`Welcome, ${result.user.displayName}`);
      window.location.href = "/";
    } catch (error) {
      toast.error("Google sign-in failed!");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // EMAIL LOGIN
  // ==============================
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Email & Password required!");

    try {
      setLoading(true);
      const res = await signInWithEmailAndPassword(auth, email, password);

      toast.success("Login Successful!");
      window.location.href = "/";
    } catch (error) {
      if (error.code === "auth/invalid-login-credentials" || error.code === "auth/invalid-credential") {
        toast.error("Invalid Email or Password");
      } else {
        toast.error("Login Failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // UI
  // ==============================
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        
        {/* Logo / Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome to <span className="text-green-600">ProductHub</span>
        </h2>
        <p className="text-center text-gray-500 mt-2">Sign in to continue</p>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleEmailLogin}>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Email</label>
            <div className="flex items-center border rounded-lg px-3 mt-1">
              <Mail className="text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            <LogIn size={20} />
            {loading ? "Please wait..." : "Login"}
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
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 py-2.5 rounded-lg transition"
          >
            <FaGoogle size={20} />
            {loading ? "Signing in..." : "Continue with Google"}
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
