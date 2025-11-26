"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserPlus,
  User,
  Camera,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

// Upload Image to Imgbb
const uploadToImgbb = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data?.data?.url; // Return image URL
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  // HANDLE GOOGLE SIGN IN
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          role: "customer",
          createdAt: new Date(),
        }),
      });

      toast.success("Logged in with Google!");
      router.push("/");
    } catch (error) {
      toast.error("Google Sign-in failed!");
    } finally {
      setLoading(false);
    }
  };

  // HANDLE EMAIL REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!image) return toast.error("Upload your profile picture!");
    if (!fullName.trim()) return toast.error("Name is required!");
    if (!email || !password) return toast.error("Email & password are required!");
    if (password.length < 6) return toast.error("Password must be at least 6 characters!");

    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      // Upload Profile Image to imgbb
      const photoURL = await uploadToImgbb(image);

      // Update Firebase Profile
      await updateProfile(res.user, { displayName: fullName, photoURL });

      // Save to MongoDB
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          name: fullName,
          email,
          photoURL,
          role: "customer",
          createdAt: new Date(),
        }),
      });

      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already registered!");
      } else {
        toast.error("Registration failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Join <span className="text-green-600">ProductHub</span>
        </h2>
        <p className="text-center text-gray-500 mt-2">Create your account</p>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleRegister}>

          {/* Image Upload */}
          <div className="flex justify-center">
            <label className="relative cursor-pointer group">
              <div className="size-20 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-100 transition group-hover:shadow-md">
                {image ? (
                  <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-gray-400 w-8 h-8" />
                )}
              </div>
              <input type="file" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
            </label>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Your Name</label>
            <div className="flex items-center border rounded-lg px-3 mt-1">
              <User className="text-gray-400 w-5 h-5" />
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your name" className="w-full px-3 py-2 outline-none text-gray-700 bg-transparent" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Email</label>
            <div className="flex items-center border rounded-lg px-3 mt-1">
              <Mail className="text-gray-400 w-5 h-5" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full px-3 py-2 outline-none text-gray-700 bg-transparent" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Password</label>
            <div className="flex items-center border rounded-lg px-3 mt-1">
              <Lock className="text-gray-400 w-5 h-5" />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full px-3 py-2 outline-none text-gray-700 bg-transparent" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition">
            <UserPlus size={20} />
            {loading ? "Please wait..." : "Create Account"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <span className="flex-1 h-px bg-gray-200"></span>
            <span className="text-gray-400 text-sm">or</span>
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          {/* Google Sign-In */}
          <button type="button" disabled={loading} onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 py-2.5 rounded-lg transition">
            <FaGoogle size={20} />
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

        </form>

        {/* Footer Link */}
        <p className="text-center text-gray-500 text-sm mt-5">
          Already have an account?
          <Link href="/login" className="text-green-600 font-medium hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
